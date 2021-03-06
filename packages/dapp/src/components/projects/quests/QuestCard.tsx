import { useMutation, useQuery } from "@apollo/client";
import {
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  LockIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  UnorderedList,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Card from "components/custom/Card";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { GiSwordwoman } from "react-icons/gi";
import { Web3Context } from "../../../contexts/Web3Provider";
import useTokenList from "../../../core/hooks/useTokenList";
import { Quest } from "../../../core/types";
import {
  APPROVE_QUEST_MUTATION,
  GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
  VERIFY_QUEST_MUTATION,
} from "../../../graphql/quests";

interface Props {
  children?: React.ReactNode;
  quest: Quest;
  canReviewQuests: boolean;
  projectContributors: string[];
  pathwayStreamId: string;
}

const QuestCard = ({
  quest,
  projectContributors,
  pathwayStreamId,
  canReviewQuests,
}: Props) => {
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isCreatingToken, setIsCreatingToken] = useState<boolean>(false);
  const [claimedBy, setClaimedBy] = useState<string[]>();

  const toast = useToast();
  const router = useRouter();
  const { getRewardCurrency } = useTokenList();
  const [status, setStatus] = useState<string>();

  const { chainId } = useWeb3React();
  const { account, contracts, self } = useContext(Web3Context);
  const [approveQuestMutation] = useMutation(APPROVE_QUEST_MUTATION);

  const { data, refetch: getAllQuestsByPathwayId } = useQuery(
    GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
    {
      variables: {
        pathwayId: quest.pathwayId,
      },
    }
  );

  const [verifyQuestMutation] = useMutation(VERIFY_QUEST_MUTATION);

  useEffect(() => {
    console.log({ streamId: quest.streamId });
    async function init() {
      if (contracts && quest.streamId) {
        const statusInt = await contracts?.BadgeNFT.status(quest.streamId);
        console.log({ statusInt });
        const isMinted = await contracts?.BadgeNFT.badgeMinted(quest.streamId);
        const statusString = await contracts?.BadgeNFT.statusStrings(statusInt);
        setStatus(isMinted ? "MINTED" : statusString);
        const claimedByAddresses =
          await contracts?.BadgeNFT.getAllAddrsByBadgeIDVersion(
            quest.streamId,
            0
          );

        console.log({ claimedByAddresses });
        return setClaimedBy(claimedByAddresses);
      }
      null;
    }
    init();
  }, [contracts, quest.streamId]);

  const openQuest = (questId: string) => {
    console.log(`${router.asPath}/${questId}`);
    return router.push(`${router.asPath}/${questId}`);
  };

  const handleApproveQuest = async () => {
    setIsApproving(true);
    const isWithRewards = parseFloat(quest.rewardAmount) > 0;

    if (status === "NONEXISTENT" && !isWithRewards) {
      console.log({ crea: quest.createdBy });
      // TODO provide quest.createdBy instead of msg.sender?
      const createQuestOnChainTx = await contracts?.BadgeNFT.createBadge(
        quest.streamId,
        data.getAllQuestsByPathwayId.streamId,
        quest.rewardUserCap,
        isWithRewards,
        // TODO: deploy the DCOMP token and package it through npm to get the address based on the chainId
        account || "",
        false,
        "0",
        quest.createdBy
      );
      await createQuestOnChainTx?.wait(1);
    }
    const { data: approveData } = await approveQuestMutation({
      variables: {
        input: {
          id: quest.id,
          questType: quest.questType,
        },
      },
    });
    const [metadataVerifySignature, thresholdVerifySignature] =
      approveData.approveQuest.expandedServerSignatures;
    console.log({ bId: quest.streamId, pId: pathwayStreamId });
    const voteForApprovalTx = await contracts?.BadgeNFT.voteForApproval(
      projectContributors,
      quest.streamId,
      pathwayStreamId,
      [metadataVerifySignature.r, thresholdVerifySignature.r],
      [metadataVerifySignature.s, thresholdVerifySignature.s],
      [metadataVerifySignature.v, thresholdVerifySignature.v],
      1
    );

    // get return values or events
    const receipt = await voteForApprovalTx?.wait(1);
    console.log({ receipt });
    const statusInt = await contracts?.BadgeNFT.status(quest.streamId);
    if (!statusInt) {
      return toast({
        title: "Quest has no status!",
        description: `Approval vote submitted successfully!`,
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
      });
    }
    const statusString = await contracts?.BadgeNFT.statusStrings(statusInt);
    console.log({ statusString });
    switch (statusString) {
      case "NONEXISTENT":
        setStatus("NONEXISTENT");
        break;
      case "PENDING":
        setStatus("PENDING");
        break;
      case "DENIED":
        setStatus("DENIED");
        break;
      case "APPROVED":
        setStatus("APPROVED");
        break;
    }
    setIsApproving(false);
    return toast({
      title: "Quest approved!",
      description: `Approval vote submitted successfully!`,
      status: "success",
      position: "bottom-right",
      duration: 3000,
      isClosable: true,
      variant: "subtle",
    });
  };

  const handleCreateToken = async () => {
    setIsCreatingToken(true);
    if (account && chainId) {
      const formData = new FormData();
      const ogFile = await fetch(`https://ipfs.io/ipfs/${quest.image}`);
      const questImage = await ogFile.blob();
      formData.append("image", questImage);
      formData.append(
        "metadata",
        JSON.stringify({
          ...quest,
        })
      );

      const nftCidRes = await fetch("/api/quest-nft-storage", {
        method: "POST",
        body: formData,
      });

      const { data } = await verifyQuestMutation({
        variables: {
          input: {
            id: quest.id,
            questType: quest.questType,
          },
        },
      });

      const [metadataVerifySignature, thresholdVerifySignature] =
        data.verifyQuest.expandedServerSignatures;

      const { url } = await nftCidRes.json();
      const createTokenTx = await contracts?.BadgeNFT.createToken(
        url,
        quest.streamId,
        pathwayStreamId,
        [metadataVerifySignature.r, thresholdVerifySignature.r],
        [metadataVerifySignature.s, thresholdVerifySignature.s],
        [metadataVerifySignature.v, thresholdVerifySignature.v],
        1
      );

      // get return values or events
      const receipt = await createTokenTx?.wait(1);
      console.log({ receipt });
      const isMinted = await contracts?.BadgeNFT.badgeMinted(quest.streamId);
      if (isMinted) {
        setStatus("MINTED");
      }
    }
    await getAllQuestsByPathwayId();
    setIsCreatingToken(false);
    return toast({
      title: "Quest minted!",
      description: `Quest minted and created successfully!`,
      status: "success",
      position: "bottom-right",
      duration: 3000,
      isClosable: true,
      variant: "subtle",
    });
  };

  const LockedScreen = () => {
    return (
      <Box
        zIndex="overlay"
        borderRadius="8"
        bgColor="bg"
        position="absolute"
        top="0"
        right="0"
        left="0"
        bottom="0"
        opacity="0.6"
      >
        <Flex height="full" align="center" justify="center">
          <LockIcon w={32} h={32} color="text-weak" />
        </Flex>
      </Box>
    );
  };
  const isCompleted = (quest.completedBy || []).includes(self?.id);
  const isClaimed = account && claimedBy?.includes(account);

  const isLocked = quest.id === "01g0yjfgqrhc2q0f4nqtxtqy81";
  const withPrerequisites = quest.prerequisites.length > 0;

  return (
    <Card position="relative" h="xl" spacing="6" py="4">
      {isLocked && <LockedScreen />}

      <Flex
        direction="column"
        w="full"
        h="full"
        filter={isLocked ? "blur(4px)" : "blur(0px)"}
      >
        <Flex align="start" direction="row" w="full" gap="2">
          <Tag
            variant={isClaimed ? "outline" : "subtle"}
            colorScheme={isClaimed || isCompleted ? "accent" : "purple"}
          >
            {isCompleted
              ? isClaimed
                ? "CLAIMED"
                : "COMPLETED"
              : "UNCOMPLETED"}
          </Tag>
          {+quest.rewardAmount !== 0 && (
            <Tag>
              {quest.rewardAmount} {getRewardCurrency(quest.rewardCurrency)}
            </Tag>
          )}
        </Flex>

        <Flex w="full" minH="56px">
          <Flex w="full" justify="center" direction="column">
            <Text color="accent" textTransform="uppercase">
              {quest.difficulty} {quest.questType}
            </Text>
            <Heading
              noOfLines={2}
              as="h2"
              w="full"
              fontSize="2xl"
              color="text"
              textTransform="uppercase"
            >
              {quest.name}
            </Heading>
          </Flex>
          <Avatar
            boxSize="4.8rem"
            src={`https://ipfs.io/ipfs/${quest.image}`}
            position="relative"
          />
        </Flex>
        <VStack w="full" pt={2} align="flex-start">
          {/* Short Description  */}
          <Tooltip label={quest.slogan}>
            <Text color="text-weak" noOfLines={3}>
              {quest.slogan}
            </Text>
          </Tooltip>
        </VStack>

        <Spacer />

        <VStack w="full" align="left" pt="2">
          <Flex align="start" direction="row" w="full" gap="2">
            <Tag variant="subtle" colorScheme="accent">
              OPEN
            </Tag>
            <Tag variant="subtle" colorScheme="purple">
              {claimedBy?.length || 0}/{quest.rewardUserCap} CLAIMED
            </Tag>
          </Flex>

          <VStack w="full" align="start">
            <Text color="accent">Prerequisites: </Text>

            {withPrerequisites ? (
              <Popover isLazy matchWidth>
                <PopoverTrigger>
                  <Button w="full" variant="outline">
                    {quest.prerequisites.length} Prerequisites
                  </Button>
                </PopoverTrigger>
                <PopoverContent w="full">
                  <PopoverBody>
                    <UnorderedList>
                      {quest.prerequisites.map((prereqQuestId) => {
                        return (
                          <ListItem key={prereqQuestId}>
                            <Link
                              href={`http://localhost:3000/projects/${data.getAllQuestsByPathwayId.projectId}/pathways/${data.getAllQuestsByPathwayId.id}/${prereqQuestId}`}
                              isExternal
                            >
                              {
                                [
                                  ...data.getAllQuestsByPathwayId.quizQuests,
                                  ...data.getAllQuestsByPathwayId.bountyQuests,
                                ]?.find((qst) => qst.id === prereqQuestId)?.name
                              }{" "}
                              <ExternalLinkIcon mx="2px" />
                            </Link>
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ) : (
              <Button w="full" disabled variant="outline">
                None
              </Button>
            )}
          </VStack>
        </VStack>

        <Flex w="full" justify="end" pt="4">
          {canReviewQuests && status !== "MINTED" && (
            <VStack w="full" align="left">
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
              {status && (status === "PENDING" || status === "NONEXISTENT") && (
                <HStack w="full" justifyContent="space-between">
                  <Button
                    colorScheme="accent"
                    onClick={handleApproveQuest}
                    isLoading={isApproving}
                    loadingText="Approving"
                    leftIcon={<CheckIcon />}
                  >
                    Approve
                  </Button>
                  <Button
                    ml="5"
                    colorScheme="secondary"
                    leftIcon={<CloseIcon />}
                  >
                    Reject
                  </Button>
                </HStack>
              )}
              {status && status === "APPROVED" && (
                <HStack>
                  <Button
                    onClick={handleCreateToken}
                    isLoading={isCreatingToken}
                    loadingText="Minting quest"
                    leftIcon={<CheckIcon />}
                  >
                    Create Token
                  </Button>
                </HStack>
              )}
            </VStack>
          )}
          {!canReviewQuests && status !== "MINTED" && (
            <VStack w="full" layerStyle="outline-card">
              <Text>Under review</Text>
            </VStack>
          )}
          {status == "MINTED" && (
            <>
              {/* <Tooltip
                label={`0% - 0/${pathway.quests?.length || 0} quests completed`}
                hasArrow
                placement="top"
              > */}
              {/* <HStack w="full">
                  <Progress
                    w="full"
                    size="md"
                    rounded="md"
                    value={0}
                    border={`solid 1px ${getAccentColor}`}
                    hasStripe
                    colorScheme="accent"
                    bgColor="bg"
                  />
                </HStack> */}
              {/* </Tooltip> */}

              <Flex w="full" justify="space-between">
                <Button
                  w="full"
                  leftIcon={<GiSwordwoman />}
                  fontSize="md"
                  onClick={() => openQuest(quest.id)}
                >
                  Start quest
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default QuestCard;
