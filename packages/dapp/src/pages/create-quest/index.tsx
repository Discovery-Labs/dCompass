import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormProvider, useForm } from "react-hook-form";
import { Contract, ethers } from "ethers";

import NotConnectedWrapper from "../../components/custom/NotConnectedWrapper";
import CenteredFrame from "../../components/layout/CenteredFrame";
import QuestsForm from "../../components/projects/quests/QuestForm";
import Card from "components/custom/Card";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Progress,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import QuestionsForm from "../../components/projects/quests/quiz/QuestionsForm";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Web3Context } from "../../contexts/Web3Context";
import useTokenList from "../../core/hooks/useTokenList";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { GET_APP_DID } from "../../graphql/app";
import {
  CREATE_QUIZ_QUEST_MUTATION,
  GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
} from "../../graphql/quests";

type QuestionFormItemType = {
  question: string;
  content: string;
  options: { value: string }[];
  answer: { value: string }[];
};

function CreateQuestStepper() {
  const router = useRouter();
  const questType = "quiz";
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
  const toast = useToast();
  const [isWithRewards, setIsWithRewards] = useState<boolean>();
  const { tokens } = useTokenList();
  const { t } = useTranslation("common");
  const { library, chainId } = useWeb3React();
  const [submitStatus, setSubmitStatus] = useState<string>("Creating quest");
  const { self, account, contracts } = useContext(Web3Context);
  const steps = [
    {
      label: "Step 1",
      content: <QuestsForm />,
    },
    {
      label: "Step 2",
      content: <QuestionsForm />,
    },
  ];
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const methods = useForm<{
    rewardAmount: string;
    rewardCurrency: {
      label: string;
      value: string;
    };
    rewardUserCap: string;
    name: string;
    description: string;
    slogan: string;
    type: {
      value: string;
    };
  }>();

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
      contracts?.BadgeNFT.address,
      newAllowance
    );
    await res.wait(1);
    setSubmitStatus("Token allowance approved!");
    return tokenInfos;
  }

  async function onSubmit(values: Record<string, any>) {
    console.log("Submittingggg");
    if (!account) {
      return toast({
        title: "Not connected",
        description: "You're not connected with your wallet'",
        status: "error",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
      });
    }
    // check if the native token is used
    const [, tokenAddressOrSymbol] = values.rewardCurrency.value.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;

    setSubmitStatus("Checking balance");
    let balance = 0;
    const rewardAmnt = isWithRewards ? parseFloat(values.rewardAmount) : 0;
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
          duration: 3000,
          isClosable: true,
          variant: "subtle",
        });
        return methods.setError("rewardAmount", {
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
          duration: 3000,
          isClosable: true,
          variant: "subtle",
        });
        return methods.setError("rewardAmount", {
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

    const { prerequisites, rewardCurrency, ...questOptions } = values;
    const prereqs = prerequisites
      ? {
          prerequisites: prerequisites.map(
            (prereq: { value: string; label: string }) => prereq.value
          ),
        }
      : {};
    const erc20rewards = isWithRewards
      ? {
          rewardCurrency: rewardCurrency.value,
          rewardAmount: rewardAmnt,
          rewardUserCap: parseInt(values.rewardUserCap, 10),
        }
      : {
          rewardUserCap: parseInt(values.rewardUserCap, 10),
        };

    const serlializedValues = {
      ...questOptions,
      ...erc20rewards,
      ...prereqs,
      difficulty: values.difficulty.value.toUpperCase(),
      image: cids[values.name],
      pathwayId: router.query.pathwayId,
      chainId,
      createdBy: account,
      createdAt: new Date().toISOString(),
    };

    const appDid = data.getAppDID;
    const finalValues =
      questType === "quiz"
        ? {
            ...serlializedValues,
            questions: await Promise.all(
              values.questions.map(
                async ({
                  question,
                  content,
                  options,
                  answer,
                }: QuestionFormItemType) => ({
                  question,
                  content,
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
          }
        : serlializedValues;

    console.log({ finalValues });
    const questDoc = await self.client.dataModel.createTile(
      "Quest",
      finalValues,
      {
        pin: true,
      }
    );

    if (isNativeToken && isWithRewards) {
      setSubmitStatus("Creating quest on-chain");
      const createQuestOnChainTx = await contracts?.BadgeNFT.createBadge(
        questDoc.id.toUrl(),
        pathwayData.getAllQuestsByPathwayId.streamId,
        parseInt(values.rewardUserCap, 10),
        isWithRewards,
        // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
        account,
        true,
        (rewardAmnt * 1e18).toString(),
        account
      );
      await createQuestOnChainTx?.wait(1);
      setSubmitStatus("Quest created on-chain");
    } else if (!isNativeToken && isWithRewards) {
      const tokenDetails = await approveTokenAllowance(
        values.rewardCurrency.value,
        totalToPay.toString()
      );
      const rewardAmount = ethers.utils.parseUnits(
        rewardAmnt.toString(),
        tokenDetails.decimals
      );
      setSubmitStatus("Creating quest on-chain");
      const createQuestOnChainTx = await contracts?.BadgeNFT.createBadge(
        questDoc.id.toUrl(),
        pathwayData.getAllQuestsByPathwayId.streamId,
        parseInt(values.rewardUserCap, 10),
        isWithRewards,
        // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
        values.rewardCurrency.value.split(":")[1],
        false,
        rewardAmount,
        account
      );
      await createQuestOnChainTx?.wait(1);
      setSubmitStatus("Quest created on-chain");
    }

    const createQuestMutationVariables = {
      input: {
        id: questDoc.id.toUrl(),
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
    // TODO: BOUNTY-DISABLED
    // if (questType === "bounty") {
    //   const { data } = await createQuestMutation({
    //     variables: createQuestMutationVariables,
    //   });
    //   result = data.createQuizQuest;
    // }
    setSubmitStatus("Quest created!");
    // TODO: support different types of quest
    // if (questType === "snapshot-voter") {
    //   const { data } = await createSnapshotVoterQuest({
    //     variables: createQuestMutationVariables,
    //   });
    //   result = data.createSnapshotVoterQuest;
    // }

    console.log({ result });

    return router.back();
  }

  const currentValues = methods.watch();
  const { rewardAmount, rewardCurrency, rewardUserCap } = currentValues;

  const rewardPerUser = parseFloat(rewardAmount) / parseInt(rewardUserCap, 10);
  const erc20Options = tokens.map((token) => ({
    label: `${token.symbol} - ${token.name}`,
    value: `${token.chainId}:${token.address}`,
  }));

  const withRewards = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.checked);
    setIsWithRewards(e.target.checked);
  };
  useEffect(() => {
    setIsWithRewards(false);
  }, []);

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
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card layerStyle="solid-card" h="full" w="full">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <Steps
                colorScheme="purple"
                activeStep={activeStep}
                orientation="vertical"
              >
                {steps.map(({ label, content }) => (
                  <Step label={label} key={label}>
                    {content}
                  </Step>
                ))}
              </Steps>

              {activeStep > 0 && activeStep <= 1 && (
                <Button
                  variant="outline"
                  onClick={() => prevStep()}
                  px="1.25rem"
                  fontSize="md"
                >
                  {t("prev")}
                </Button>
              )}
              {activeStep < 1 && (
                <Button
                  ml="0.5rem"
                  onClick={() => nextStep()}
                  px="1.25rem"
                  fontSize="md"
                >
                  {t("next")}
                </Button>
              )}
              {activeStep === 1 && (
                <Button ml="0.5rem" type="submit" px="1.25rem" fontSize="md">
                  {t("submit")}
                </Button>
              )}
            </Stack>
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default CreateQuestStepper;
