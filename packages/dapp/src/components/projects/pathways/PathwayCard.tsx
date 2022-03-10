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
  Progress,
  Stack,
  Icon,
  useBreakpointValue,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
// import { ethers } from "ethers";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { BsBarChartFill } from "react-icons/bs";
import { FiUserCheck } from "react-icons/fi";
import { GiTwoCoins } from "react-icons/gi";
import { GoTasklist } from "react-icons/go";
import { RiHandCoinFill, RiSwordLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

import { Web3Context } from "../../../contexts/Web3Provider";
import { streamUrlToId } from "../../../core/helpers";
import useCustomColor from "../../../core/hooks/useCustomColor";
import { useCardMarkdownTheme } from "../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../core/hooks/useTokenList";
import { Pathway } from "../../../core/types";
import {
  APPROVE_PATHWAY_MUTATION,
  VERIFY_PATHWAY_MUTATION,
} from "../../../graphql/pathways";
import Card from "components/custom/Card";
// import { PathwayNFT } from "@discovery-dao/hardhat/typechain-types/PathwayNFT";

function PathwayCard({
  pathway,
  projectContributors,
}: {
  pathway: Pathway;
  projectContributors: string[];
}) {
  const { getRewardCurrency } = useTokenList();
  const pathwayCardMarkdownTheme = useCardMarkdownTheme();
  const { getTextColor, getBgColor, getAccentColor, getOverBgColor } =
    useCustomColor();
  const [approvePathwayMutation] = useMutation(APPROVE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const [verifyPathwayMutation] = useMutation(VERIFY_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const [status, setStatus] = useState<string>();
  const { account, contracts } = useContext(Web3Context);
  const { chainId, library } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (contracts && pathway.id) {
        const statusInt = await contracts.pathwayNFTContract.status(pathway.id);
        const isMinted = await contracts.pathwayNFTContract.pathwayMinted(
          pathway.id
        );
        const statusString = await contracts.pathwayNFTContract.statusStrings(
          statusInt
        );
        setStatus(isMinted ? "MINTED" : statusString);
      }
    }
    init();
  }, [contracts, pathway.id]);

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
      const signature = await library.provider.send("personal_sign", [
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

      const voteForApprovalTx =
        await contracts.pathwayNFTContract.voteForApproval(
          projectContributors,
          pathway.id,
          pathway.projectId,
          [metadataVerifySignature.r, thresholdVerifySignature.r],
          [metadataVerifySignature.s, thresholdVerifySignature.s],
          [metadataVerifySignature.v, thresholdVerifySignature.v],
          1
        );

      // get return values or events
      const receipt = await voteForApprovalTx.wait(1);
      console.log({ receipt });
      const statusInt = await contracts.pathwayNFTContract.status(pathway.id);
      const statusString = await contracts.pathwayNFTContract.statusStrings(
        statusInt
      );
      console.log({ statusString });
      setStatus(statusString);
    }
    return null;
  };

  const handleCreateToken = async () => {
    if (chainId && account) {
      const formData = new FormData();
      const ogFile = await fetch(`https://ipfs.io/ipfs/${pathway.image}`);
      const pathwayImage = await ogFile.blob();
      formData.append("image", pathwayImage);
      formData.append(
        "metadata",
        JSON.stringify({
          ...pathway,
        })
      );

      const nftCidRes = await fetch("/api/pathway-nft-storage", {
        method: "POST",
        body: formData,
      });

      const signatureInput = {
        id: pathway.id,
        projectId: pathway.projectId,
      };
      const signature = await library.provider.send("personal_sign", [
        JSON.stringify(signatureInput),
        account,
      ]);

      const { data } = await verifyPathwayMutation({
        variables: {
          input: {
            id: pathway.id,
            pathwayMinterSignature: signature.result,
            chainId,
          },
        },
      });

      const [metadataVerifySignature, thresholdVerifySignature] =
        data.verifyPathway.expandedServerSignatures;

      const { url } = await nftCidRes.json();
      const createTokenTx = await contracts.pathwayNFTContract.createToken(
        url,
        pathway.id,
        pathway.projectId,
        [metadataVerifySignature.r, thresholdVerifySignature.r],
        [metadataVerifySignature.s, thresholdVerifySignature.s],
        [metadataVerifySignature.v, thresholdVerifySignature.v],
        1
      );

      // get return values or events
      const receipt = await createTokenTx.wait(1);
      console.log({ receipt });
      const isMinted = await contracts.pathwayNFTContract.pathwayMinted(
        pathway.id
      );
      if (isMinted) {
        setStatus("MINTED");
      }
    }
    return null;
  };

  return (
    <Card h="xl">
      <HStack>
        <Tag>{pathway.difficulty}</Tag>
        <Tag variant="outline">0/{pathway.rewardUserCap} Claimed</Tag>
        {/* Max reward supply is not essential for who want to complete the quest. */}
        {/* <Tag variant="outline">
          {pathway.rewardAmount} {getRewardCurrency(pathway.rewardCurrency)}
        </Tag> */}
      </HStack>
      <Flex w="full">
        <Tooltip label={pathway.title} hasArrow placement="top">
          <Heading noOfLines={2} as="h2" fontSize="2xl" color={getTextColor}>
            {pathway.title}
          </Heading>
        </Tooltip>
      </Flex>
      <VStack w="full" align="flex-start">
        <Box
          bgGradient={`linear(0deg, ${getOverBgColor} 10%, ${getTextColor} 60%, ${getTextColor})`}
          bgClip="text"
        >
          <ReactMarkdown
            className="card-markdown"
            components={ChakraUIRenderer(pathwayCardMarkdownTheme)}
            skipHtml
          >
            {pathway.description}
          </ReactMarkdown>
        </Box>
      </VStack>
      <VStack w="full" align="start">
        <Text as="h2" fontSize="2xl" color={getTextColor}>
          Rewards
        </Text>
        <HStack align="start">
          <Stack
            layerStyle="outline-hover3"
            py={1}
            px={4}
            m={0}
            justifyContent="space-around"
            direction="row"
            spacing={4}
            align="center"
          >
            <Avatar size="md" src={`https://ipfs.io/ipfs/${pathway.image}`} />
            <Text color="purple.500" fontWeight="bold">
              NFT
            </Text>
          </Stack>
        </HStack>
        <Stack
          layerStyle="outline-hover3"
          py={1}
          px={4}
          m={0}
          justifyContent="space-around"
          direction="row"
          spacing={4}
          align="center"
        >
          <Flex
            align="center"
            justify="center"
            fontFamily="heading"
            fontWeight="bold"
            bg="violet.100"
            color="purple.500"
          >
            <Text fontWeight="bold">
              {parseFloat(pathway.rewardAmount) / pathway.rewardUserCap}{" "}
              {getRewardCurrency(pathway.rewardCurrency)}
            </Text>
          </Flex>
        </Stack>
      </VStack>

      <Spacer />

      {isContributor && status !== "MINTED" && (
        <VStack w="full" align="left">
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
          {status && (status === "PENDING" || status === "NONEXISTENT") && (
            <HStack w="full" justifyContent="space-between">
              <Button
                colorScheme="accentDark"
                onClick={handleApprovePathway}
                leftIcon={<CheckIcon />}
              >
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
        </VStack>
      )}
      {!isContributor && status !== "MINTED" && (
        <VStack w="full" layerStyle="outline-card">
          <Text>Under review</Text>
        </VStack>
      )}
      {status == "MINTED" && (
        <>
          <Tooltip
            label={`0% - 0/${pathway.quests?.length || 0} quests completed`}
            hasArrow
            placement="top"
          >
            <HStack w="full">
              <Progress
                w="full"
                size="md"
                rounded="md"
                value={0}
                border={`solid 1px ${getAccentColor}`}
                hasStripe
                colorScheme="accentDark"
                bgColor={getBgColor}
              />
            </HStack>
          </Tooltip>

          <Flex w="full" justify="space-between">
            <Button
              leftIcon={<RiSwordLine />}
              fontSize="md"
              onClick={() => openPathway()}
            >
              {pathway.quests?.length || 0} Quests
            </Button>

            {!pathway.isPending && (
              <Button
                fontSize="md"
                variant="outline"
                leftIcon={<RiHandCoinFill />}
                disabled
                onClick={() => console.log("Claim Pathway")}
              >
                Claim
              </Button>
            )}
          </Flex>
        </>
      )}
    </Card>
  );
}

export default PathwayCard;
