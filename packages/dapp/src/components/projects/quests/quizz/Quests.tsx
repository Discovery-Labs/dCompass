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

import OptionsFieldArray from "./OptionsFieldArray";

export default function Quests({ control, register, setValue }: any) {
  // const router = useRouter();

  const {
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "quests", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  return (
    <VStack w="full">
      {fields.map((item, index) => {
        return (
          <VStack w="full" key={item.id}>
            <FormControl isInvalid={errors.quests && errors.quests[index].name}>
              <FormLabel htmlFor={`quests[${index}].name`}>
                Quest title
              </FormLabel>
              <HStack>
                <Input
                  placeholder="Question here..."
                  {...register(`quests[${index}].name`, {
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
                {errors.quests &&
                  errors.quests[index].name &&
                  errors.quests[index].name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.quests && errors.quests[index].options}
            >
              <FormLabel htmlFor={`quests[${index}].options`}>
                Options
              </FormLabel>
              <OptionsFieldArray nestIndex={index} {...{ control, register }} />
              <FormErrorMessage>
                {errors.quests &&
                  errors.quests[index].options &&
                  errors.quests[index].options.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.quests && errors.quests[index].name}>
              <FormLabel htmlFor={`quests[${index}].answer`}>
                Correct Answer
              </FormLabel>
              <Input
                placeholder="Omega"
                {...register(`quests[${index}].answer`, {
                  required: "This is required",
                  maxLength: {
                    value: 150,
                    message: "Maximum length should be 150",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.quests &&
                  errors.quests[index].answer &&
                  errors.quests[index].answer.message}
              </FormErrorMessage>
            </FormControl>
            <Divider bg="none" py="5" />
          </VStack>
        );
      })}

      <Button
        w="full"
        type="button"
        onClick={() => {
          append({ name: "", options: ["0x0000000000000"] });
        }}
      >
        + New Question
      </Button>
    </VStack>
  );
}
