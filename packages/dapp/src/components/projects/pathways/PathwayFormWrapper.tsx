import { useMutation } from "@apollo/client";
import { Heading, Button, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract, ethers } from "ethers";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { Web3Context } from "../../../contexts/Web3Provider";
import {
  DAIABI,
  ERC20ABI,
  externalTokens,
} from "../../../core/contracts/external-contracts";
import useTokenList from "../../../core/hooks/useTokenList";
import { CREATE_PATHWAY_MUTATION } from "../../../graphql/pathways";

import PathwayForm from "./PathwayForm";

const pathwaysDefaultValues = {
  title: null,
};

function PathwayFormWrapper() {
  const router = useRouter();
  const { library, chainId } = useWeb3React();
  const { tokens } = useTokenList();
  const [addPathwayMutation] = useMutation(CREATE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const { self, account, contracts } = useContext(Web3Context);
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  const approveTokenAllowance = async (token: string) => {
    const [tokenChainIdStr, tokenAddress] = token.split(":");
    const tokenChainId = parseInt(tokenChainIdStr, 10);
    const maxApproval = "100000000000000000000000000000000000000000000000000";
    const tokenInfos = tokens.find(
      (tkn) => tkn.address === tokenAddress && tkn.chainId === tokenChainId
    );
    if (!tokenInfos || !chainId) {
      throw new Error("Token not allowed");
    }
    const newAllowance = ethers.utils.parseUnits(
      maxApproval,
      tokenInfos.decimals
    );
    console.log({ newAllowance });
    const tokenBasedOnChainId =
      externalTokens[chainId as keyof typeof externalTokens];
    if (!tokenBasedOnChainId) {
      throw new Error("Unsupported network");
    }
    const externalTokenContracts = tokenBasedOnChainId.contracts;
    const foundSupportedToken = externalTokenContracts[
      tokenInfos.symbol as keyof typeof externalTokenContracts
    ] as {
      address: string;
      abi: typeof ERC20ABI | typeof DAIABI;
    };
    if (!foundSupportedToken) {
      throw new Error("Token not supported on this network");
    }

    console.log({ foundSupportedToken });
    const selectedTokenContract = new Contract(
      tokenAddress,
      foundSupportedToken.abi,
      library.getSigner()
    );

    const res = await selectedTokenContract.approve(
      contracts.pathwayNFTContract.address,
      newAllowance
    );
    await res.wait(1);
    return tokenInfos;
  };

  async function onSubmit(values: Record<string, any>) {
    // TODO: add a field for this
    const isRewardProvider = true;
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
      projectId: `ceramic://${router.query.projectId}`,
    };

    const pathwayDoc = await self.client.dataModel.createTile(
      "Pathway",
      { ...finalValues, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );

    const signature = await library.provider.send("personal_sign", [
      JSON.stringify({
        id: `ceramic://${router.query.projectId}`,
      }),
      account,
    ]);

    const addedPathway = await addPathwayMutation({
      variables: {
        input: {
          id: pathwayDoc.id.toUrl(),
          pathwayCreatorSignature: signature.result,
        },
      },
    });

    // if the native token is used
    const isNativeToken = values.rewardCurrency.value.split(":").length === 0;
    if (isNativeToken) {
      const createPathwayOnChainTx =
        await contracts.pathwayNFTContract.createPathway(
          pathwayDoc.id.toUrl(),
          `ceramic://${router.query.projectId}`,
          isRewardProvider,
          // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
          undefined,
          true,
          pathwayDoc.content.rewardAmount
        );
    } else {
      // TODO: check balance first
      const tokenDetails = await approveTokenAllowance(
        values.rewardCurrency.value
      );
      const rewardAmount = ethers.utils.parseUnits(
        pathwayDoc.content.rewardAmount.toString(),
        tokenDetails.decimals
      );
      const createPathwayOnChainTx =
        await contracts.pathwayNFTContract.createPathway(
          pathwayDoc.id.toUrl(),
          `ceramic://${router.query.projectId}`,
          isRewardProvider,
          // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
          values.rewardCurrency.value.split(":")[1],
          false,
          rewardAmount
        );

      await createPathwayOnChainTx.wait(1);
    }

    return router.push(`/projects/${router.query.projectId}/`);
  }

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
