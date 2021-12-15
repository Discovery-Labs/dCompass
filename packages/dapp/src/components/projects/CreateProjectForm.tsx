import {
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Image,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

import IconWithState from "../custom/IconWithState";

import LogoDropzone from "./LogoDropzone";

const CreateProjectForm: React.FunctionComponent = () => {
  const router = useRouter();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  function goBack() {
    router.back();
  }
  return (
    <>
      <Heading>Create project</Heading>
      <LogoDropzone {...{ register, setValue, errors, isRequired: true }} />

      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">Project name</FormLabel>
        <Input
          placeholder="Project name"
          {...register("name", {
            required: "This is required",
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

      <FormControl isInvalid={errors.description}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          placeholder="Project description"
          {...register("description", {
            required: "This is required",
            maxLength: {
              value: 1200,
              message: "Maximum length should be 1200",
            },
          })}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.website}>
        <FormLabel htmlFor="website">Website</FormLabel>
        <Input
          placeholder="Website"
          {...register("website", {
            required: "This is required",
            maxLength: {
              value: 50,
              message: "Maximum length should be 50",
            },
          })}
        />
        <FormErrorMessage>
          {errors.website && errors.website.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.whitepaper}>
        <FormLabel htmlFor="whitepaper">Whitepaper</FormLabel>
        <Input
          placeholder="Whitepaper"
          {...register("whitepaper", {
            required: "This is required",
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.whitepaper && errors.whitepaper.message}
        </FormErrorMessage>
      </FormControl>

      <Flex p="4" w="full" justify="space-around">
        <IconWithState icon="discord" active />
        <IconWithState icon="gitbook" />
        <IconWithState icon="github" />
        <IconWithState icon="twitter" />
      </Flex>
    </>
  );
};

export default CreateProjectForm;
