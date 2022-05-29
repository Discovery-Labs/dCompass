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
import { Quest } from "../../../core/types";
import QuestionsForm from "./quiz/QuestionsForm";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});
const EditQuestForm = ({ quest }: { quest: Quest }) => {
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

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
      <Heading>Edit quest</Heading>
      <VStack w="full" align="start">
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Title</FormLabel>
          <HStack>
            <Input
              placeholder="Title here..."
              {...register("name", {
                required: REQUIRED_FIELD_LABEL,
                maxLength: {
                  value: 80,
                  message: "Maximum length should be 80",
                },
              })}
            />
          </HStack>
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.slogan}>
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

        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description</FormLabel>

          <CodeEditor
            value={code}
            language="markdown"
            placeholder="Pathway description (markdown)"
            {...register("description", {
              required: REQUIRED_FIELD_LABEL,
            })}
            onChange={(e) => {
              const { name } = e.target;
              setCode(e.target.value);
              setValue(name, e.target.value);
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
        {quest.questType === "quiz" && (
          <Box w="full">
            <QuestionsForm
              questions={quest.questions.map((q) => ({
                choices: q.choices,
                answer: q.answer,
                question: q.question,
              }))}
            />
          </Box>
        )}
      </VStack>
    </>
  );
};

export default EditQuestForm;