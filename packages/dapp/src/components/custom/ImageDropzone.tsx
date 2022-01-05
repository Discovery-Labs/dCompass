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
    <FormControl isInvalid={errors[fieldName]}>
      <FormLabel htmlFor={fieldName}>{label}</FormLabel>
      {files && thumbs}

      {files.length === 0 && (
        <Button {...getRootProps()}>
          Upload
          <Input
            type="file"
            placeholder={label}
            {...register(fieldName, fieldOptions)}
            {...getInputProps()}
          />
        </Button>
      )}

      <FormErrorMessage>
        {errors[fieldName] && errors[fieldName].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default ImageDropzone;