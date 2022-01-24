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
import useTokenList from "../../../core/hooks/useTokenList";
import {
  APPROVE_PATHWAY_MUTATION,
  VERIFY_PATHWAY_MUTATION,
} from "../../../graphql/pathways";
import Card from "components/custom/Card";

type Pathway = {
  id: string;
  image: string;
  title: string;
  description: string;
  projectId: string;
  quests: { id: string }[];
  difficulty: string;
  rewardCurrency: string;
  rewardAmount: string;
  rewardUserCap: number;
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
  const { getRewardCurrency } = useTokenList();
  const { getTextColor, getBgColor, getAccentColor } = useCustomColor();
  const [approvePathwayMutation] = useMutation(APPROVE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const [verifyPathwayMutation] = useMutation(VERIFY_PATHWAY_MUTATION, {
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

      // console.log({ receipt, statusString });
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
      const signature = await provider.provider.send("personal_sign", [
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
        id,
        streamUrlToId(pathway.projectId),
        [metadataVerifySignature.r, thresholdVerifySignature.r],
        [metadataVerifySignature.s, thresholdVerifySignature.s],
        [metadataVerifySignature.v, thresholdVerifySignature.v],
        1
      );

      // get return values or events
      // const receipt = await createTokenTx.wait(2);
      const isMinted = await contracts.pathwayNFTContract.pathwayMinted(id);
      if (isMinted) {
        setStatus("MINTED");
      }
    }
    return null;
  };

  const pathwayCardMarkdownTheme = {
    h1: (props) => {
      const { children } = props;
      return (
        <Heading pb="2" noOfLines={1} as="h4" size="sm" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    p: (props) => {
      const { children } = props;
      return (
        <Text w="full" fontSize="sm" isTruncated>
          {children}
        </Text>
      );
    },
  };

  return (
    <Card h="xl" w="md">
      <Flex w="full" h="160px">
        <Tooltip label={pathway.title} hasArrow placement="top">
          <Heading noOfLines={2} as="h2" fontSize="2xl" color={getTextColor}>
            {pathway.title}
          </Heading>
        </Tooltip>
      </Flex>
      <VStack w="full" align="flex-start">
        <ReactMarkdown
          className="card-markdown"
          components={ChakraUIRenderer(pathwayCardMarkdownTheme)}
          children={pathway.description}
          skipHtml
        />
      </VStack>
      <VStack w="full" align="left">
        <HStack>
          <Icon as={FiUserCheck} />
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={getTextColor}
            textTransform="uppercase"
          >
            Claimed
          </Text>
          <Spacer />
          <Flex align="end" direction="column">
            <Tag variant="outline">0/{pathway.rewardUserCap}</Tag>
          </Flex>
        </HStack>
      </VStack>
      <VStack w="full" align="left">
        <HStack>
          <Icon as={GiTwoCoins} />
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={getTextColor}
            textTransform="uppercase"
          >
            Rewards
          </Text>
          <Spacer />
          <Flex align="end" direction="column">
            <Tag variant="outline">
              {pathway.rewardAmount} {getRewardCurrency(pathway.rewardCurrency)}
            </Tag>
          </Flex>
        </HStack>

        <Stack
          w="full"
          justifyContent="space-between"
          direction="row"
          spacing={4}
          align="center"
        >
          <Avatar
            boxSize="4.5rem"
            src={`https://ipfs.io/ipfs/${pathway.image}`}
          />
          <Text color="purple.500" fontSize="3xl" fontWeight="bold">
            NFT
          </Text>
          <Text fontFamily="heading" fontSize={{ base: "4xl", md: "6xl" }}>
            +
          </Text>
          <Flex
            align="center"
            justify="center"
            fontFamily="heading"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "lg" }}
            bg="violet.100"
            color="purple.500"
            rounded="full"
            width={useBreakpointValue({ base: "44px", md: "60px" })}
            height={useBreakpointValue({ base: "44px", md: "60px" })}
          >
            <Text fontSize="3xl" fontWeight="bold">
              {parseFloat(pathway.rewardAmount) / pathway.rewardUserCap}{" "}
              {getRewardCurrency(pathway.rewardCurrency)}
            </Text>
          </Flex>
        </Stack>
      </VStack>

      <VStack w="full" align="left">
        <HStack>
          <Icon as={BsBarChartFill} />
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={getTextColor}
            textTransform="uppercase"
          >
            Difficulty
          </Text>
          <Spacer />
          <Flex align="end" direction="column">
            <Tag>{pathway.difficulty}</Tag>
          </Flex>
        </HStack>
      </VStack>
      <Tooltip
        label={`0% - 0/${pathway.quests?.length || 0} quests completed`}
        hasArrow
        placement="top"
      >
        <VStack w="full" align="left">
          <HStack>
            <Icon as={GoTasklist} />
            <Text
              fontWeight="bold"
              fontSize="xl"
              color={getTextColor}
              textTransform="uppercase"
            >
              Progress
            </Text>
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
        </VStack>
      </Tooltip>

      {isContributor && status !== "MINTED" && (
        <VStack w="full" align="left">
          <HStack>
            <Text>Token status:</Text>
            <Tag
              variant="outline"
              w="fit-content"
              colorScheme={
                status === "APPROVED" || status === "MINTED"
                  ? "green"
                  : "orange"
              }
              size="sm"
            >
              <TagLabel>{status}</TagLabel>
            </Tag>
          </HStack>
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
    </Card>
  );
}

export default PathwayCard;
