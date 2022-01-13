/* eslint-disable complexity */
import { useMutation } from "@apollo/client";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Tag,
  VStack,
  HStack,
  TagLabel,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
// import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";

import { Web3Context } from "../../../contexts/Web3Provider";
import { streamUrlToId } from "../../../core/helpers";
import { APPROVE_PATHWAY_MUTATION } from "../../../graphql/pathways";
import Card from "components/custom/Card";

type Pathway = {
  id: string;
  image: string;
  title: string;
  description: string;
  projectId: string;
  difficulty: string;
  isPending: boolean;
  createdBy: string;
};

function PathwayCard({
  pathway,
  projectContributors,
}: {
  pathway: Pathway;
  projectContributors: string[];
}) {
  const [approvePathwayMutation] = useMutation(APPROVE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const [status, setStatus] = useState<string>();
  const { account, provider, contracts } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  const router = useRouter();
  const id = streamUrlToId(pathway.id);

  useEffect(() => {
    async function init() {
      if (contracts && id) {
        const statusInt = await contracts.pathwayNFTContract.status(id);
        const isMinted = await contracts.pathwayNFTContract.pathwayMinted(id);
        const statusString = await contracts.pathwayNFTContract.statusStrings(
          statusInt
        );
        setStatus(isMinted ? "MINTED" : statusString);
      }
    }
    init();
  }, [contracts, id]);

  const isContributor = account && projectContributors.includes(account);
  function openPathway() {
    return router.push(
      `/projects/${streamUrlToId(pathway.projectId)}/pathways/${streamUrlToId(
        pathway.id
      )}`
    );
  }

  const handleApprovePathway = async () => {
    if (chainId && account) {
      const signatureInput = {
        id: pathway.id,
        projectId: pathway.projectId,
      };
      const signature = await provider.provider.send("personal_sign", [
        JSON.stringify(signatureInput),
        account,
      ]);

      const { data } = await approvePathwayMutation({
        variables: {
          input: {
            id: pathway.id,
            pathwayApproverSignature: signature.result,
            chainId,
          },
        },
      });

      const [metadataVerifySignature, thresholdVerifySignature] =
        data.approvePathway.expandedServerSignatures;

      console.log({
        projectContributors,
        id,
        projectId: streamUrlToId(pathway.projectId),
        Rs: [metadataVerifySignature.r, thresholdVerifySignature.r],
        Ss: [metadataVerifySignature.s, thresholdVerifySignature.s],
        Vs: [metadataVerifySignature.v, thresholdVerifySignature.v],
        votesNeeded: 1,
      });

      const voteForApprovalTx =
        await contracts.pathwayNFTContract.voteForApproval(
          projectContributors,
          id,
          streamUrlToId(pathway.projectId),
          [metadataVerifySignature.r, thresholdVerifySignature.r],
          [metadataVerifySignature.s, thresholdVerifySignature.s],
          [metadataVerifySignature.v, thresholdVerifySignature.v],
          1
        );

      // get return values or events
      const receipt = await voteForApprovalTx.wait(2);
      const statusInt = await contracts.pathwayNFTContract.status(id);
      const statusString = await contracts.pathwayNFTContract.statusStrings(
        statusInt
      );
      console.log({ statusString });
      setStatus(statusString);
      if (statusString === "APPROVED") {
        return approvePathwayMutation({
          variables: {
            input: {
              id: pathway.id,
              pathwayApproverSignature: signature.result,
              chainId,
            },
          },
        });
      }
      console.log({ receipt, statusString });
    }
    return null;
  };

  const handleCreateToken = async () => {
    console.log("create token");
    // if (chainId && account) {
    //   const cids = tokenUris.map(
    //     (uri: string) => uri.split("://")[1].split("/")[0]
    //   );
    //   const { firstParts, secondParts } = splitCIDS(cids);
    //   const createTokenTx = await contracts.projectNFTContract.createToken(
    //     firstParts,
    //     secondParts,
    //     id
    //   );
    //   // get return values or events
    //   const receipt = await createTokenTx.wait(2);
    //   const isMinted = await contracts.projectNFTContract.projectMinted(id);
    //   setStatus("MINTED");
    //   console.log({ receipt, isMinted });
    // }
    // return null;
  };

  return (
    <Card h="md">
      <Flex w="full">
        <Avatar
          mr="0.5rem"
          boxSize="4rem"
          src={`https://ipfs.io/ipfs/${pathway.image}`}
        />
        <Spacer />
        <Flex align="end" direction="column">
          <Tag>{pathway.difficulty}</Tag>
        </Flex>
      </Flex>
      <Heading fontSize="2xl">{pathway.title}</Heading>
      <Text noOfLines={2}>{pathway.description}</Text>
      {pathway.isPending && isContributor && (
        <VStack align="left">
          {status && (status === "PENDING" || status === "NONEXISTENT") && (
            <HStack>
              <Button onClick={handleApprovePathway} leftIcon={<CheckIcon />}>
                Approve
              </Button>
              <Button ml="5" colorScheme="secondary" leftIcon={<CloseIcon />}>
                Reject
              </Button>
            </HStack>
          )}
          {status && status === "APPROVED" && (
            <HStack>
              <Button onClick={handleCreateToken} leftIcon={<CheckIcon />}>
                Create Token
              </Button>
            </HStack>
          )}
          <Tag
            variant="outline"
            w="fit-content"
            colorScheme={
              status === "APPROVED" || status === "MINTED" ? "green" : "orange"
            }
            size="sm"
          >
            <TagLabel>{status}</TagLabel>
          </Tag>
        </VStack>
      )}
      <Spacer />
      <Flex w="full" justify="space-between">
        <Button variant="outline" fontSize="md" onClick={() => openPathway()}>
          Quests
        </Button>

        {!pathway.isPending && (
          <Button fontSize="md" onClick={() => console.log("Claim Pathway")}>
            Claim
          </Button>
        )}
      </Flex>
    </Card>
  );
}

export default PathwayCard;
