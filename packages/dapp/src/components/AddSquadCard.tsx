import {
  VStack,
  HStack,
  Divider,
  Button,
  Input,
  InputGroup,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Center,
  Image,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiX } from "react-icons/fi";

import { capitalize } from "../core/helpers";

import AddMembersCard from "./AddMembersCard";
import ControllerPlus from "./Inputs/ControllerPlus";

function AddSquadCard() {
  const [files, setFiles] = useState([]);
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "squads", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  console.log({ fields });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: useCallback(
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
    ),
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

  useEffect(() => {
    append({ name: "founders", image: null, members: [] });
    return () => {
      remove();
    };
  }, [append, remove]);

  return (
    <>
      <VStack w="full">
        <Flex w="full" d="colum">
          <FormControl isInvalid={errors.squads}>
            <FormLabel color="white" htmlFor="squads">
              Add Squad
            </FormLabel>
            {fields.map((field, index) => (
              <VStack py="2">
                <InputGroup w="full">
                  <Input
                    key={`squads.${field.id}.name.value`} // important to include key with field's id
                    {...register(`squads.${index}.name.value`)}
                  />
                </InputGroup>
                <InputGroup w="full" {...getRootProps()}>
                  <Input
                    {...register(`squads.${index}.image.value`, {
                      required: "This is required",
                    })}
                    {...getInputProps()}
                    placeholder="Super rare digital art"
                  />
                  {thumbs}
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <Center
                      h="150px"
                      bg="aqua.300"
                      w="full"
                      color="space"
                      borderRadius="4"
                    >
                      Drag something here or select
                    </Center>
                  )}
                </InputGroup>
              </VStack>
            ))}
            <FormErrorMessage>
              {errors.squads && errors.squads.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            w="100%"
            mb="5"
            variant="outline"
            onClick={() => append({ name: "", image: null })}
          >
            + Add Squad
          </Button>
        </Flex>
      </VStack>
      <Divider />
      {fields.map((squad: Record<string, any>, i: number) => (
        <AddMembersCard memberType={squad.name} removeSquad={() => remove(i)} />
      ))}
    </>
  );
}

export default AddSquadCard;
