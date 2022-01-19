import {
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
  Text,
  Alert,
  AlertIcon,
  Tag,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useFieldArray, useFormContext } from "react-hook-form";

import useTokenList from "../../../core/hooks/useTokenList";
import ImageDropzone from "../../custom/ImageDropzone";
import ControlledSelect from "../../Inputs/ControlledSelect";

export default function PathwayForm() {
  const router = useRouter();
  const { tokens } = useTokenList();
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { rewardAmount, rewardCurrency, rewardUserCap } = watch();
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

  const rewardPerUser = parseFloat(rewardAmount) / parseInt(rewardUserCap, 10);
  const erc20Options = tokens.map((token) => ({
    label: `${token.symbol} - ${token.name}`,
    value: `${token.chainId}:${token.address}`,
  }));

  return (
    <VStack w="full">
      <FormControl isInvalid={errors.title}>
        <FormLabel htmlFor="title">Pathway title</FormLabel>
        <HStack>
          <Input
            placeholder="Pathway title here..."
            {...register(`title`, {
              required: "This is required",
              maxLength: {
                value: 150,
                message: "Maximum length should be 150",
              },
            })}
          />
        </HStack>
        <FormErrorMessage>
          {errors.title && errors.title.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.description}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          placeholder="Pathway description here..."
          {...register(`description`, {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>

      <ImageDropzone
        isRequired
        fieldName="image"
        label="NFT image reward"
        {...{ register, setValue, errors }}
      />

      <HStack w="full" alignItems="center">
        <FormControl isInvalid={errors.rewardAmount}>
          <FormLabel htmlFor="rewardAmount">Total reward amount</FormLabel>
          <NumberInput step={10_000} defaultValue={10_000}>
            <NumberInputField
              placeholder=""
              {...register(`rewardAmount`, {
                required: "This is required",
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            {errors.rewardAmount && errors.rewardAmount.message}
          </FormErrorMessage>
        </FormControl>

        <ControlledSelect
          control={control}
          name="rewardCurrency"
          label="Reward currency"
          rules={{
            required: "This is required",
          }}
          options={erc20Options}
          placeholder="WETH, DAI,..."
        />
      </HStack>

      <VStack alignItems="center" w="full">
        <FormControl isInvalid={errors.rewardUserCap}>
          <FormLabel htmlFor="rewardUserCap">Reward user cap</FormLabel>
          <NumberInput step={1_000} defaultValue={1_000}>
            <NumberInputField
              roundedBottom="none"
              placeholder=""
              {...register(`rewardUserCap`, {
                required: "This is required",
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {rewardCurrency && (
            <Alert roundedBottom="lg" w="full" status="info">
              <AlertIcon />
              <Text fontSize="md">
                A user that claims the pathway rewards will receive{" "}
                <Tag>
                  {rewardPerUser}{" "}
                  {rewardCurrency?.label &&
                    rewardCurrency.label.split(" - ")[0]}
                </Tag>
              </Text>
            </Alert>
          )}
          <FormErrorMessage>
            {errors.rewardUserCap && errors.rewardUserCap.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>

      <ControlledSelect
        control={control}
        name="difficulty"
        label="Difficulty"
        rules={{
          required: "This is required",
        }}
        options={difficultyOptions}
      />

      <ControlledSelect
        control={control}
        name="prerequisites"
        label="Prerequisites"
        isMulti
        options={existingQuestsOptions}
      />
      <Divider bg="none" py="5" />
    </VStack>
  );
}
