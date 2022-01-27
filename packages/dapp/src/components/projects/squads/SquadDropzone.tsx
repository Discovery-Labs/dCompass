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

const SquadDropzone = ({
  nestIndex,
  register,
  getValues,
  setValue,
  errors,
  formLabel,
}: any) => {
  const [files, setFiles] = useState<Array<any>>([]);

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
          colorScheme="secondary"
          onClick={() => setFiles([])}
          aria-label="Remove Image"
          icon={<CloseIcon />}
        />
        <Text>{file.path}</Text>
      </Flex>
    </Flex>
  ));

  useEffect(() => {
    const squadsImage = getValues(`squads[${nestIndex}].image`);

    if (squadsImage) {
      const logoFiles = [];
      logoFiles.push(squadsImage[0]);
      setFiles(
        // eslint-disable-next-line sonarjs/no-identical-functions
        logoFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }
  }, [getValues, nestIndex]);

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
      <FormLabel htmlFor={`squads[${nestIndex}].image`}>{formLabel}</FormLabel>
      {files && thumbs}

      {files.length === 0 && (
        <Button>
          Upload
          <Input
            type="file"
            placeholder="Image"
            {...register(`squads[${nestIndex}].image`)}
            {...getInputProps()}
          />
        </Button>
      )}

      <FormErrorMessage>
        {errors.squads &&
          errors.squads[nestIndex].image &&
          errors.squads[nestIndex].image.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SquadDropzone;
