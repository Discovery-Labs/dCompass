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
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { SiGithub } from "react-icons/si";

import { Web3Context } from "../../../contexts/Web3Provider";
import { GITHUB_HOST } from "../../../core/constants";
import { COUNTRIES } from "../../../core/constants/countries";
import { emojis } from "../../../core/constants/emojis";

const ProfileForm = ({
  submitButtonLabel = "Save",
}: {
  submitButtonLabel: string;
}) => {
  const { account, self } = useContext(Web3Context);
  const [imageURL, setImageURL] = useState<string>();
  const [backgroundURL, setBackgroundURL] = useState<string>();
  const image = useRef(null);
  const [github, setGithub] = useState<string>();
  const background = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    // fetch from Ceramic
    (async () => {
      if (account && self) {
        const result = await self.get("basicProfile");
        const webAccounts = await self.get("alsoKnownAs");
        if (webAccounts.accounts.length > 0) {
          const githubAccount = webAccounts.accounts.find(
            (acc: any) => acc.host === GITHUB_HOST
          );
          setGithub(
            `${githubAccount?.protocol}://${githubAccount?.host}/${githubAccount?.id}`
          );
        }
        console.log({ webAccounts });
        if (!result) return;
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
          } else {
            setValue(key, value);
          }
        });
      }
    })();
  }, [account, self, setValue]);

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
    await self.client.dataStore.merge("basicProfile", values);
  };
  return (
    <Box margin="0 auto" maxWidth={1100} transition="0.5s ease-out">
      <Box margin="8">
        <Box marginY={22}>
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
                  <NextLink href="/profile/github" passHref>
                    <IconButton
                      cursor="pointer"
                      variant="unstyled"
                      aria-label="Social medias and resources"
                      w="8"
                      h="8"
                      as={SiGithub}
                      _hover={{ color: "accentDark.300" }}
                    />
                  </NextLink>
                )}
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={10}>
              <FormControl isInvalid={errors.image}>
                <FormLabel htmlFor="image">Profile Image</FormLabel>
                <Image ref={image} src={imageURL} boxSize="5rem" />
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
                <Image ref={background} src={backgroundURL} boxSize="5rem" />
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
            <SimpleGrid columns={2} spacing={10}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileForm;
