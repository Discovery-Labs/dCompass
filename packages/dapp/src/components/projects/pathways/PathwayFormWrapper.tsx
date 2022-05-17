import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Heading,
  Progress,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Web3Context } from "../../../contexts/Web3Provider";
import useTokenList from "../../../core/hooks/useTokenList";
import { Pathway } from "../../../core/types";
import {
  CREATE_PATHWAY_MUTATION,
  GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
} from "../../../graphql/pathways";
import PathwayForm from "./PathwayForm";

const pathwaysDefaultValues = {
  title: null,
};

function PathwayFormWrapper() {
  const [submitStatus, setSubmitStatus] = useState<string>("Creating pathway");
  const toast = useToast();
  const router = useRouter();
  const [isWithRewards, setIsWithRewards] = useState<boolean>();
  const { library, chainId } = useWeb3React();
  const { tokens } = useTokenList();
  const [addPathwayMutation] = useMutation(CREATE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const { data, loading, error } = useQuery(
    GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: router.query.projectId,
      },
    }
  );

  console.log({ data });
  const { self, account, contracts } = useContext(Web3Context);
  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting },
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

  const approveTokenAllowance = async (
    token: string,
    maxApproval = "1000000000000000000000000000000"
  ) => {
    const { tokenContract, tokenInfos } = getSelectedTokenContract(token);
    const newAllowance = ethers.utils.parseUnits(
      maxApproval,
      tokenInfos.decimals
    );
    const res = await tokenContract.approve(
      contracts.pathwayNFTContract.address,
      newAllowance
    );
    await res.wait(1);
    return tokenInfos;
  };

  async function onSubmit(values: Record<string, any>) {
    // TODO: add a field for this
    const rewardAmnt = isWithRewards ? parseFloat(values.rewardAmount) : 0;
    const [, tokenAddressOrSymbol] = values.rewardCurrency.value.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;
    let balance = 0;
    const feeAmount = (rewardAmnt * 15) / 100;
    const totalToPay = rewardAmnt + feeAmount;

    if (isWithRewards) {
      // check if the native token is used
      setSubmitStatus("Checking balance");
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
            description: `You don't have enough funds to provide the pathway rewards in this currency`,
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
            description:
              "You don't have enough funds to provide pathway rewards",
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
    }

    setSubmitStatus("Generating token URIs");
    // TODO: check prereqs
    const {
      prerequisites,
      image,
      rewardAmount,
      rewardCurrency,
      ...pathwayOptions
    } = values;
    console.log({ rewardAmount });
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
      ...pathwayOptions,
      ...erc20rewards,
      ...prereqs,
      createdBy: account,
      createdAt: new Date().toISOString(),
    };

    console.log({ serlializedValues });

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(serlializedValues));

    if (image) {
      formData.append(values.title, image[0], image[0].name);
    }
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();

    setSubmitStatus("Creating pathway");

    const finalValues = {
      ...serlializedValues,
      image: cids[values.title],
      projectId: router.query.projectId,
      projectStreamId: data.getAllPathwaysByProjectId.streamId,
    };

    console.log({ finalValues });

    const pathwayDoc = await self.client.dataModel.createTile(
      "Pathway",
      { ...finalValues, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );

    setSubmitStatus("Creating pathway on-chain");
    if (isWithRewards) {
      if (isNativeToken) {
        const createPathwayOnChainTx =
          await contracts.pathwayNFTContract.createPathway(
            pathwayDoc.id.toUrl(),
            data.getAllPathwaysByProjectId.streamId,
            parseInt(values.rewardUserCap, 10),
            isWithRewards,
            // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
            account,
            true,
            (rewardAmnt * 1e18).toString(),
            {
              value: (totalToPay * 1e18).toString(),
            }
          );
        await createPathwayOnChainTx.wait(1);
      } else {
        // TODO: check balance first
        const tokenDetails = await approveTokenAllowance(
          values.rewardCurrency.value,
          totalToPay.toString()
        );
        const rewardAmount = ethers.utils.parseUnits(
          rewardAmnt.toString(),
          tokenDetails.decimals
        );
        const createPathwayOnChainTx =
          await contracts.pathwayNFTContract.createPathway(
            pathwayDoc.id.toUrl(),
            data.getAllPathwaysByProjectId.streamId,
            parseInt(values.rewardUserCap, 10),
            isWithRewards,
            // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
            values.rewardCurrency.value.split(":")[1],
            false,
            rewardAmount
          );

        await createPathwayOnChainTx.wait(1);
      }
    }
    setSubmitStatus("Pathway validation");
    await addPathwayMutation({
      variables: {
        input: {
          id: pathwayDoc.id.toUrl(),
        },
      },
    });
    setSubmitStatus("Pathway created!");
    return router.push(`/projects/${router.query.projectId}/`);
  }

  const withRewards = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.checked);
    setIsWithRewards(e.target.checked);
  };
  useEffect(() => {
    setIsWithRewards(false);
  }, []);

  if (loading)
    return (
      <Stack>
        <Progress size="xs" isIndeterminate />
      </Stack>
    );
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Network error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  return (
    <Stack w="full" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading>Add Pathway</Heading>
      <PathwayForm
        isWithRewards={isWithRewards}
        withRewards={withRewards}
        existingPathways={
          data?.getAllPathwaysByProjectId?.pathways?.length &&
          data.getAllPathwaysByProjectId.pathways
            .filter(
              (pathway: Pathway) =>
                [...pathway.quizQuests, ...pathway.bountyQuests].length > 0
            )
            .map((pathway: Pathway) => {
              return {
                label: pathway.title,
                value: pathway.id,
                colorScheme: "purple",
              };
            })
        }
      />

      <Flex w="full" justify="space-between">
        <Button
          colorScheme="secondary"
          type="button"
          onClick={() => reset(pathwaysDefaultValues)}
        >
          Reset Form
        </Button>
        <Button
          isLoading={isSubmitting}
          colorScheme="accent"
          loadingText={submitStatus}
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </Flex>
    </Stack>
  );
}

export default PathwayFormWrapper;
