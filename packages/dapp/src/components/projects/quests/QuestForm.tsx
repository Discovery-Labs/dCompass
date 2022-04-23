import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Stack,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import useCustomColor from "core/hooks/useCustomColor";
import { Contract, ethers } from "ethers";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Web3Context } from "../../../contexts/Web3Provider";
import { REQUIRED_FIELD_LABEL } from "../../../core/constants";
import useTokenList from "../../../core/hooks/useTokenList";
import { GET_APP_DID } from "../../../graphql/app";
import {
  CREATE_QUEST_MUTATION,
  CREATE_QUIZ_QUEST_MUTATION,
  GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
} from "../../../graphql/quests";
import ImageDropzone from "../../custom/ImageDropzone";
import ControlledSelect from "../../Inputs/ControlledSelect";
import DiscordMemberForm from "./discord/DiscordMemberForm";
import GithubContributorForm from "./github/GithubContributorForm";
import PoapOwnerForm from "./poap/PoapOwnerForm";
import QuestionsForm from "./quiz/QuestionsForm";
import SnapshotForm from "./snapshot/SnapshotForm";
import NFTOwnerForm from "./token/NFTOwnerForm";
import TokenHolderForm from "./token/TokenHolderForm";
import TwitterFollowerForm from "./twitter/TwitterFollowerForm";

type QuestionFormItemType = {
  question: string;
  options: { value: string }[];
  answer: { value: string }[];
};
const questTypeOptions = [
  // {
  //   label: "Snapshot voter",
  //   value: "snapshot-voter",
  // },
  // {
  //   label: "Twitter follower",
  //   value: "twitter-follower",
  // },
  // {
  //   label: "Discord member",
  //   value: "discord-member",
  // },
  // {
  //   label: "Token holder",
  //   value: "token-holder",
  // },
  // {
  //   label: "POAP owner",
  //   value: "poap-owner",
  // },
  // {
  //   label: "Github contributor",
  //   value: "github-contributor",
  // },
  {
    label: "Bounty",
    value: "bounty",
  },
  {
    label: "Quiz",
    value: "quiz",
  },
];

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});

