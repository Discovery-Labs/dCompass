import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";
import IconWithState from "./custom/IconWithState";

const CreateElectionPage: React.FunctionComponent = () => {
  const router = useRouter();
  function goBack() {
    router.back();
  }

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "candidates", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  function onSubmit(values: any) {
    console.log(values);
  }

  return (
    <>
      <Heading>Create project</Heading>
      <VStack w="full" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name} {...getRootProps()}>
          <FormLabel htmlFor="logo">Logo</FormLabel>
          <Input
            placeholder="Logo"
            {...register("logo", {
              required: "This is required",
            })}
            {...getInputProps()}
          />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <Center h="150px" bg="aqua.300" color="space" borderRadius="4">
              Drag something here or select
            </Center>
          )}
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

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

        <FormControl isInvalid={errors.name}>
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
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.name}>
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
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.name}>
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
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <Flex p="4" w="full" justify="space-around">
          <IconWithState icon="discord" active />
          <IconWithState icon="gitbook" />
          <IconWithState icon="github" />
          <IconWithState icon="twitter" />
        </Flex>

        {/* <Button
          mt={4}
          colorScheme="aqua"
          isLoading={isSubmitting}
          type="submit"
        >
          Next
        </Button> */}
      </VStack>
    </>
  );
};

export default CreateElectionPage;
