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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";

import useTokenList from "../../../core/hooks/useTokenList";
import ControlledSelect from "../../Inputs/ControlledSelect";

import PathwayImageDropzone from "./PathwayContentDropzone";

export default function Pathways({ control, register, setValue }: any) {
  const router = useRouter();
  const { tokens, defaultMainnetDAIToken } = useTokenList();
  const {
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "pathways", // unique name for your Field Array
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
              isInvalid={errors.pathways && errors.pathways[index].title}
            >
              <FormLabel htmlFor={`pathways[${index}].title`}>
                Pathway title
              </FormLabel>
              <HStack>
                <Input
                  placeholder="Pathway title here..."
                  {...register(`pathways[${index}].title`, {
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
                  Remove Pathway
                </Button>
              </HStack>
              <FormErrorMessage>
                {errors.pathways &&
                  errors.pathways[index].title &&
                  errors.pathways[index].title.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.pathways && errors.pathways[index].description}
            >
              <FormLabel htmlFor={`pathways[${index}].description`}>
                Description
              </FormLabel>
              <Textarea
                placeholder="Pathway description here..."
                {...register(`pathways[${index}].description`, {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.pathways &&
                  errors.pathways[index].description &&
                  errors.pathways[index].description.message}
              </FormErrorMessage>
            </FormControl>

            <PathwayImageDropzone
              nestIndex={index}
              formLabel="NFT image reward"
              {...{ register, setValue, errors }}
            />

            <HStack w="full" alignItems="center">
              <FormControl
                isInvalid={
                  errors.pathways && errors.pathways[index].rewardAmout
                }
              >
                <FormLabel htmlFor={`pathways[${index}].rewardAmout`}>
                  Pathway reward amount
                </FormLabel>
                <NumberInput step={1_000} defaultValue={1_000}>
                  <NumberInputField
                    placeholder=""
                    {...register(`pathways[${index}].rewardAmout`, {
                      required: "This is required",
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>
                  {errors.pathways &&
                    errors.pathways[index].rewardAmout &&
                    errors.pathways[index].rewardAmout.message}
                </FormErrorMessage>
              </FormControl>

              <ControlledSelect
                control={control}
                name={`pathways[${index}].currency`}
                id={item.id}
                label="Reward currency"
                rules={{
                  required: "This is required",
                }}
                defaultValue={{
                  label: `${defaultMainnetDAIToken.symbol} - ${defaultMainnetDAIToken.name}`,
                  value: `${defaultMainnetDAIToken.chainId}:${defaultMainnetDAIToken.address}`,
                }}
                options={tokens.map((token) => ({
                  label: `${token.symbol} - ${token.name}`,
                  value: `${token.chainId}:${token.address}`,
                }))}
              />
            </HStack>

            <ControlledSelect
              control={control}
              name={`pathways[${index}].difficulty`}
              id={item.id}
              label="Difficulty"
              rules={{
                required: "This is required",
              }}
              options={difficultyOptions}
            />

            <ControlledSelect
              control={control}
              name={`pathways[${index}].prerequisites`}
              id={item.id}
              label="Prerequisites"
              isMulti
              options={existingQuestsOptions}
            />
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
        + New Pathway
      </Button>
    </VStack>
  );
}
