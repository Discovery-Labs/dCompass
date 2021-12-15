import { CloseIcon } from "@chakra-ui/icons";
import {
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const BadgeImageDropzone = ({
  nestIndex,
  register,
  setValue,
  errors,
  formLabel,
}: any) => {
  const [files, setFiles] = useState([]);

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
    <Flex key={file.name}>
      <Image
        borderRadius="2"
        objectFit="cover"
        boxSize="150px"
        src={file.preview}
      />
      <Flex pl="4" d="column" v="full" alignSelf="center">
        <IconButton
          colorScheme="pink"
          onClick={() => setFiles([])}
          aria-label="Remove Image"
          icon={<CloseIcon />}
        />
        <Text>{file.path}</Text>
      </Flex>
    </Flex>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <FormControl
      isInvalid={errors.badges && errors.badges[nestIndex].image}
      {...getRootProps()}
    >
      <FormLabel htmlFor={`badges[${nestIndex}].image`}>{formLabel}</FormLabel>
      {files && thumbs}

      {files.length === 0 && isDragActive && (
        <Center
          _hover={{ cursor: "pointer" }}
          h="150px"
          bg="aqua.200"
          color="space"
          borderRadius="4"
        >
          Drop the files here ...
          <Input
            type="file"
            placeholder="Image"
            {...register(`badges[${nestIndex}].image`)}
            {...getInputProps()}
          />
        </Center>
      )}

      {files.length === 0 && !isDragActive && (
        <Center
          w="full"
          _hover={{ cursor: "pointer" }}
          h="150px"
          bg="aqua.300"
          color="space"
          borderRadius="4"
        >
          Drag something here or select
          <Input
            type="file"
            placeholder="Image"
            {...register(`badges[${nestIndex}].image`)}
            {...getInputProps()}
          />
        </Center>
      )}

      <FormErrorMessage>
        {errors.badges &&
          errors.badges[nestIndex].image &&
          errors.badges[nestIndex].image.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default BadgeImageDropzone;
