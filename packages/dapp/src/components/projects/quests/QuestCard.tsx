import { useMutation } from "@apollo/client";
import { CheckIcon, CloseIcon, LockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Card from "components/custom/Card";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FiUserCheck } from "react-icons/fi";
import { GiSwordwoman, GiTwoCoins } from "react-icons/gi";
import { RiHandCoinFill, RiSwordLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { Web3Context } from "../../../contexts/Web3Provider";
import useCustomColor from "../../../core/hooks/useCustomColor";
import { useCardMarkdownTheme } from "../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../core/hooks/useTokenList";
import {
  APPROVE_QUEST_MUTATION,
  CLAIM_QUEST_REWARDS_MUTATION,
  VERIFY_QUEST_MUTATION,
} from "../../../graphql/quests";

type Quest = {
  id: string;
  streamId: string;
  image: string;
  completedBy: string[];
  projectId: string;
  pathwayId: string;
  owner: string;
  name: string;
  questType: string;
  description: string;
  isPending: string;
  website: string;
  network: string;
  rewardAmount: string;
  rewardUserCap: number;
  rewardCurrency: string;
  // unlocked: boolean;
};
const unlocked = true;

const ModalDetails = ({ quest }: { quest: Quest }) => {
  const { getTextColor, getOverBgColor } = useCustomColor();
  const pathwayCardMarkdownTheme = useCardMarkdownTheme();

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{quest.name}</ModalHeader>
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
                {quest.description}
              </ReactMarkdown>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </>
  );
};

