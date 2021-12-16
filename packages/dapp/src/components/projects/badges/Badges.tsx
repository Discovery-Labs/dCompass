import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Divider,
  Textarea,
} from "@chakra-ui/react";
// import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";

import ControlledSelect from "../../Inputs/ControlledSelect";

import BadgeImageDropzone from "./BadgeContentDropzone";

export default function Badges({ control, register, setValue }: any) {
  // const router = useRouter();

  const {
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "badges", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });
  const difficultyOptions = [
    {
      label: "Beginner",
      value: "beginner",
      colorScheme: "white",
    },
    {
      label: "Intermediate",
      value: "intermediate",
      colorScheme: "yellow",
    },
    {
      label: "Advanced",
      value: "advanced",
      colorScheme: "blue",
    },
    {
      label: "Expert",
      value: "expert",
      colorScheme: "red",
    },
    {
      label: "Wizard",
      value: "wizard",
      colorScheme: "black",
    },
  ];
  const existingQuestsOptions = [
    {
      label: "Gitcoin Applicant Quest",
      value: "gitcoin-applicant-quest-id",
      colorScheme: "purple",
    },
    {
      label: "FDD Applicant Quest",
      value: "fdd-applicant-quest-id",
      colorScheme: "purple",
    },
    {
      label: "Gitcoin Grant donator",
      value: "gitcoin-grant-donator-quest",
      colorScheme: "purple",
    },
  ];
  return (
    <VStack w="full">
      {fields.map((item, index) => {
        return (
          <VStack w="full" key={item.id}>
            <FormControl
              isInvalid={errors.badges && errors.badges[index].title}
            >
              <FormLabel htmlFor={`badges[${index}].title`}>
                Badge title
              </FormLabel>
              <HStack>
                <Input
                  placeholder="Badge title here..."
                  {...register(`badges[${index}].title`, {
                    required: "This is required",
                    maxLength: {
                      value: 150,
                      message: "Maximum length should be 150",
                    },
                  })}
                />
                <Button
                  colorScheme="pink"
                  onClick={() => remove(index)}
                  aria-label="remove"
                  size="md"
                  px="10"
                >
                  Remove Badge
                </Button>
              </HStack>
              <FormErrorMessage>
                {errors.badges &&
                  errors.badges[index].title &&
                  errors.badges[index].title.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.badges && errors.badges[index].description}
            >
              <FormLabel htmlFor={`badges[${index}].description`}>
                Description
              </FormLabel>
              <Textarea
                placeholder="Badge description here..."
                {...register(`badges[${index}].description`, {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.badges &&
                  errors.badges[index].description &&
                  errors.badges[index].description.message}
              </FormErrorMessage>
            </FormControl>

            <BadgeImageDropzone
              nestIndex={index}
              formLabel="Badge image"
              {...{ register, setValue, errors }}
            />

            <ControlledSelect
              control={control}
              name={`badges[${index}].difficulty`}
              id={item.id}
              label="Difficulty"
              rules={{
                required: "This is required",
              }}
              options={difficultyOptions}
            />

            <ControlledSelect
              control={control}
              name={`badges[${index}].prerequisites`}
              id={item.id}
              label="Prerequisites"
              isMulti
              options={existingQuestsOptions}
            />
            <Divider py="5" />
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
        + New Badge
      </Button>
    </VStack>
  );
}
