import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Button, HStack } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { BsArrow90DegLeft } from "react-icons/bs";
import Link from "next/link";
function CreateProject() {
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
    <Box>
      <HStack py="5">
        <Link href="/dapp/projects/" passHref>
          <Button leftIcon={<BsArrow90DegLeft />}>Go Back</Button>
        </Link>
      </HStack>
      Create project
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            placeholder="Project name"
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
          <Input placeholder="Description" />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.github}>
          <FormLabel htmlFor="github">Github</FormLabel>
          <Input placeholder="Github" />
          <FormErrorMessage>
            {errors.github && errors.github.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.website}>
          <FormLabel htmlFor="website">Website</FormLabel>
          <Input placeholder="Website" />
          <FormErrorMessage>
            {errors.website && errors.website.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.twitter}>
          <FormLabel htmlFor="twitter">Twitter</FormLabel>
          <Input placeholder="Twitter" />
          <FormErrorMessage>
            {errors.twitter && errors.twitter.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.logo}>
          <FormLabel htmlFor="logo">Logo</FormLabel>
          <Input placeholder="Logo" />
          <FormErrorMessage>
            {errors.logo && errors.logo.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mt={4} isInvalid={errors.ogImage}>
          <FormLabel htmlFor="ogImage">OG Image</FormLabel>
          <Input placeholder="OG Image" />
          <FormErrorMessage>
            {errors.ogImage && errors.ogImage.message}
          </FormErrorMessage>
        </FormControl>

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
    </Box>
  );
}

export default CreateProject;
