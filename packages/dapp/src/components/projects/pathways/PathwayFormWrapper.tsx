import { useMutation, useQuery } from "@apollo/client";
import {
  Heading,
  Button,
  Flex,
  useToast,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Progress,
  Stack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { Web3Context } from "../../../contexts/Web3Provider";

import useTokenList from "../../../core/hooks/useTokenList";
import {
  CREATE_PATHWAY_MUTATION,
  GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
} from "../../../graphql/pathways";

import PathwayForm from "./PathwayForm";

const pathwaysDefaultValues = {
  title: null,
};

function PathwayFormWrapper() {
  const toast = useToast();
  const router = useRouter();
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
    const isRewardProvider = true;

    // check if the native token is used
    const [, tokenAddressOrSymbol] = values.rewardCurrency.value.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;

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
          description: `You don't have enough funds to provide the pathway rewards in this currency`,
          status: "error",
          position: "top-right",
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
          description: "You don't have enough funds to provide pathway rewards",
          status: "error",
          position: "top-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
        return setError("rewardAmount", {
          message: "Insufficient funds",
        });
      }
    }
    // TODO: check prereqs
    const { prerequisites, ...pathwayOptions } = values;
    const prereqs = prerequisites
      ? {
          prerequisites: prerequisites.map(
            (prereq: { value: string; label: string }) => prereq.value
          ),
        }
      : {};

    const serlializedValues = {
      ...pathwayOptions,
      difficulty: values.difficulty.value,
      rewardCurrency: values.rewardCurrency.value,
      rewardAmount: parseFloat(values.rewardAmount),
      rewardUserCap: parseInt(values.rewardUserCap, 10),
      ...prereqs,
      createdBy: account,
      createdAt: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(serlializedValues));

    if (values.image) {
      formData.append(values.title, values.image[0]);
    }
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();
    const finalValues = {
      ...serlializedValues,
      image: cids[values.title],
      projectId: router.query.projectId,
    };

    const pathwayDoc = await self.client.dataModel.createTile(
      "Pathway",
      { ...finalValues, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );

    if (isNativeToken) {
      const createPathwayOnChainTx =
        await contracts.pathwayNFTContract.createPathway(
          pathwayDoc.id.toUrl(),
          data.getAllPathwaysByProjectId.streamId,
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
          isRewardProvider,
          // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
          values.rewardCurrency.value.split(":")[1],
          false,
          rewardAmount
        );

      await createPathwayOnChainTx.wait(1);
    }

    const signature = await library.provider.send("personal_sign", [
      JSON.stringify({
        id: pathwayDoc.id.toUrl(),
        projectId: router.query.projectId,
      }),
      account,
    ]);

    await addPathwayMutation({
      variables: {
        input: {
          id: pathwayDoc.id.toUrl(),
          pathwayCreatorSignature: signature.result,
        },
      },
    });

    return router.push(`/projects/${router.query.projectId}/`);
  }

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
    <>
      <Heading>Add Pathway</Heading>
      <PathwayForm />

      <Flex w="full" justify="space-between">
        <Button
          colorScheme="secondary"
          type="button"
          onClick={() => reset(pathwaysDefaultValues)}
        >
          Reset Pathway Form
        </Button>
        <Button
          isLoading={isSubmitting}
          colorScheme="accentDark"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
}

export default PathwayFormWrapper;
