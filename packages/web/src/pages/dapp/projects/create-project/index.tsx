import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Image,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsArrow90DegLeft } from "react-icons/bs";
import Link from "next/link";
function CreateProject() {
  const cardBg = useColorModeValue("violet.100", "blue.700");
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [ogImageUrl, setOgImageUrl] = useState<string>("");
  const logoRef = useRef<HTMLImageElement>(null);
  const ogImageRef = useRef<HTMLImageElement>(null);

  const onSubmit = async (values: Record<string, unknown>) => {
    console.log(values); // eslint-disable-line no-console
    const formData = new FormData();
    const [logoFile] = values.logo as File[];
    const [ogImageFile] = values.ogImage as File[];
    if (logoRef || ogImageRef) {
      if (logoRef) {
        formData.append("image", logoFile);
      }
      if (ogImageRef) {
        formData.append("background", ogImageFile);
      }
      const result = await fetch(`REST_API/storage`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      console.log({ result });
      const cids = await result.json();
      const refs = { logo: logoRef.current, ogImage: ogImageRef.current } as {
        logo: HTMLImageElement | null;
        ogImage: HTMLImageElement | null;
      };
      ["logo", "ogImage"].forEach((key) => {
        if (cids[key]) {
          values[key] = {
            original: {
              src: `ipfs://${cids[key]}`,
              mimeType: "image/*",
              width: refs[key as "logo" | "ogImage"]?.width,
              height: refs[key as "logo" | "ogImage"]?.height,
            },
          };
        } else {
          delete values[key];
        }
      });
    }
  };
  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      const logo = logoRef.current as HTMLImageElement;
      const ogImage = ogImageRef.current as HTMLImageElement;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log(reader.result);
        if (input.name === "logo") {
          logo.src = reader.result as string;
        }
        if (input.name === "ogImage") {
          ogImage.src = reader.result as string;
        }
      });
      reader.readAsDataURL(file);
    },
    []
  );
  // TODO: fix this issue https://github.com/chakra-ui/chakra-ui/issues/3020
  return (
    <Stack
      bg={cardBg}
      rounded={"xl"}
      p={{ base: 4, sm: 6, md: 8 }}
      spacing={{ base: 8 }}
    >
      <HStack py="5">
        <Link href="/dapp/projects/" passHref>
          <Button leftIcon={<BsArrow90DegLeft />}>BACK</Button>
        </Link>
      </HStack>
      <Heading>Create your project</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid
          columns={{
            sm: 1,
            md: 2,
          }}
          spacing={2}
        >
          <VStack>
            <FormControl px="5" isInvalid={errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="Project name"
                color={"gray.700"}
                _placeholder={{
                  color: "gray.500",
                }}
                bg={useColorModeValue("violet.50", "violet.100")}
                {...register("name", {
                  required: "This is required",
                  minLength: {
                    value: 2,
                    message: "Minimum length should be 2",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl px="5" mt={4} isInvalid={errors.description}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="description"
                color={"gray.700"}
                _placeholder={{
                  color: "gray.500",
                }}
                placeholder="Description"
                bg={useColorModeValue("violet.50", "violet.100")}
                {...register("description", {
                  required: "This is required",
                  minLength: {
                    value: 2,
                    message: "Minimum length should be 2",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl px="5" mt={4} isInvalid={errors.github}>
              <FormLabel htmlFor="github">Github</FormLabel>
              <Input
                id="github"
                name="github"
                color={"gray.700"}
                _placeholder={{
                  color: "gray.500",
                }}
                placeholder="Github"
                bg={useColorModeValue("violet.50", "violet.100")}
              />
              <FormErrorMessage>
                {errors.github && errors.github.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>
          <VStack>
            <FormControl px="5" isInvalid={errors.website}>
              <FormLabel htmlFor="website">Website</FormLabel>
              <Input
                id="website"
                color={"gray.700"}
                name="website"
                _placeholder={{
                  color: "gray.500",
                }}
                placeholder="Website"
                bg={useColorModeValue("violet.50", "violet.100")}
              />
              <FormErrorMessage>
                {errors.website && errors.website.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl px="5" mt={4} isInvalid={errors.twitter}>
              <FormLabel htmlFor="twitter">Twitter</FormLabel>
              <Input
                id="twitter"
                name="twitter"
                color={"gray.700"}
                _placeholder={{
                  color: "gray.500",
                }}
                placeholder="Twitter"
                bg={useColorModeValue("violet.50", "violet.100")}
              />
              <FormErrorMessage>
                {errors.twitter && errors.twitter.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </SimpleGrid>
        <FormControl px="5" mt={4} isInvalid={errors.logo}>
          <FormLabel htmlFor="logo">Logo</FormLabel>
          <Image alt="logo" ref={logoRef} src={logoUrl} />
          <Input
            {...register("logo")}
            id="logo"
            type="file"
            defaultValue=""
            onChange={onFileChange}
            color={"gray.700"}
            _placeholder={{
              color: "gray.500",
            }}
            placeholder="Logo"
            bg={useColorModeValue("violet.50", "violet.100")}
          />
          <FormErrorMessage>
            {errors.logo && errors.logo.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl px="5" mt={4} isInvalid={errors.ogImage}>
          <FormLabel htmlFor="ogImage">OG Image</FormLabel>
          <Image alt="ogImage" ref={ogImageRef} src={ogImageUrl} />
          <Input
            {...register("ogImage")}
            id="ogImage"
            type="file"
            defaultValue=""
            onChange={onFileChange}
            color={"gray.700"}
            _placeholder={{
              color: "gray.500",
            }}
            placeholder="OG Image"
            bg={useColorModeValue("violet.50", "violet.100")}
          />
          <FormErrorMessage>
            {errors.ogImage && errors.ogImage.message}
          </FormErrorMessage>
        </FormControl>
        <Box align="right">
          <Button
            w="full"
            size="lg"
            colorScheme="blue"
            mt={5}
            isLoading={isSubmitting}
            type="submit"
          >
            SAVE
          </Button>
        </Box>
      </form>
    </Stack>
  );
}

export default CreateProject;
