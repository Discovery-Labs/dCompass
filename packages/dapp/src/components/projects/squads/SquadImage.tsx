import {
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default ({ nestIndex, register, setValue, errors }: any) => {
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

  return (
    <FormControl
      isInvalid={errors.squads && errors.squads[nestIndex].image}
      {...getRootProps()}
    >
      <FormLabel htmlFor={`squads[${nestIndex}].image`}>Squad image</FormLabel>
      <Input
        type="file"
        placeholder="Image"
        {...register(`squads[${nestIndex}].image`)}
        {...getInputProps()}
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
        {errors.squads &&
          errors.squads[nestIndex].image &&
          errors.squads[nestIndex].image.message}
      </FormErrorMessage>
    </FormControl>
  );
};
