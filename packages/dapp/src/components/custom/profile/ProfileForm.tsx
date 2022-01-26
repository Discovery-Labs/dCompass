import { useQuery } from "@apollo/client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  IconButton,
  Stack,
  Image,
  Link,
  Textarea,
  Box,
  Select,
  SimpleGrid,
  HStack,
  VStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Spinner,
  Text,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import NextLink from "next/link";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { SiGithub, SiTwitter } from "react-icons/si";

import { Web3Context } from "../../../contexts/Web3Provider";
import { GITHUB_HOST, TWITTER_HOST } from "../../../core/constants";
import { COUNTRIES } from "../../../core/constants/countries";
import { emojis } from "../../../core/constants/emojis";
import { ALL_PROJECTS_QUERY } from "../../../graphql/projects";
import ControlledSelect from "../../Inputs/ControlledSelect";
import CenteredFrame from "../../layout/CenteredFrame";
import Card from "../Card";
import IconWithState from "../IconWithState";
import NotConnectedCard from "../NotConnectedCard";

import AddGitHubAccountScreen from "./AddGithubAccountScreen";
import AddTwitterAccountScreen from "./AddTwitterAccountScreen";

const ProfileForm = ({
  submitButtonLabel = "Save",
  projectId,
  projectName,
  onCloseForm,
}: {
  submitButtonLabel?: string;
  projectId?: string;
  projectName?: string;
  onCloseForm?: () => void;
}) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { account, self } = useContext(Web3Context);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isTwitterOpen,
    onOpen: onTwitterOpen,
    onClose: onTwitterClose,
  } = useDisclosure();
  const { loading, error, data } = useQuery(ALL_PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [imageURL, setImageURL] = useState<string>();
  const [backgroundURL, setBackgroundURL] = useState<string>();
  const image = useRef(null);
  const [github, setGithub] = useState<string>();
  const [twitter, setTwitter] = useState<string>();
  const background = useRef(null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // fetch from Ceramic
    (async () => {
      setIsLoadingProfile(true);
      if (account && self && data?.getAllProjects) {
        const result = await self.get("basicProfile");
        console.log(result);
        const webAccounts = await self.get("alsoKnownAs");
        if (webAccounts?.accounts && webAccounts.accounts.length > 0) {
          const githubAccount = webAccounts.accounts.find(
            (acc: any) => acc.host === GITHUB_HOST
          );
          if (githubAccount) {
            setGithub(
              `${githubAccount?.protocol}://${githubAccount?.host}/${githubAccount?.id}`
            );
          }
          const twitterAccount = webAccounts.accounts.find(
            (acc: any) => acc.host === TWITTER_HOST
          );
          if (twitterAccount) {
            setTwitter(
              `${twitterAccount?.protocol}://${twitterAccount?.host}/${twitterAccount?.id}`
            );
          }
        }
        if (!result) {
          return setIsLoadingProfile(false);
        }

        Object.entries(result).forEach(([key, value]) => {
          if (["image", "background"].includes(key)) {
            const {
              original: { src: url },
            } = value as any;
            const match = url.match(/^ipfs:\/\/(.+)$/);
            if (match) {
              const ipfsUrl = `//ipfs.io/ipfs/${match[1]}`;
              if (key === "image") {
                setImageURL(ipfsUrl);
              }
              if (key === "background") {
                setBackgroundURL(ipfsUrl);
              }
            }
          } else if (key === "affiliations") {
            const foundProjects = data.getAllProjects
              .filter((project) => value.includes(project.id))
              .map((project) => ({
                label: project.name,
                value: project.id,
              }));
            setValue(key, foundProjects);
          } else {
            setValue(key, value);
          }
        });
        setIsLoadingProfile(false);
      }
    })();
  }, [account, self, setValue, data?.getAllProjects]);

  const onFileChange = useCallback((event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    const img = image.current as any;
    const bg = background.current as any;
    reader.addEventListener("load", () => {
      console.log(reader.result); // eslint-disable-line no-console
      if (input.name === "image") {
        img.src = reader.result;
      }
      if (input.name === "background") {
        bg.src = reader.result;
      }
    });
    reader.readAsDataURL(file);
  }, []);

  const onSubmit = async (values: Record<string, any>) => {
    console.log(values);
    const formData = new FormData();
    formData.append("type", "image/*");
    const [imageFile] = values.image;
    const [backgroundFile] = values.background;
    if (imageFile || backgroundFile) {
      if (image && imageFile) {
        formData.append("image", imageFile);
      }
      if (background && backgroundFile) {
        formData.append("background", backgroundFile);
      }
      const cids = await fetch("/api/image-storage", {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then((response) => {
          return response.cids;
        });

      ["image", "background"].forEach((key) => {
        console.log(cids[key]);
        if (cids[key]) {
          values[key] = {
            original: {
              src: `ipfs://${cids[key]}`,
              mimeType: "image/*",
              // TODO: change hardcoded width & height
              width: 200,
              height: 200,
            },
          };
        } else {
          delete values[key];
        }
      });
    }

    if (!imageFile) {
      delete values.image;
    }
    if (!backgroundFile) {
      delete values.background;
    }
    console.log("af", values.affiliations);
    await self.client.dataStore.merge("basicProfile", {
      ...values,
      affiliations: values.affiliations.map(
        (affiliation: { value: string; label: string }) => affiliation.value
      ),
    });
    if (onCloseForm) {
      onCloseForm();
    }
    return toast({
      title: projectName ? "Application submitted!" : "Profile saved!",
      description: projectName
        ? `Members of ${projectName} will review your application shortly.`
        : `Changes successfuly saved.`,
      status: "success",
      position: "bottom-right",
      duration: 6000,
      isClosable: true,
      variant: "subtle",
    });
  };

  if (error) return `Error! ${error?.message}`;

  return account ? (
    <Box maxWidth={1100} transition="0.5s ease-out">
      <Box margin="8">
        {isLoadingProfile || loading ? (
          <Stack>
            <Progress size="xs" isIndeterminate />
            <Text>Loading profile configuration</Text>
          </Stack>
        ) : (
          <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={2} spacing={10}>
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  placeholder="anon"
                  borderColor="purple.500"
                  {...register("name", {
                    maxLength: {
                      value: 150,
                      message: "Maximum length should be 150",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl w="full" align="left">
                <FormLabel>Social Accounts</FormLabel>
                {github ? (
                  <Link
                    marginTop={0}
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconButton
                      cursor="pointer"
                      variant="unstyled"
                      aria-label="Social medias and resources"
                      w="8"
                      h="8"
                      as={SiGithub}
                      _hover={{ color: "accentDark.300" }}
                    />
                  </Link>
                ) : (
                  <>
                    <IconButton
                      cursor="pointer"
                      variant="unstyled"
                      aria-label="Social medias and resources"
                      w="8"
                      h="8"
                      as={SiGithub}
                      onClick={onOpen}
                      _hover={{ color: "accentDark.300" }}
                    />
                    <Modal onClose={onClose} isOpen={isOpen} size="4xl">
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Verify GitHub account</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <VStack w="full">
                            <AddGitHubAccountScreen onCloseModal={onClose} />
                          </VStack>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </>
                )}
                {twitter ? (
                  <Link
                    marginTop={0}
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconButton
                      cursor="pointer"
                      variant="unstyled"
                      aria-label="Social medias and resources"
                      w="8"
                      h="8"
                      as={SiTwitter}
                      _hover={{ color: "accentDark.300" }}
                    />
                  </Link>
                ) : (
                  <>
                    <IconButton
                      cursor="pointer"
                      variant="unstyled"
                      aria-label="Social medias and resources"
                      w="8"
                      h="8"
                      as={SiTwitter}
                      onClick={onTwitterOpen}
                      _hover={{ color: "accentDark.300" }}
                    />
                    <Modal
                      onClose={onTwitterClose}
                      isOpen={isTwitterOpen}
                      size="4xl"
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Verify Twitter account</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <VStack w="full">
                            <AddTwitterAccountScreen
                              onCloseModal={onTwitterClose}
                            />
                          </VStack>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={10}>
              <FormControl isInvalid={errors.image}>
                <FormLabel htmlFor="image">Profile Image</FormLabel>
                <Image
                  ref={image}
                  src={imageURL}
                  boxSize={imageURL ? "5rem" : "0rem"}
                />
                <Input
                  {...register("image")}
                  borderColor="purple.500"
                  type="file"
                  onChange={onFileChange}
                  placeholder="image"
                />
                <FormErrorMessage>
                  {errors.image && errors.image.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.background}>
                <FormLabel htmlFor="background">Header Background</FormLabel>
                <Image
                  ref={background}
                  src={backgroundURL}
                  boxSize={imageURL ? "5rem" : "0rem"}
                />
                <Input
                  type="file"
                  borderColor="purple.500"
                  {...register("background")}
                  onChange={onFileChange}
                  placeholder="background"
                />
                <FormErrorMessage>
                  {errors.background && errors.background.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={1}>
              <ControlledSelect
                control={control}
                name="affiliations"
                id="affiliations"
                label="Affiliations"
                isMulti
                colorScheme="purple"
                options={data.getAllProjects.map(
                  ({ id, name }: { id: string; name: string }) => ({
                    value: id,
                    label: name,
                  })
                )}
              />
            </SimpleGrid>

            <FormControl isInvalid={errors.description}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                placeholder="Web3 and blockchain enthusiast"
                borderColor="purple.500"
                {...register("description", {
                  maxLength: {
                    value: 420,
                    message: "Maximum length should be 420",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <SimpleGrid columns={3} spacing={10}>
              <FormControl isInvalid={errors.url}>
                <FormLabel htmlFor="url">Website</FormLabel>
                <Input
                  placeholder="ens-or-website.eth"
                  borderColor="purple.500"
                  {...register("url", {
                    maxLength: 240,
                  })}
                />
                <FormErrorMessage>
                  {errors.url && errors.url.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.emoji}>
                <FormLabel htmlFor="emoji">Emoji</FormLabel>
                <Select borderColor="purple.500" {...register("emoji")}>
                  <option value={undefined}>Select an emoji</option>
                  {emojis.map((emoji) => (
                    <option value={emoji} key={emoji}>
                      {emoji}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.emoji && errors.emoji.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.birthDate}>
                <FormLabel htmlFor="birthDate">Birthdate</FormLabel>
                <Input
                  type="date"
                  borderColor="purple.500"
                  placeholder="birthDate"
                  {...register("birthDate")}
                />
                <FormErrorMessage>
                  {errors.birthDate && errors.birthDate.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={10}>
              <FormControl isInvalid={errors.residenceCountry}>
                <FormLabel htmlFor="residenceCountry">Country</FormLabel>
                <Select
                  placeholder="Select your country of residence"
                  borderColor="purple.500"
                  {...register("residenceCountry")}
                >
                  {COUNTRIES.map(
                    ({ name, iso2 }: { name: string; iso2: string }) => (
                      <option value={iso2} key={iso2}>
                        {name}
                      </option>
                    )
                  )}
                </Select>
                <FormErrorMessage>
                  {errors.residenceCountry && errors.residenceCountry.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.homeLocation}>
                <FormLabel htmlFor="homeLocation">Location</FormLabel>
                <Input
                  placeholder="London"
                  borderColor="purple.500"
                  {...register("homeLocation", {
                    maxLength: 140,
                  })}
                />
                <FormErrorMessage>
                  {errors.homeLocation && errors.homeLocation.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <Button
              mt={4}
              colorScheme="purple"
              isLoading={isSubmitting}
              type="submit"
            >
              {submitButtonLabel}
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotConnectedCard />
      </Card>
    </CenteredFrame>
  );
};

export default ProfileForm;
