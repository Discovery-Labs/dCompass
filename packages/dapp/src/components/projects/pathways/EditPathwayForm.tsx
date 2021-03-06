import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import dynamic from "next/dynamic";
import useCustomColor from "core/hooks/useCustomColor";
import { useState, useEffect } from "react";

import { REQUIRED_FIELD_LABEL } from "../../../core/constants";
import CodeEditorPreview from "../../custom/CodeEditorPreview";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});
const EditPathwayForm: React.FunctionComponent = () => {
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<{
    title: string;
    description: string;
    slogan: string;
  }>();

  useEffect(() => {
    const descriptionValues = getValues("description");

    if (descriptionValues) {
      setCode(descriptionValues);
    }
  }, [getValues]);

  // if (loading) return <Spinner />;
  // if (error)
  //   return (
  //     <Alert status="error">
  //       <AlertIcon />
  //       <AlertTitle mr={2}>Network error</AlertTitle>
  //       <AlertDescription>{error.message}</AlertDescription>
  //     </Alert>
  //   );
  return (
    <>
      <Heading>Edit pathway</Heading>
      <VStack w="full" align="start">
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <HStack>
            <Input
              placeholder="Title here..."
              {...register(`title`, {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 80,
                  message: "Maximum length should be 80",
                },
              })}
            />
          </HStack>
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.slogan}>
          <FormLabel htmlFor="slogan">Short Description</FormLabel>
          <Input
            placeholder="Slogan"
            {...register("slogan", {
              required: REQUIRED_FIELD_LABEL,
              maxLength: {
                value: 180,
                message: "Maximum length should be 180",
              },
            })}
          />
          <FormErrorMessage>
            {errors.slogan && errors.slogan.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>

          <CodeEditor
            value={code}
            language="markdown"
            placeholder="Pathway description (markdown)"
            {...register("description", {
              required: REQUIRED_FIELD_LABEL,
            })}
            onChange={(e) => {
              setCode(e.target.value);
              setValue("description", e.target.value);
            }}
            style={{
              fontSize: "16px",
            }}
            className={codeEditorScheme}
            padding={15}
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>

        {code && (
          <Box w="full">
            <CodeEditorPreview code={code} />
          </Box>
        )}
      </VStack>
    </>
  );
};

export default EditPathwayForm;
