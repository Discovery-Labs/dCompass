import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageDropzone = ({
  register,
  setValue,
  errors,
  isRequired = false,
  fieldName,
  label,
  isMultiple = false,
}: any) => {
  const [files, setFiles] = useState([]);
  const fieldOptions = isRequired
    ? {
        required: "This is required",
      }
    : {};

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles, e) => {
      if (acceptedFiles) {
        // setValue(acceptedFiles[0].name, acceptedFiles);
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const thumbs = files.map((file: any) => (
    <Flex direction={["column", "row"]} w="full" key={file.name}>
      {file.type.includes("image") && (
        <Image
          alt="file preview"
          borderRadius="2"
          objectFit="cover"
          boxSize="150px"
          src={file.preview}
        />
      )}
      <VStack p="2" w="full" align="start" justify="center">
        <IconButton
          colorScheme="secondary"
          onClick={() =>
            setFiles(
              isMultiple ? files.filter((f: any) => f.name !== file.name) : []
            )
          }
          aria-label="Remove Image"
          icon={<CloseIcon />}
        />
        <Text noOfLines={1}>{file.path}</Text>
      </VStack>
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
    <FormControl isInvalid={errors[fieldName]}>
      <FormLabel htmlFor={fieldName}>{label}</FormLabel>
      {(isMultiple || files.length === 0) && (
        <Button {...getRootProps()} mb="4">
          Upload
          <Input
            type="file"
            placeholder={label}
            {...register(fieldName, fieldOptions)}
            {...getInputProps()}
          />
        </Button>
      )}
      {files && thumbs}

      <FormErrorMessage>
        {errors[fieldName] && errors[fieldName].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default ImageDropzone;
