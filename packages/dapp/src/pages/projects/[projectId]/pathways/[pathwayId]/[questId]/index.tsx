import { useMutation, useQuery } from "@apollo/client";
import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Progress,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Container from "components/layout/Container";
import BountyForm from "components/projects/quests/bounty/BountyForm";
import QuestSubmissionList from "components/projects/quests/bounty/QuestSubmissionList";
import { Web3Context } from "contexts/Web3Provider";
import { GET_PATHWAY_BY_ID_QUERY } from "graphql/pathways";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import Blockies from "react-blockies";
import { BsCheckCircleFill, BsPeople } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { RiHandCoinFill, RiSwordLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import CardMedia from "../../../../../../components/custom/CardMedia";
import BreadcrumbItems from "../../../../../../components/layout/BreadcrumbItems";
// import GithubContributorQuestForm from "../../../../../../components/projects/quests/github/GithubContributorQuestForm";
import QuestCompletedByList from "../../../../../../components/projects/quests/QuestCompletedByList";
import QuizForm from "../../../../../../components/projects/quests/quiz/QuizForm";
// import SnapshotVoterForm from "../../../../../../components/projects/quests/snapshot/SnapshotVoterForm";
// import ClaimNFTOwnerForm from "../../../../../../components/projects/quests/token/ClaimNFTOwnerForm";
// import ClaimTokenHolderForm from "../../../../../../components/projects/quests/token/ClaimTokenHolderForm";
import { usePageMarkdownTheme } from "../../../../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../../../../core/hooks/useTokenList";
import { PROJECT_BY_ID_QUERY } from "../../../../../../graphql/projects";
import {
  CLAIM_QUEST_REWARDS_MUTATION,
  GET_QUIZ_QUEST_BY_ID_QUERY,
} from "../../../../../../graphql/quests";

type Props = {
  projectId: string | null;
  pathwayId: string | null;
  questId: string | null;
  locale: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string; pathwayId: string; questId: string; locale: string }
> = async (ctx) => {
  const locale = ctx.locale || "en";
  const questId = ctx.params?.questId ?? null;
  const pathwayId = ctx.params?.pathwayId ?? null;
  const projectId = ctx.params?.projectId ?? null;

  return {
    props: {
      questId,
      pathwayId,
      projectId,
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

function QuestPage({ questId, pathwayId, projectId }: any) {
  const {
    data: quizData,
    loading: quizLoading,
    error: quizError,
  } = useQuery(GET_QUIZ_QUEST_BY_ID_QUERY, {
    variables: {
      questId,
    },
  });

  const [tabIndex, setTabIndex] = useState(0);

  const [claimedBy, setClaimedBy] = useState<string[]>();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [rewardStatus, setRewardStatus] = useState<string>(() =>
    isClaimed ? "Rewards claimed" : "Claim rewards"
  );
  const { t } = useTranslation("common");
  const { getRewardCurrency } = useTokenList();
  const questMarkdownTheme = usePageMarkdownTheme();
  const toast = useToast();
  const { account, self, contracts } = useContext(Web3Context);

  useEffect(() => {
    async function getClaimedBy() {
      if (contracts?.BadgeNFT && quizData?.getQuizQuestById?.streamId) {
        const claimedByAddresses =
          await contracts.BadgeNFT.getAllAddrsByBadgeIDVersion(
            quizData.getQuizQuestById.streamId,
            0
          );
        const currentUserHasClaimed = claimedByAddresses.includes(account);
        console.log({ claimedByAddresses, currentUserHasClaimed });
        setIsClaimed(currentUserHasClaimed);
        setRewardStatus(
          currentUserHasClaimed ? "Rewards claimed" : "Claim rewards"
        );
        return setClaimedBy(claimedByAddresses);
      }
    }
    getClaimedBy();
  }, [contracts, quizData?.getQuizQuestById, account]);

  const { data, loading, error } = useQuery(GET_PATHWAY_BY_ID_QUERY, {
    variables: {
      pathwayId,
    },
  });
  const [claimQuestRewardsMutation] = useMutation(CLAIM_QUEST_REWARDS_MUTATION);

  const {
    data: projectRes,
    loading: projectLoading,
    error: projectError,
  } = useQuery(PROJECT_BY_ID_QUERY, {
    variables: {
      projectId,
    },
  });

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handleClaimQuestRewards = async () => {
    setIsClaiming(true);
    setRewardStatus("Claiming rewards");
    const {
      name,
      streamId,
      description,
      image,
      createdAt,
      rewardAmount,
      rewardCurrency,
      rewardUserCap,
      questType,
      projectId,
      questions,
      createdBy,
      collectionContractAddress,
      tokenContractAddress,
      amount,
      chainId,
      namespace,
    } = quizData?.getQuizQuestById;
    setRewardStatus("Generating tokenURI");
    const formData = new FormData();
    const ogFile = await fetch(`https://ipfs.io/ipfs/${image}`);
    const questImage = await ogFile.blob();
    formData.append("image", questImage);
    formData.append(
      "metadata",
      JSON.stringify({
        id: questId,
        name,
        description,
        image,
        createdAt,
        rewardAmount,
        rewardCurrency,
        rewardUserCap,
        questType,
        pathwayId,
        projectId,
        questions,
        createdBy,
        collectionContractAddress,
        tokenContractAddress,
        amount,
        chainId,
        namespace,
      })
    );

    const nftCidRes = await fetch("/api/quest-nft-storage", {
      method: "POST",
      body: formData,
    });
    const { url } = await nftCidRes.json();
    setRewardStatus("Verifying claim");

    const { data } = await claimQuestRewardsMutation({
      variables: {
        input: {
          questId,
          did: self.id,
          questType: questType,
        },
      },
    });

    const hasRewards = rewardAmount ? true : false;
    console.log({ hasRewards });
    const [metadataVerify] = data.claimQuestRewards.expandedServerSignatures;
    setRewardStatus("Claiming on-chain");
    if (hasRewards) {
      const [, tokenAddressOrSymbol] = rewardCurrency.split(":");
      const isNativeToken = tokenAddressOrSymbol ? false : true;
      const claimRewardsTx = await contracts.BadgeNFT.claimBadgeRewards(
        streamId,
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
    } else {
      const claimRewardsTx = await contracts.BadgeNFT.claimBadgeRewards(
        streamId,
        false,
        account,
        metadataVerify.r,
        metadataVerify.s,
        metadataVerify.v,
        false,
        url,
        0
      );
      await claimRewardsTx.wait(1);
    }

    console.log({ metadataVerify });

    const claimedByAddresses =
      await contracts.BadgeNFT.getAllAddrsByBadgeIDVersion(
        quizData.getQuizQuestById.streamId,
        0
      );
    const currentUserHasClaimed = claimedByAddresses.includes(account);

    setIsClaimed(currentUserHasClaimed);
    setRewardStatus(
      currentUserHasClaimed ? "Rewards claimed" : "Claim rewards"
    );
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

  const isOwner = quizData?.getQuizQuestById.createdBy.did === self?.id;
  const isCompleted = useCallback(() => {
    return (quizData?.getQuizQuestById.completedBy || []).includes(self?.id);
  }, [quizData?.getQuizQuestById.completedBy, self?.id]);

  const getShortenedAddress = (address: string) => {
    if (!address) {
      return "Anonymous";
    }
    let displayAddress = address.slice(0, 6);
    displayAddress += `...${address.slice(-4)}`;

    return displayAddress;
  };

  if (loading || projectLoading || quizLoading)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">
          {t("quest")} {t("loading")}
        </Text>
        <Progress size="xs" isIndeterminate />
      </Stack>
    );
  if (error || projectError || quizError)
    return `Loading error! ${error?.message || projectError?.message}`;
  const isContributor = projectRes.getProjectById.squads
    .flatMap(({ members }: { members: string[] }) => members)
    .includes(account);
  return (
    <Container>
      <BreadcrumbItems
        breadCrumbs={[
          {
            label: "Projects",
            href: "/",
          },
          {
            label: projectRes.getProjectById.name,
            href: `/projects/${projectId}`,
          },
          {
            label: "Pathways",
            href: `/projects/${projectId}`,
          },
          {
            label: data.getPathwayById.title,
            href: `/projects/${projectId}/pathways/${pathwayId}/`,
          },
          {
            label: quizData?.getQuizQuestById.name,
            href: `/projects/${projectId}/pathways/${pathwayId}/${questId}`,
            isCurrentPage: true,
          },
        ]}
      />

      <VStack align="left" w="full">
        <Heading as="h1" size="2xl" color="text-weak" py="4">
          {quizData?.getQuizQuestById.name}{" "}
          <Icon as={RiSwordLine} color="text-weak" />
        </Heading>
        <Text color="text-weak">{quizData?.getQuizQuestById.slogan}</Text>

        <Tabs w="full" index={tabIndex} onChange={handleTabsChange}>
          <HStack justifyContent="space-between">
            <TabList overflowX="auto">
              <Tab>Guide</Tab>
              <Tab>Play</Tab>
              <Tab>Details&amp;Rewards</Tab>
              {quizData?.getQuizQuestById.questType === "bounty" && (
                <Tab>Submissions</Tab>
              )}
              <Tab>Status</Tab>
            </TabList>
          </HStack>

          <TabPanels>
            {/* Guide */}
            <TabPanel px="0">
              <VStack w="full" align="flex-start">
                <ReactMarkdown
                  components={ChakraUIRenderer(questMarkdownTheme)}
                  skipHtml
                >
                  {quizData?.getQuizQuestById.description}
                </ReactMarkdown>
              </VStack>
            </TabPanel>

            {/* Play */}
            <TabPanel px="0">
              {quizData?.getQuizQuestById.completedBy &&
              quizData?.getQuizQuestById.completedBy.includes(self?.id) ? (
                <Text>Quest already completed!</Text>
              ) : (
                <Box>
                  {quizData?.getQuizQuestById.questType === "quiz" && (
                    <QuizForm
                      questions={quizData?.getQuizQuestById.questions}
                      questId={questId}
                      pathwayId={pathwayId}
                      successCallback={() => handleTabsChange(2)}
                    />
                  )}
                  {quizData?.getQuizQuestById.questType === "bounty" && (
                    <BountyForm
                      questId={questId}
                      pathwayId={pathwayId}
                      successCallback={() => handleTabsChange(2)}
                    />
                  )}
                  {/* {quizData?.getQuizQuestById.questType === "snapshot-voter" && (
                    <SnapshotVoterForm proposalId={proposalId} questId={id} />
                  )}
                  {quizData?.getQuizQuestById.questType === "github-contributor" && (
                    <GithubContributorQuestForm
                      githubOrgId={githubOrgId}
                      questId={id}
                    />
                  )}
                  {quizData?.getQuizQuestById.questType === "nft-owner" && (
                    <ClaimNFTOwnerForm
                      questId={id}
                      contractAddress={collectionContractAddress}
                      namespace={namespace || "eip155"}
                      collectionChainId={tokenChainId}
                    />
                  )}
                  {quizData?.getQuizQuestById.questType === "token-holder" && (
                    <ClaimTokenHolderForm
                      questId={id}
                      amount={amount}
                      contractAddress={tokenContractAddress}
                      namespace={namespace || "eip155"}
                      tokenChainId={tokenChainId}
                    />
                  )} */}
                </Box>
              )}
            </TabPanel>

            {/* Details&amp;Rewards */}
            <TabPanel px="0">
              <Flex
                w="full"
                direction={["column", "column", "row"]}
                align="left"
                justifyContent="space-between"
              >
                <VStack align="left">
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
                    <Tag variant="outline" size="lg">
                      {quizData?.getQuizQuestById.questType}
                    </Tag>
                  </HStack>
                  <HStack>
                    <HStack>
                      <Icon as={BsPeople} />
                      <Text
                        fontWeight="bold"
                        fontSize="xl"
                        color="text"
                        textTransform="uppercase"
                      >
                        Claimed
                      </Text>
                    </HStack>
                    <Tag variant="outline" size="lg">
                      {claimedBy?.length || 0}/
                      {quizData?.getQuizQuestById.rewardUserCap}
                    </Tag>
                  </HStack>
                  {quizData?.getQuizQuestById.rewardAmount !== 0 ? (
                    <HStack w="full">
                      <Icon as={GiTwoCoins} />
                      <Text
                        fontWeight="bold"
                        fontSize="xl"
                        color="text"
                        textTransform="uppercase"
                      >
                        Total Rewards
                      </Text>
                      <Tag variant="outline" size="lg">
                        {quizData?.getQuizQuestById.rewardAmount}{" "}
                        {getRewardCurrency(
                          quizData?.getQuizQuestById.rewardCurrency
                        )}
                      </Tag>
                    </HStack>
                  ) : (
                    <HStack w="full">
                      <Icon as={GiTwoCoins} />
                      <Text
                        fontWeight="bold"
                        fontSize="xl"
                        color="text"
                        textTransform="uppercase"
                      >
                        Only NFT
                      </Text>
                    </HStack>
                  )}
                </VStack>
                <Flex align="center" maxW="full" py="4">
                  {quizData?.getQuizQuestById.createdBy && (
                    <Blockies
                      seed={
                        quizData?.getQuizQuestById.createdBy.name ||
                        quizData?.getQuizQuestById.createdBy.did
                      }
                      className="blockies"
                      size={7}
                      scale={10}
                    />
                  )}
                  <VStack align="flex-start" mx="2">
                    <Text color="text-weak" textStyle="small">
                      {t("creation-date")}{" "}
                      {new Date(
                        quizData?.getQuizQuestById.createdAt || Date.now()
                      ).toLocaleString()}
                    </Text>
                    {quizData?.getQuizQuestById.createdBy && (
                      <Text fontSize="sm">
                        {t("by")}{" "}
                        {getShortenedAddress(
                          quizData?.getQuizQuestById.createdBy.did
                        )}
                      </Text>
                    )}
                    {isOwner && (
                      // TODO: edit quest form
                      <NextLink
                        href={`/projects/${projectId}/pathways/${pathwayId}/${questId}/edit-quest`}
                        passHref
                      >
                        <Button leftIcon={<EditIcon />}>Edit Quest</Button>
                      </NextLink>
                    )}
                  </VStack>
                </Flex>
              </Flex>

              <CardMedia
                h="xs"
                mt="4"
                src={`https://ipfs.io/ipfs/${quizData?.getQuizQuestById.image}`}
                imageHeight="120px"
              >
                <VStack w="full" align="start">
                  <Text color="accent">Rewards</Text>
                  <HStack pb="2">
                    <Avatar
                      boxSize="3rem"
                      src={`https://ipfs.io/ipfs/${quizData?.getQuizQuestById.image}`}
                      position="relative"
                      zIndex={2}
                      _before={{
                        content: '""',
                        width: "full",
                        height: "full",
                        rounded: "full",
                        transform: "scale(1.125)",
                        bg: "purple.500",
                        position: "absolute",
                        zIndex: -1,
                        top: 0,
                        left: 0,
                      }}
                    />
                    {quizData?.getQuizQuestById.rewardAmount !== 0 && (
                      <>
                        <Text>+</Text>
                        <Tag variant="outline" size="lg">
                          {quizData?.getQuizQuestById.rewardAmount /
                            quizData?.getQuizQuestById.rewardUserCap}{" "}
                          {getRewardCurrency(
                            quizData?.getQuizQuestById.rewardCurrency
                          )}
                        </Tag>
                      </>
                    )}
                  </HStack>
                  <Button
                    w="full"
                    fontSize="md"
                    disabled={isClaiming || !isCompleted() || isClaimed}
                    loadingText={rewardStatus}
                    isLoading={isClaiming}
                    variant="outline"
                    leftIcon={
                      isClaimed ? <BsCheckCircleFill /> : <RiHandCoinFill />
                    }
                    onClick={handleClaimQuestRewards}
                  >
                    {rewardStatus}
                  </Button>
                </VStack>
              </CardMedia>
            </TabPanel>

            {/* 3 Tab */}
            {quizData?.getQuizQuestById.questType === "bounty" &&
              isContributor && (
                <TabPanel px="0">
                  <VStack w="full" align="flex-start">
                    <QuestSubmissionList
                      questId={quizData.getQuizQuestById.id}
                    />
                  </VStack>
                </TabPanel>
              )}

            {/* 4 Tab */}
            <TabPanel px="0">
              <VStack w="full" align="flex-start">
                {quizData?.getQuizQuestById.completedBy && (
                  <QuestCompletedByList
                    streamId={quizData.getQuizQuestById.streamId}
                    completedBy={quizData.getQuizQuestById.completedBy}
                    claimedByAddrs={claimedBy}
                  />
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}

export default QuestPage;
