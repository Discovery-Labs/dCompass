import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Divider,
  Heading,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
// import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";
import { REQUIRED_FIELD_LABEL } from "../../../../core/constants";
import useCustomColor from "../../../../core/hooks/useCustomColor";
import ControlledSelect from "../../../Inputs/ControlledSelect";

import OptionsFieldArray from "./OptionsFieldArray";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});

export default function Questions({ control, register }: any) {
  // const router = useRouter();

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [code, setCode] = useState<Record<number, string>>();
  const { codeEditorScheme } = useCustomColor();
  const { questions } = errors as any;
  const currentValues = watch();
  console.log({ currentValues });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "questions", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  return (
    <VStack w="full">
      {fields.map((item, index) => {
        return (
          <VStack w="full" key={item.id}>
            <Heading>Section {index + 1}</Heading>
            <FormControl
              isInvalid={
                questions && questions[index] && !!questions[index].content
              }
            >
              <FormLabel htmlFor={`questions[${index}].content`}>
                Content
              </FormLabel>
              <CodeEditor
                language="markdown"
                placeholder="Content related to the question (markdown)"
                {...register(`questions[${index}].content`, {
                  required: REQUIRED_FIELD_LABEL,
                })}
                onChange={(e) => {
                  setCode((code) => ({ ...code, [index]: e.target.value }));
                  setValue(`questions[${index}].content`, e.target.value);
                }}
                style={{
                  fontSize: "16px",
                }}
                className={codeEditorScheme}
                padding={15}
              />
              <FormErrorMessage>
                {questions &&
                  questions[index] &&
                  questions[index].question &&
                  questions[index].question.content}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                questions && questions[index] && !!questions[index].question
              }
            >
              <FormLabel htmlFor={`questions[${index}].question`}>
                Question
              </FormLabel>
              <Input
                placeholder="Question here..."
                {...register(`questions[${index}].question`, {
                  required: "This is required",
                  maxLength: {
                    value: 200,
                    message: "Maximum length should be 200",
                  },
                })}
              />

              <FormErrorMessage>
                {questions &&
                  questions[index] &&
                  questions[index].question &&
                  questions[index].question.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={
                questions && questions[index] && !!questions[index].options
              }
            >
              <FormLabel htmlFor={`questions[${index}].options`}>
                Answers
              </FormLabel>
              <OptionsFieldArray nestIndex={index} {...{ control, register }} />
              <FormErrorMessage>
                {questions &&
                  questions[index] &&
                  questions[index].options &&
                  questions[index].options.message}
              </FormErrorMessage>
            </FormControl>

            <ControlledSelect
              control={control}
              name={`questions[${index}].answer`}
              label="Correct answer(s)"
              isMulti
              rules={{
                required: "At least one correct answer must be set.",
                minLength: {
                  value: 1,
                  message: "At least one correct answer must be set.",
                },
              }}
              options={
                currentValues.questions[index]?.options?.length > 0
                  ? currentValues.questions[index].options.map(
                      (opt: { value: string }) => ({
                        label: opt.value,
                        value: opt.value,
                        colorScheme: "primary",
                      })
                    )
                  : []
              }
            />
            <Button
              colorScheme="secondary"
              onClick={() => {
                setCode((code) => {
                  if (code) {
                    const newCodes = code;
                    delete newCodes[index];
                    return newCodes;
                  }
                });
                remove(index);
              }}
              aria-label="remove"
              size="md"
              px="10"
            >
              Remove section {index + 1}
            </Button>
            <Divider bg="none" py="5" />
          </VStack>
        );
      })}

      <HStack w="full">
        <Button
          w="full"
          type="button"
          onClick={() => {
            append({
              content: "",
              question: "",
              options: [""],
              answer: "",
            });
          }}
        >
          + New Section
        </Button>
      </HStack>
    </VStack>
  );
}
