import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
  Divider,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Alert,
  AlertIcon,
  Tag,
  Heading,
} from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import { useWeb3React } from "@web3-react/core";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import {
  difficultyOptions,
  REQUIRED_FIELD_LABEL,
} from "../../../core/constants";
import useTokenList from "../../../core/hooks/useTokenList";
import ImageDropzone from "../../custom/ImageDropzone";
import ControlledSelect from "../../Inputs/ControlledSelect";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});

export default function PathwayForm() {
  const { codeEditorScheme } = useCustomColor();

  const { chainId } = useWeb3React();
  const { tokens } = useTokenList();
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { rewardAmount, rewardCurrency, rewardUserCap } = watch();

  const rewardPerUser = parseFloat(rewardAmount) / parseInt(rewardUserCap, 10);
  const erc20Options = tokens.map((token) => ({
    label: `${token.symbol} - ${token.name}`,
    value: `${token.chainId}:${token.address}`,
  }));

  const nativeToken = useMemo(() => {
    const isMatic = chainId === 80001 || chainId === 137;
    const token = isMatic
      ? {
          label: "MATIC",
          value: "MATIC",
        }
      : {
          label: "ETH",
          value: "ETH",
        };
    setValue("rewardCurrency", token);
    return { token, isMatic };
  }, [chainId, setValue]);

  // const existingGitcoinQuestsOptions = [
  //   {
  //     label: "Gitcoin Applicant Quest",
  //     value: "gitcoin-applicant-quest-id",
  //     colorScheme: "purple",
  //   },
  //   {
  //     label: "FDD Applicant Quest",
  //     value: "fdd-applicant-quest-id",
  //     colorScheme: "purple",
  //   },
  //   {
  //     label: "Gitcoin Grant donator",
  //     value: "gitcoin-grant-donator-quest",
  //     colorScheme: "purple",
  //   },
  // ];
  // const demoProjectWithPathwaysAsPrereqs = [
  //   {
  //     label: "Gitcoin DAO",
  //     options: existingGitcoinQuestsOptions,
  //   },
  // ];

  // const existingPathwaysOptions = data.getAllPathwaysByProjectId
  //   .filter((pathway: Pathway) => pathway.quests?.length > 0)
  //   .map((pathway: Pathway) => {
  //     return {
  //       label: pathway.title,
  //       options: pathway.quests.map((quest) => ({
  //         label: quest.name,
  //         value: quest.id,
  //         colorScheme: "purple",
  //       })),
  //     };
  //   });

  return (
    <VStack w="full">
      <FormControl isInvalid={errors.title}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <HStack>
          <Input
            placeholder="Title here..."
            {...register(`title`, {
              required: REQUIRED_FIELD_LABEL,
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
        <CodeEditor
          language="markdown"
          placeholder="Pathway description (markdown)"
          {...register("description", {
            required: REQUIRED_FIELD_LABEL,
          })}
          onChange={(e) => {
            const { name } = e.target;
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

      <ImageDropzone
        isRequired
        fieldName="image"
        label="NFT image reward"
        {...{ register, setValue, errors }}
      />

      <VStack w="full">
        <HStack w="full" alignItems="center">
          <FormControl isInvalid={errors.rewardAmount}>
            <FormLabel htmlFor="rewardAmount">Total reward amount</FormLabel>
            <NumberInput
              step={nativeToken.isMatic ? 10_000 : 5}
              defaultValue={nativeToken.isMatic ? 10_000 : 5}
            >
              <NumberInputField
                placeholder=""
                {...register(`rewardAmount`, {
                  required: REQUIRED_FIELD_LABEL,
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
              required: REQUIRED_FIELD_LABEL,
            }}
            options={[nativeToken.token, ...erc20Options]}
            placeholder="WETH, DAI,..."
          />
        </HStack>
        {rewardAmount && (
          <Alert
            rounded="lg"
            w="full"
            status={errors.rewardAmount ? "error" : "warning"}
          >
            <VStack pr="4" w="30%">
              <AlertIcon />
              <Text fontSize={"sm"}>Total with fee</Text>
              <Tag colorScheme={errors.rewardAmount ? "red" : "primary"}>
                {parseFloat(rewardAmount) +
                  (parseFloat(rewardAmount) * 15) / 100}{" "}
                {rewardCurrency.label}
              </Tag>
            </VStack>

            <VStack w="70%">
              <Heading as="h4" size="md">
                dCompass takes a fee of 15% on the total of the pathway rewards.
              </Heading>
              <Text fontSize="md">
                10% goes to the dCompass treasury and 5% goes to the Gitcoin DAO
                treasury.
              </Text>
            </VStack>
          </Alert>
        )}
      </VStack>

      <VStack alignItems="center" w="full">
        <FormControl isInvalid={errors.rewardUserCap}>
          <FormLabel htmlFor="rewardUserCap">Reward user cap</FormLabel>
          <NumberInput step={1_000} defaultValue={1_000}>
            <NumberInputField
              roundedBottom="none"
              placeholder="Number of max. claims"
              {...register(`rewardUserCap`, {
                required: REQUIRED_FIELD_LABEL,
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
          required: REQUIRED_FIELD_LABEL,
        }}
        options={difficultyOptions}
      />

      {/* <ControlledSelect
        control={control}
        name="prerequisites"
        label="Prerequisites"
        isMulti
        options={existingPathwaysOptions}
        hasStickyGroupHeaders
      /> */}
      <Divider bg="none" py="5" />
    </VStack>
  );
}