const CreateQuestForm: React.FunctionComponent = () => {
  const router = useRouter();
  const toast = useToast();
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();
  const [submitStatus, setSubmitStatus] = useState<string>("Creating quest");
  const { tokens } = useTokenList();
  const { library, chainId } = useWeb3React();
  const { self, account, contracts } = useContext(Web3Context);
  const { data, loading, error } = useQuery(GET_APP_DID);
  const {
    data: pathwayData,
    loading: pathwayLoading,
    error: pathwayError,
  } = useQuery(GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY, {
    variables: {
      pathwayId: router.query.pathwayId,
    },
  });
  const [createQuizQuestMutation] = useMutation(CREATE_QUIZ_QUEST_MUTATION, {
    refetchQueries: "all",
  });
  const [createQuestMutation] = useMutation(CREATE_QUEST_MUTATION, {
    refetchQueries: "all",
  });

  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const getSelectedTokenContract = (token: string) => {
    const [tokenChainIdStr, tokenAddress] = token.split(":");
    const tokenChainId = parseInt(tokenChainIdStr, 10);
    const tokenInfos = tokens.find(
      (tkn) => tkn.address === tokenAddress && tkn.chainId === tokenChainId
    );
    if (!tokenInfos || !chainId) {
      throw new Error("Token not supported");
    }

    return {
      tokenContract: new Contract(
        tokenAddress,
        tokenInfos.abi,
        library.getSigner()
      ),
      tokenInfos,
    };
  };
  useEffect(() => {
    const descriptionValues = getValues("description");

    if (descriptionValues) {
      setCode(descriptionValues);
    }
  }, [getValues]);

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

  const currentValues = watch();

  const { rewardAmount, rewardCurrency, rewardUserCap } = currentValues;

  const questDetails = {
    "snapshot-voter": <SnapshotForm />,
    "github-contributor": <GithubContributorForm />,
    "twitter-follower": <TwitterFollowerForm />,
    "poap-owner": <PoapOwnerForm />,
    "token-holder": <TokenHolderForm />,
    "nft-owner": <NFTOwnerForm />,
    "discord-member": <DiscordMemberForm />,
    quiz: <QuestionsForm />,
    bounty: "",
    defaultOption: "",
  };
  const questType = (currentValues?.type?.value ||
    "defaultOption") as keyof typeof questDetails;

  function goBack() {
    router.back();
  }

  async function approveTokenAllowance(
    token: string,
    maxApproval = "1000000000000000000000000000000"
  ) {
    setSubmitStatus("Approving token allowance");
    const { tokenContract, tokenInfos } = getSelectedTokenContract(token);
    const newAllowance = ethers.utils.parseUnits(
      maxApproval,
      tokenInfos.decimals
    );
    const res = await tokenContract.approve(
      contracts.BadgeNFT.address,
      newAllowance
    );
    await res.wait(1);
    setSubmitStatus("Token allowance approved!");
    return tokenInfos;
  }

  async function onSubmit(values: Record<string, any>) {
    console.log("submitted", values);
    // TODO: add a field for this
    const isRewardProvider = true;

    // check if the native token is used
    const [, tokenAddressOrSymbol] = values.rewardCurrency.value.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;

    setSubmitStatus("Checking balance");
    let balance = 0;
    const rewardAmnt = parseFloat(values.rewardAmount);
    const feeAmount = (rewardAmnt * 15) / 100;
    const totalToPay = rewardAmnt + feeAmount;
    if (!isNativeToken) {
      const { tokenContract, tokenInfos } = getSelectedTokenContract(
        values.rewardCurrency.value
      );

      balance = parseFloat(
        ethers.utils.formatUnits(
          await tokenContract.balanceOf(account),
          tokenInfos.decimals
        )
      );
      const isValidBalance = balance >= totalToPay;

      if (!isValidBalance) {
        toast({
          title: "Insufficient funds",
          description: `You don't have enough funds to provide the quest rewards in this currency`,
          status: "error",
          position: "bottom-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
        return setError("rewardAmount", {
          message: "Insufficient funds",
        });
      }
    } else {
      balance = parseFloat(
        ethers.utils.formatEther(await library.getBalance(account))
      );
      const isValidBalance = balance >= totalToPay;
      if (!isValidBalance) {
        toast({
          title: "Insufficient funds",
          description: "You don't have enough funds to provide quest rewards",
          status: "error",
          position: "bottom-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
        return setError("rewardAmount", {
          message: "Insufficient funds",
        });
      }
    }

    setSubmitStatus("Generating token URIs");

    const formData = new FormData();
    if (values.image) {
      formData.append(values.name, values.image[0]);
    }
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();

    setSubmitStatus("Creating quest");

    const appDid = data.getAppDID;
    console.log({ appDid });
    const finalValues =
      questType === "quiz"
        ? {
            ...values,
            questions: await Promise.all(
              values.questions.map(
                async ({
                  question,
                  options,
                  answer,
                }: QuestionFormItemType) => ({
                  question,
                  choices: options.map((option) => option.value),
                  answer: JSON.stringify(
                    await self.client.ceramic.did?.createDagJWE(
                      answer.map((a) => a.value),
                      [
                        // logged-in user,
                        self.id,
                        // backend ceramic did
                        appDid,
                      ]
                    )
                  ),
                })
              )
            ),
            image: cids[values.name],
            rewardCurrency: values.rewardCurrency.value,
            rewardAmount: parseFloat(values.rewardAmount),
            rewardUserCap: parseInt(values.rewardUserCap, 10),
            pathwayId: router.query.pathwayId,
          }
        : {
            ...values,
            rewardCurrency: values.rewardCurrency.value,
            image: cids[values.name],
            rewardAmount: parseFloat(values.rewardAmount),
            rewardUserCap: parseInt(values.rewardUserCap, 10),
            pathwayId: router.query.pathwayId,
          };

    const questDoc = await self.client.dataModel.createTile(
      "Quest",
      { ...finalValues, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );

    setSubmitStatus("Signing quest creation");
    const signature = await library.provider.send("personal_sign", [
      JSON.stringify({
        id: questDoc.id.toUrl(),
        pathwayId: router.query.pathwayId,
      }),
      account,
    ]);

    if (isNativeToken) {
      setSubmitStatus("Creating quest on-chain");
      const createQuestOnChainTx = await contracts.BadgeNFT.createBadge(
        questDoc.id.toUrl(),
        pathwayData.getAllQuestsByPathwayId.streamId,
        parseInt(values.rewardUserCap, 10),
        isRewardProvider,
        // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
        account,
        true,
        (rewardAmnt * 1e18).toString(),
        {
          value: (totalToPay * 1e18).toString(),
        }
      );
      await createQuestOnChainTx.wait(1);
      setSubmitStatus("Quest created on-chain");
    } else {
      const tokenDetails = await approveTokenAllowance(
        values.rewardCurrency.value,
        totalToPay.toString()
      );
      const rewardAmount = ethers.utils.parseUnits(
        rewardAmnt.toString(),
        tokenDetails.decimals
      );
      setSubmitStatus("Creating quest on-chain");
      const createQuestOnChainTx = await contracts.BadgeNFT.createBadge(
        questDoc.id.toUrl(),
        pathwayData.getAllQuestsByPathwayId.streamId,
        parseInt(values.rewardUserCap, 10),
        isRewardProvider,
        // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
        values.rewardCurrency.value.split(":")[1],
        false,
        rewardAmount
      );
      await createQuestOnChainTx.wait(1);
      setSubmitStatus("Quest created on-chain");
    }

    const createQuestMutationVariables = {
      input: {
        id: questDoc.id.toUrl(),
        questCreatorSignature: signature.result,
      },
    };

    let result;
    setSubmitStatus("Quest validation");
    if (questType === "quiz") {
      const { data } = await createQuizQuestMutation({
        variables: createQuestMutationVariables,
      });
      result = data.createQuizQuest;
    }
    if (questType === "bounty") {
      const { data } = await createQuestMutation({
        variables: createQuestMutationVariables,
      });
      result = data.createQuizQuest;
    }
    setSubmitStatus("Quest created!");
    // TODO: support different types of quest
    // if (questType === "snapshot-voter") {
    //   const { data } = await createSnapshotVoterQuest({
    //     variables: createQuestMutationVariables,
    //   });
    //   result = data.createSnapshotVoterQuest;
    // }

    console.log({ result });

    return goBack();
  }

  const rewardPerUser = parseFloat(rewardAmount) / parseInt(rewardUserCap, 10);
  const erc20Options = tokens.map((token) => ({
    label: `${token.symbol} - ${token.name}`,
    value: `${token.chainId}:${token.address}`,
  }));

  if (loading || pathwayLoading) {
    <Stack>
      <Progress size="xs" isIndeterminate />
      <Text>Loading...</Text>
    </Stack>;
  }

  if (error || pathwayError)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Network error</AlertTitle>
        <AlertDescription>
          {error?.message || pathwayError?.message}
        </AlertDescription>
      </Alert>
    );

  return (
    <Stack w="full" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading>Create quest</Heading>
      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">Title</FormLabel>
        <Input
          placeholder="Quest title"
          {...register("name", {
            required: REQUIRED_FIELD_LABEL,
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
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
          placeholder="Quest description (markdown)"
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

      {code && <CodeEditorPreview code={code} />}
      <ControlledSelect
        control={control}
        name="type"
        id="type"
        label="Type"
        rules={{
          required: REQUIRED_FIELD_LABEL,
        }}
        options={questTypeOptions}
      />

      <ImageDropzone
        {...{
          register,
          setValue,
          errors,
          fieldName: "image",
          label: "Quest NFT Image reward",
          isRequired: true,
        }}
      />

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
                dCompass takes a fee of 15% on top of the total quest rewards.
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
                A user that claims the quest rewards will receive{" "}
              </Text>
              <Tag>
                {rewardPerUser}{" "}
                {rewardCurrency?.label && rewardCurrency.label.split(" - ")[0]}
              </Tag>
            </Alert>
          )}
          <FormErrorMessage>
            {errors.rewardUserCap && errors.rewardUserCap.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>

      {questDetails[questType]}
      <Flex w="full" pt="8" justify="space-between">
        <Button colorScheme="secondary" type="button" onClick={() => reset()}>
          Reset Form
        </Button>
        <Button
          isLoading={isSubmitting}
          loadingText={submitStatus}
          type="submit"
        >
          Submit
        </Button>
      </Flex>
    </Stack>
  );
};

export default CreateQuestForm;
