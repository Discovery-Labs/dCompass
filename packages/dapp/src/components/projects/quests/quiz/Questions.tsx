import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Divider,
} from "@chakra-ui/react";
// import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";
import ControlledSelect from "../../../Inputs/ControlledSelect";

import OptionsFieldArray from "./OptionsFieldArray";

export default function Questions({ control, register }: any) {
  // const router = useRouter();

  const {
    watch,
    formState: { errors },
  } = useFormContext();

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
            <FormControl
              isInvalid={errors.questions && errors.questions[index].question}
            >
              <FormLabel htmlFor={`questions[${index}].question`}>
                Question
              </FormLabel>
              <HStack>
                <Input
                  placeholder="Question here..."
                  {...register(`questions[${index}].question`, {
                    required: "This is required",
                    maxLength: {
                      value: 150,
                      message: "Maximum length should be 150",
                    },
                  })}
                />
                <Button
                  colorScheme="secondary"
                  onClick={() => remove(index)}
                  aria-label="remove"
                  size="md"
                  px="10"
                >
                  Remove Question
                </Button>
              </HStack>
              <FormErrorMessage>
                {errors.questions &&
                  errors.questions[index].question &&
                  errors.questions[index].question.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.questions && errors.questions[index].options}
            >
              <FormLabel htmlFor={`questions[${index}].options`}>
                Options
              </FormLabel>
              <OptionsFieldArray nestIndex={index} {...{ control, register }} />
              <FormErrorMessage>
                {errors.questions &&
                  errors.questions[index].options &&
                  errors.questions[index].options.message}
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

            <Divider bg="none" py="5" />
          </VStack>
        );
      })}

      <Button
        w="full"
        type="button"
        onClick={() => {
          append({
            question: "",
            options: [""],
            answer: "",
          });
        }}
      >
        + New Question
      </Button>
    </VStack>
  );
}
