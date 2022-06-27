import {
  Alert,
  AlertIcon,
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import useCustomColor from "core/hooks/useCustomColor";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { REQUIRED_FIELD_LABEL } from "../../../core/constants";
import useTokenList from "../../../core/hooks/useTokenList";
import ImageDropzone from "../../custom/ImageDropzone";
import ControlledSelect from "../../Inputs/ControlledSelect";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});

export default function PathwayForm({ isWithRewards, withRewards }: any) {
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();

  const { chainId } = useWeb3React();
  const { tokens } = useTokenList();
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const descriptionValues = getValues("description");

    if (descriptionValues) {
      setCode(descriptionValues);
    }
  }, [getValues]);

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

  return (
    <VStack w="full" align="start">
      <FormControl isInvalid={errors.title}>
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

      <ImageDropzone
        {...{
          register,
          setValue,
          errors,
          fieldName: "image",
          label: "Pathway NFT Image reward",
          isRequired: true,
        }}
      />

      {/* <FormControl isInvalid={errors.image}>
        <FormLabel htmlFor="image">NFT reward image</FormLabel>

        <Input
          type="file"
          placeholder="NFT reward image"
          {...register("image")}
        />

        <FormErrorMessage>
          {errors.image && errors.image.message}
        </FormErrorMessage>
      </FormControl> */}

      <Checkbox onChange={(e) => withRewards(e)}>ERC20 Rewards</Checkbox>
      {isWithRewards ? (
        <VStack w="full">
          <Flex w="full" direction={["column", "column", "row"]} gap="2">
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
          </Flex>
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
                  dCompass takes a fee of 15% on the total of the pathway
                  rewards.
                </Heading>
                <Text fontSize="md">
                  10% goes to the dCompass treasury and 5% goes to the Gitcoin
                  DAO treasury.
                </Text>
              </VStack>
            </Alert>
          )}
        </VStack>
      ) : (
        <></>
      )}

      <VStack alignItems="center" w="full">
        <FormControl isInvalid={errors.rewardUserCap}>
          <FormLabel htmlFor="rewardUserCap">Reward user cap</FormLabel>
          <NumberInput step={1_000} defaultValue={1_000}>
            <NumberInputField
              roundedBottom={isWithRewards ? "none" : "auto"}
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
          {rewardCurrency && isWithRewards && (
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

      {/* <ControlledSelect
        control={control}
        name="prerequisites"
        label="Prerequisites"
        isMulti
        options={existingPathways}
        hasStickyGroupHeaders
      /> */}
      <Divider bg="none" py="5" />
    </VStack>
  );
}
