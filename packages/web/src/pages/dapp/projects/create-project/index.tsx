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
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
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

  function onSubmit(values: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve("success");
      }, 3000);
    });
  }
  return (
    <Stack
      bg={cardBg}
      rounded={"xl"}
      p={{ base: 4, sm: 6, md: 8 }}
      spacing={{ base: 8 }}
    >
      <HStack py="5">
        <Link href="/dapp/projects/" passHref>
          <Button leftIcon={<BsArrow90DegLeft />}>Go Back</Button>
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
            <FormControl isInvalid={errors.name}>
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

            <FormControl mt={4} isInvalid={errors.description}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                color={"gray.700"}
                _placeholder={{
                  color: "gray.500",
                }}
                placeholder="Description"
                bg={useColorModeValue("violet.50", "violet.100")}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={errors.github}>
              <FormLabel htmlFor="github">Github</FormLabel>
              <Input
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
            <FormControl isInvalid={errors.website}>
              <FormLabel htmlFor="website">Website</FormLabel>
              <Input
                color={"gray.700"}
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

            <FormControl mt={4} isInvalid={errors.twitter}>
              <FormLabel htmlFor="twitter">Twitter</FormLabel>
              <Input
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

            <FormControl mt={4} isInvalid={errors.logo}>
              <FormLabel htmlFor="logo">Logo</FormLabel>
              <Input
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

            <FormControl mt={4} isInvalid={errors.ogImage}>
              <FormLabel htmlFor="ogImage">OG Image</FormLabel>
              <Input
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
          </VStack>
        </SimpleGrid>
        <Box align="right">
          <Button
            colorScheme="blue"
            mt={5}
            isLoading={isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </Box>
      </form>
    </Stack>
  );
}

export default CreateProject;
