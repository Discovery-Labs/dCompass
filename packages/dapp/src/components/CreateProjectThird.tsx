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
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useFormContext } from "react-hook-form";

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
    getValues,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "nfts", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  useEffect(() => {
    const values = getValues();
    console.log({ values });
    append("");
    return () => {
      remove();
    };
  }, [append, remove, getValues]);

  function onSubmit(values: any) {
    console.log(values);
  }

  return (
    <>
      <Heading>Create project</Heading>
      <VStack w="full" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <FormControl isInvalid={errors.nfts} {...getRootProps()}>
              <FormLabel htmlFor="logo">Genesis Squad NFT</FormLabel>
              <Input
                placeholder="Super rare NFT"
                {...register(`nfts.${index}.value`, {
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
                {errors.nfts && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          );
        })}
      </VStack>
    </>
  );
};

export default CreateElectionPage;