function QuestCard({
  quest,
  projectContributors,
  pathwayStreamId,
}: {
  quest: Quest;
  projectContributors: string[];
  pathwayStreamId: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const { getRewardCurrency } = useTokenList();
  const [status, setStatus] = useState<string>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chainId, library } = useWeb3React();
  const { account, contracts, self } = useContext(Web3Context);
  const [approveQuestMutation] = useMutation(APPROVE_QUEST_MUTATION, {
    refetchQueries: "all",
  });

  const [claimQuestRewardsMutation] = useMutation(
    CLAIM_QUEST_REWARDS_MUTATION,
    {
      refetchQueries: "all",
    }
  );

  const [verifyQuestMutation] = useMutation(VERIFY_QUEST_MUTATION, {
    refetchQueries: "all",
  });

  useEffect(() => {
    console.log({ streamId: quest.streamId });
    async function init() {
      if (contracts && quest.streamId) {
        const statusInt = await contracts.BadgeNFT.status(quest.streamId);
        console.log({ statusInt });
        const isMinted = await contracts.BadgeNFT.badgeMinted(quest.streamId);
        const statusString = await contracts.BadgeNFT.statusStrings(statusInt);
        setStatus(isMinted ? "MINTED" : statusString);
      }
      null;
    }
    init();
  }, [contracts, quest.streamId]);

  const isContributor =
    projectContributors && account && projectContributors.includes(account);

  const openQuest = (questId: string) => {
    console.log(`${router.asPath}/${questId}`);
    return router.push(`${router.asPath}/${questId}`);
  };

  const handleApproveQuest = async () => {
    const signatureInput = {
      id: quest.id,
      pathwayId: quest.pathwayId,
    };
    const signature = await library.provider.send("personal_sign", [
      JSON.stringify(signatureInput),
      account,
    ]);
    const { data } = await approveQuestMutation({
      variables: {
        input: {
          id: quest.id,
          questApproverSignature: signature.result,
          chainId,
        },
      },
    });
    const [metadataVerifySignature, thresholdVerifySignature] =
      data.approveQuest.expandedServerSignatures;
    console.log({ bId: quest.streamId, pId: pathwayStreamId });
    const voteForApprovalTx = await contracts.BadgeNFT.voteForApproval(
      projectContributors,
      quest.streamId,
      pathwayStreamId,
      [metadataVerifySignature.r, thresholdVerifySignature.r],
      [metadataVerifySignature.s, thresholdVerifySignature.s],
      [metadataVerifySignature.v, thresholdVerifySignature.v],
      1
    );

    // get return values or events
    const receipt = await voteForApprovalTx.wait(1);
    console.log({ receipt });
    const statusInt = await contracts.BadgeNFT.status(quest.streamId);
    const statusString = await contracts.BadgeNFT.statusStrings(statusInt);
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
  };

  const handleCreateToken = async () => {
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

      const signatureInput = {
        id: quest.id,
        pathwayId: quest.pathwayId,
      };
      const signature = await library.provider.send("personal_sign", [
        JSON.stringify(signatureInput),
        account,
      ]);

      const { data } = await verifyQuestMutation({
        variables: {
          input: {
            id: quest.id,
            questMinterSignature: signature.result,
            chainId,
          },
        },
      });

      const [metadataVerifySignature, thresholdVerifySignature] =
        data.verifyQuest.expandedServerSignatures;

      const { url } = await nftCidRes.json();
      const createTokenTx = await contracts.BadgeNFT.createToken(
        url,
        quest.streamId,
        pathwayStreamId,
        [metadataVerifySignature.r, thresholdVerifySignature.r],
        [metadataVerifySignature.s, thresholdVerifySignature.s],
        [metadataVerifySignature.v, thresholdVerifySignature.v],
        1
      );

      // get return values or events
      const receipt = await createTokenTx.wait(1);
      console.log({ receipt });
      const isMinted = await contracts.BadgeNFT.badgeMinted(quest.streamId);
      if (isMinted) {
        setStatus("MINTED");
      }
    }
    // TODO: user feedback
    return null;
  };

  const handleClaimRewards = async () => {
    const signatureInput = {
      id: quest.id,
      pathwayId: quest.pathwayId,
    };
    const signature = await library.provider.send("personal_sign", [
      JSON.stringify(signatureInput),
      account,
    ]);

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
    const { url } = await nftCidRes.json();

    const { data } = await claimQuestRewardsMutation({
      variables: {
        input: {
          questId: quest.id,
          did: self.id,
          questAdventurerSignature: signature.result,
          chainId,
        },
      },
    });

    const [, tokenAddressOrSymbol] = quest.rewardCurrency.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;

    const [metadataVerify] = data.claimQuestRewards.expandedServerSignatures;

    console.log({ metadataVerify });
    const claimRewardsTx = await contracts.BadgeNFT.claimBadgeRewards(
      quest.streamId,
      isNativeToken,
      isNativeToken ? account : tokenAddressOrSymbol,
      metadataVerify.r,
      metadataVerify.s,
      metadataVerify.v,
      true,
      url
    );
    await claimRewardsTx.wait(1);
    return toast({
      title: "Congratulations!",
      description: `Rewards claimed successfully!`,
      status: "success",
      position: "top-right",
      duration: 6000,
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
  return (
    <Card position="relative" h="xl" spacing="6" py="4">
      {!unlocked && <LockedScreen />}

      <Box filter={!unlocked ? "blur(4px)" : "blur(0px)"} w="full">
        <Flex w="full" minH="56px">
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

          <Spacer />
          <Flex align="end" direction="column" w="full">
            <Tag variant="subtle">
              {isCompleted ? "COMPLETED" : "UNCOMPLETED"}
            </Tag>
            <Tag my="2">
              {quest.rewardAmount} {getRewardCurrency(quest.rewardCurrency)}
            </Tag>
          </Flex>
        </Flex>
        <VStack w="full" align="flex-start" onClick={onOpen}>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalDetails quest={quest} />
          </Modal>
          {/* Short Description  */}
          <Text color="text-weak" noOfLines={3}>
            Short Description Short Description Short Description Short
            Description Short Description Short Description Short Description
            Short Description Short Description Short Description Short
            Description Short Description Short Description Short Description
            Short Description
          </Text>
          <Text>See more</Text>
        </VStack>

        <Divider />

        <VStack w="full" align="left" pt="2">
          <HStack justifyContent="space-between">
            <HStack>
              <Icon as={RiSwordLine} />
              <Text
                fontWeight="bold"
                fontSize="xl"
                color="text"
                textTransform="uppercase"
              >
                Quest type
              </Text>
            </HStack>
            <Tag variant="outline">{quest.questType}</Tag>
          </HStack>
          <Divider />
          <HStack justifyContent="space-between">
            <HStack>
              <Icon as={FiUserCheck} />
              <Text
                fontWeight="bold"
                fontSize="xl"
                color="text"
                textTransform="uppercase"
              >
                Claimed
              </Text>
            </HStack>
            <Tag variant="outline">0/{quest.rewardUserCap}</Tag>
          </HStack>
          <Divider />
          <HStack justifyContent="space-between">
            <HStack>
              <Icon as={GiTwoCoins} />
              <Text
                fontWeight="bold"
                fontSize="xl"
                color="text"
                textTransform="uppercase"
              >
                Rewards
              </Text>
            </HStack>
            <Tag variant="outline">
              {quest.rewardAmount} {getRewardCurrency(quest.rewardCurrency)}
            </Tag>
          </HStack>

          <Stack
            w="full"
            justifyContent="space-between"
            direction="row"
            spacing={4}
            align="center"
          >
            <Avatar
              boxSize="4.8rem"
              src={`https://ipfs.io/ipfs/${quest.image}`}
              position="relative"
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
              color="purple.500"
              rounded="full"
            >
              <Text fontSize="3xl" fontWeight="bold">
                {parseFloat(quest.rewardAmount) / quest.rewardUserCap}{" "}
                {getRewardCurrency(quest.rewardCurrency)}
              </Text>
            </Flex>
          </Stack>
          <Spacer />
        </VStack>

        <Flex w="full" justify="space-between" pt="4">
          {isContributor && status !== "MINTED" && (
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
                    colorScheme="accentDark"
                    onClick={handleApproveQuest}
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
                    colorScheme="accentDark"
                    bgColor="bg"
                  />
                </HStack> */}
              {/* </Tooltip> */}

              <Flex w="full" justify="space-between">
                <Button
                  leftIcon={<GiSwordwoman />}
                  fontSize="md"
                  onClick={() => openQuest(quest.id)}
                >
                  Start
                </Button>

                {!quest.isPending && (
                  <Button
                    fontSize="md"
                    variant="outline"
                    leftIcon={<RiHandCoinFill />}
                    disabled={!isCompleted}
                    onClick={handleClaimRewards}
                  >
                    Claim
                  </Button>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    </Card>
  );
}

export default QuestCard;
