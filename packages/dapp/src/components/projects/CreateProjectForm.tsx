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

const CreateProjectForm: React.FunctionComponent = () => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles, e) => {
      if (acceptedFiles) {
        const { name } = e.target;
        console.log({ name });
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
    <>
      <Heading>Create project</Heading>
      <FormControl isInvalid={errors.name} {...getRootProps()}>
        <FormLabel htmlFor="logo">Logo</FormLabel>
        <Input
          {...register("logo", {
            required: "This is required",
          })}
          {...getInputProps()}
          placeholder="Logo"
        />
        {thumbs}
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <Center
            _hover={{ cursor: "pointer" }}
            h="150px"
            bg="aqua.300"
            color="space"
            borderRadius="4"
          >
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
    </>
  );
};

export default CreateProjectForm;
