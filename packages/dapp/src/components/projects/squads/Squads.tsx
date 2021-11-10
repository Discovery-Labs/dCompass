import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Image,
  FormErrorMessage,
  VStack,
  Flex,
  Box,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useFormContext } from "react-hook-form";

import MembersFieldArray from "./MembersFieldArray";

export default function Squads({ control, register }: any) {
  const router = useRouter();
  const [files, setFiles] = useState([]);

  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "squads", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles, e) => {
      if (acceptedFiles) {
        const { name } = e.target;
        setValue(name, e.target.files);
        setFiles(
          acceptedFiles.map((file: File) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const thumbs = files.map((file: any) => (
    <div key={file.name}>
      <Image src={file.preview} />
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  function goBack() {
    router.back();
  }

  return (
    <VStack w="full">
      <Flex w="full" d="colum">
        {fields.map((item, index) => {
          return (
            <Box key={item.id}>
              <FormControl
                isInvalid={errors.squads && errors.squads[index].name}
              >
                <FormLabel htmlFor={`squads[${index}].name`}>
                  Squad name
                </FormLabel>
                <HStack>
                  <Input
                    placeholder="Squad name"
                    {...register(`squads[${index}].name`, {
                      required: "This is required",
                      maxLength: {
                        value: 150,
                        message: "Maximum length should be 150",
                      },
                    })}
                  />
                  <Button
                    backgroundColor="pink.300"
                    _hover={{
                      bg: "red.500",
                    }}
                    onClick={() => remove(index)}
                    aria-label="remove"
                    size="md"
                    px="10"
                  >
                    Remove Squad
                  </Button>
                </HStack>
                <FormErrorMessage>
                  {errors.squads &&
                    errors.squads[index].name &&
                    errors.squads[index].name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.squads && errors.squads[index].image}
                {...getRootProps()}
              >
                <FormLabel htmlFor={`squads[${index}].image`}>
                  Squad image
                </FormLabel>
                <Input
                  {...register(`squads[${index}].image`)}
                  {...getInputProps()}
                  placeholder="Image"
                />
                {thumbs}
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <Center
                    h="150px"
                    bg="aqua.300"
                    color="space"
                    borderRadius="4"
                  >
                    Drag your super rare squad image here or select
                  </Center>
                )}
                <FormErrorMessage>
                  {errors.squads &&
                    errors.squads[index].image &&
                    errors.squads[index].image.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.squads && errors.squads[index].members}
              >
                <FormLabel htmlFor={`squads[${index}].members`}>
                  Squad members
                </FormLabel>
                <MembersFieldArray
                  nestIndex={index}
                  {...{ control, register }}
                />
                <FormErrorMessage>
                  {errors.squads &&
                    errors.squads[index].members &&
                    errors.squads[index].members.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          );
        })}
      </Flex>

      <Button
        w="full"
        type="button"
        onClick={() => {
          append({ name: "", members: ["0x0000000000000"] });
        }}
      >
        Add another Squad
      </Button>
    </VStack>
  );
}
