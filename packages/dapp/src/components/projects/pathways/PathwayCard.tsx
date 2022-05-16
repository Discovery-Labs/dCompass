/* eslint-disable complexity */
import { useLazyQuery, useMutation } from "@apollo/client";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spacer,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
// import { ethers } from "ethers";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Card from "components/custom/Card";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { RiHandCoinFill, RiSwordLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { Web3Context } from "../../../contexts/Web3Provider";
import useCustomColor from "../../../core/hooks/useCustomColor";
import { useCardMarkdownTheme } from "../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../core/hooks/useTokenList";
import { Pathway, Quest } from "../../../core/types";
import {
  APPROVE_PATHWAY_MUTATION,
  CLAIM_PATHWAY_REWARDS_MUTATION,
  GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
  VERIFY_PATHWAY_MUTATION,
} from "../../../graphql/pathways";

// import { PathwayNFT } from "@discovery-dao/hardhat/typechain-types/PathwayNFT";

const ModalDetails = ({ pathway }: { pathway: Pathway }) => {
  const { getTextColor, getOverBgColor } = useCustomColor();
  const pathwayCardMarkdownTheme = useCardMarkdownTheme();

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{pathway.title}</ModalHeader>
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </>
  );
};

function PathwayCard({
  pathway,
  projectContributors,
}: {
  pathway: Pathway;
  projectContributors: string[];
}) {
  const [pathwayProgress, setPathwayProgress] = useState<{
    totalQuestCount: number;
    completedQuestCount: number;
    ratio: number;
  }>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getRewardCurrency } = useTokenList();
  const { getPrimaryColor, getAccentColor } = useCustomColor();
  const [approvePathwayMutation] = useMutation(APPROVE_PATHWAY_MUTATION);
  const [verifyPathwayMutation] = useMutation(VERIFY_PATHWAY_MUTATION);
  const [claimPathwayRewardsMutation] = useMutation(
    CLAIM_PATHWAY_REWARDS_MUTATION
  );
  const [getAllPathwaysByProjectId] = useLazyQuery(
    GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: pathway.projectId,
      },
    }
  );
  const [status, setStatus] = useState<string>();
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isCreatingToken, setIsCreatingToken] = useState<boolean>(false);
  const [claimedBy, setClaimedBy] = useState<string[]>();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [rewardStatus, setRewardStatus] = useState<string>();
  const { account, contracts, self } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    const allQuests = [...pathway.quizQuests, ...pathway.bountyQuests];
    const totalQuestCount = allQuests.length;

    const completedQuestCount = self?.id
      ? allQuests.filter(
          (q: Quest) => q.completedBy.includes(self.id) && !q.isPending
        ).length
      : 0;
    const ratio = (completedQuestCount / totalQuestCount) * 100;

    setPathwayProgress({
      totalQuestCount,
      completedQuestCount,
      ratio,
    });
  }, [pathway.quizQuests, pathway.bountyQuests, self?.id]);
  useEffect(() => {
    async function init() {
      if (contracts && pathway.streamId) {
        const statusInt = await contracts.pathwayNFTContract.status(
          pathway.streamId
        );
        const isMinted = await contracts.pathwayNFTContract.pathwayMinted(
          pathway.streamId
        );
        const statusString: string =
          await contracts.pathwayNFTContract.statusStrings(statusInt);
        console.log({ statusString });
        setStatus(isMinted ? "MINTED" : statusString);
        const claimedByAddresses =
          await contracts.pathwayNFTContract.getAllAddrsByPathwayIDVersion(
            pathway.streamId,
            0
          );
        const currentUserHasClaimed = claimedByAddresses.includes(account);
        console.log({ claimedByAddresses, currentUserHasClaimed });
        setIsClaimed(currentUserHasClaimed);
        setRewardStatus(currentUserHasClaimed ? "Claimed" : "Claim");
        setClaimedBy(claimedByAddresses);
      }
      null;
    }
    init();
  }, [contracts, pathway.streamId, account]);

  const isContributor = account && projectContributors.includes(account);
  function openPathway() {
    return router.push(`/projects/${pathway.projectId}/pathways/${pathway.id}`);
  }

  const handleApprovePathway = async () => {
    setIsApproving(true);
    if (chainId && account) {
      try {
        const { data } = await approvePathwayMutation({
          variables: {
            input: {
              id: pathway.id,
            },
          },
        });

        const [metadataVerifySignature, thresholdVerifySignature] =
          data.approvePathway.expandedServerSignatures;

        const voteForApprovalTx =
          await contracts.pathwayNFTContract.voteForApproval(
            projectContributors,
            pathway.streamId,
            data.approvePathway.projectStreamId,
            [metadataVerifySignature.r, thresholdVerifySignature.r],
            [metadataVerifySignature.s, thresholdVerifySignature.s],
            [metadataVerifySignature.v, thresholdVerifySignature.v],
            1
          );

        // get return values or events
        const receipt = await voteForApprovalTx.wait(1);
        console.log({ receipt });
        const statusInt = await contracts.pathwayNFTContract.status(
          pathway.streamId
        );
        const statusString: string =
          await contracts.pathwayNFTContract.statusStrings(statusInt);
        setStatus(statusString);

        return toast({
          title: "Pathway approved!",
          description: `Approval vote submitted successfully!`,
          status: "success",
          position: "bottom-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
      } catch (error) {
        console.error(error);

        let toastTitle = "Error";
        if (typeof error === "string") {
          toastTitle = error;
        } else if (error instanceof Error) {
          toastTitle = error.message; // works, `e` narrowed to Error
        }
        return toast({
          title: toastTitle,
          status: "warning",
          position: "bottom-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
      } finally {
        setIsApproving(false);
      }
    }
  };

  const handleCreateToken = async () => {
    setIsCreatingToken(true);
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
      const { url } = await nftCidRes.json();

      const { data } = await verifyPathwayMutation({
        variables: {
          input: {
            id: pathway.id,
          },
        },
      });
      const [metadataVerifySignature, thresholdVerifySignature] =
        data.verifyPathway.expandedServerSignatures;

      const createTokenTx = await contracts.pathwayNFTContract.createToken(
        url,
        pathway.streamId,
        data.verifyPathway.projectStreamId,
        [metadataVerifySignature.r, thresholdVerifySignature.r],
        [metadataVerifySignature.s, thresholdVerifySignature.s],
        [metadataVerifySignature.v, thresholdVerifySignature.v],
        1
      );

      // get return values or events
      const receipt = await createTokenTx.wait(1);
      // TODO: receipt tx hash in the toast body
      console.log({ receipt });
      const isMinted = await contracts.pathwayNFTContract.pathwayMinted(
        pathway.id
      );
      if (isMinted) {
        setStatus("MINTED");
      }
    }
    // refetch pathways
    await getAllPathwaysByProjectId({
      variables: {
        projectId: pathway.projectId,
      },
    });
    setIsCreatingToken(false);
    return toast({
      title: "Pathway minted!",
      description: `Pathway minted and created successfully!`,
      status: "success",
      position: "bottom-right",
      duration: 6000,
      isClosable: true,
      variant: "subtle",
    });
  };

  const handleClaimPathwayRewards = async () => {
    setIsClaiming(true);
    setRewardStatus("Claiming rewards");

    setRewardStatus("Generating tokenURI");
    const formData = new FormData();
    const ogFile = await fetch(`https://ipfs.io/ipfs/${pathway.image}`);
    const questImage = await ogFile.blob();
    formData.append("image", questImage);
    formData.append("metadata", JSON.stringify(pathway));

    const nftCidRes = await fetch("/api/pathway-nft-storage", {
      method: "POST",
      body: formData,
    });
    const { url } = await nftCidRes.json();
    setRewardStatus("Verifying claim");

    const { data } = await claimPathwayRewardsMutation({
      variables: {
        input: {
          pathwayId: pathway.id,
          did: self.id,
        },
      },
    });

    const [, tokenAddressOrSymbol] = pathway.rewardCurrency.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;

    const [metadataVerify] = data.claimPathwayRewards.expandedServerSignatures;
    console.log({ metadataVerify });
    setRewardStatus("Claiming on-chain");
    const claimRewardsTx =
      await contracts.pathwayNFTContract.claimPathwayRewards(
        pathway.streamId,
        isNativeToken,
        isNativeToken ? account : tokenAddressOrSymbol,
        metadataVerify.r,
        metadataVerify.s,
        metadataVerify.v,
        true,
        url,
        0
      );
    await claimRewardsTx.wait(1);

    const claimedByAddresses =
      await contracts.PathwayNFTContract.getAllAddrsByPathwayIDVersion(
        pathway.streamId,
        0
      );
    const currentUserHasClaimed = claimedByAddresses.includes(account);
    setIsClaimed(currentUserHasClaimed);
    setRewardStatus(currentUserHasClaimed ? "Claimed" : "Claim");
    setClaimedBy(claimedByAddresses);
    setIsClaiming(false);
    return toast({
      title: "Congratulations!",
      description: `Rewards claimed successfully!`,
      status: "success",
      position: "bottom-right",
      duration: 6000,
      isClosable: true,
      variant: "subtle",
    });
  };

  return (
    <Card h="lg">
      <HStack>
        <Tag p="2" variant="solid">
          {claimedBy?.length}/{pathway.rewardUserCap} Claimed
        </Tag>
      </HStack>
      <Flex direction="column" w="full">
        <Text pb="1" textStyle="small" color={getPrimaryColor}>
          {pathway.difficulty}
        </Text>
        <Tooltip label={pathway.title} hasArrow placement="top">
          <Heading noOfLines={2} as="h2" fontSize="2xl" color="text">
            {pathway.title}
          </Heading>
        </Tooltip>

        <VStack w="full" align="flex-start" onClick={onOpen}>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalDetails pathway={pathway} />
          </Modal>
          {/* Short Description  */}
          <Tooltip label={pathway.slogan}>
            <Text color="text-weak" noOfLines={3}>
              {pathway.slogan}
            </Text>
          </Tooltip>
        </VStack>
      </Flex>

      <Spacer />

      <Flex direction="column" w="full">
        {isClaimed ? (
          <HStack>
            <Text as="h2" fontSize="2xl" color={getAccentColor}>
              Rewards claimed
            </Text>
            <FaCheckCircle color={getAccentColor} />
          </HStack>
        ) : (
          <Text as="h2" fontSize="2xl" color={getAccentColor}>
            {+pathway.rewardAmount !== 0 ? "Rewards" : "Reward"}
          </Text>
        )}
        {/* <Avatar size="md" src={`https://ipfs.io/ipfs/${pathway.image}`} /> */}
        <Text color="text-weak">
          NFT
          {+pathway.rewardAmount !== 0 && (
            <>
              {" "}
              + {parseFloat(pathway.rewardAmount) / pathway.rewardUserCap}{" "}
              {getRewardCurrency(pathway.rewardCurrency)}
            </>
          )}
        </Text>
      </Flex>

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
                colorScheme="accent"
                onClick={handleApprovePathway}
                leftIcon={<CheckIcon />}
                isLoading={isApproving}
                loadingText="Approving"
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
              <Button
                onClick={handleCreateToken}
                isLoading={isCreatingToken}
                loadingText="Minting pathway"
                leftIcon={<CheckIcon />}
              >
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
            label={`${pathwayProgress?.ratio}% - ${pathwayProgress?.completedQuestCount}/${pathwayProgress?.totalQuestCount} quests completed`}
            hasArrow
            placement="top"
          >
            <HStack w="full">
              <Progress
                w="full"
                size="md"
                rounded="md"
                value={pathwayProgress?.ratio}
                border={`solid 1px ${getAccentColor}`}
                hasStripe
                colorScheme="accent"
                bgColor="bg"
              />
            </HStack>
          </Tooltip>

          <Flex w="full" justify="space-between">
            {!isClaiming && (
              <Button
                leftIcon={<RiSwordLine />}
                fontSize="md"
                onClick={() => openPathway()}
              >
                Explore
              </Button>
            )}

            {!pathway.isPending && !isClaimed && (
              <Button
                fontSize="md"
                variant="outline"
                colorScheme={
                  pathwayProgress?.ratio !== 100 ? "primary" : "accent"
                }
                loadingText={rewardStatus}
                isLoading={isClaiming}
                leftIcon={<RiHandCoinFill />}
                disabled={pathwayProgress?.ratio !== 100}
                onClick={handleClaimPathwayRewards}
              >
                {isClaimed ? "Claimed" : "Claim"}
              </Button>
            )}
          </Flex>
        </>
      )}
    </Card>
  );
}

export default PathwayCard;
