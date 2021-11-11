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
import React, { useEffect } from "react";
// import { useDropzone } from "react-dropzone";
import { useFieldArray, useFormContext } from "react-hook-form";

import MembersFieldArray from "./MembersFieldArray";

export default function Squads({ control, register }: any) {
  const router = useRouter();
  // const [files, setFiles] = useState([]);

  const {
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "squads", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  // const onDrop = useCallback(
  //   (acceptedFiles, rejectedFiles, e) => {
  //     if (acceptedFiles) {
  //       console.log({ e });
  //       const { name } = e.target;
  //       setValue(name, e.target.files);
  //       setFiles(
  //         acceptedFiles.map((file: File) =>
  //           Object.assign(file, {
  //             preview: URL.createObjectURL(file),
  //           })
  //         )
  //       );
  //     }
  //   },
  //   [setValue]
  // );

  // TODO: there's currently a bug for useDropzone with useFieldArray
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   accept: "image/*",
  //   onDrop,
  // });

  // const thumbs = files.map((file: any) => (
  //   <div key={file.name}>
  //     <Image src={file.preview} />
  //   </div>
  // ));

  // useEffect(
  //   () => () => {
  //     // Make sure to revoke the data uris to avoid memory leaks
  //     files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  //   },
  //   [files]
  // );

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
              >
                <FormLabel htmlFor={`squads[${index}].image`}>
                  Squad image
                </FormLabel>
                <Input
                  type="file"
                  placeholder="Image"
                  {...register(`squads[${index}].image`)}
                />
                {/* {thumbs} */}
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
          append({ name: "", members: ["0x0000000000000"], image: null });
        }}
      >
        + New Squad
      </Button>
    </VStack>
  );
}
