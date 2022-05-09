import { useMutation, useQuery } from "@apollo/client";
import { EditIcon, AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";

import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Container from "components/layout/Container";
import { Web3Context } from "contexts/Web3Provider";
import {
  CLAIM_PATHWAY_REWARDS_MUTATION,
  GET_PATHWAY_BY_ID_QUERY,
} from "graphql/pathways";
import { GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY } from "graphql/quests";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Blockies from "react-blockies";
import { BsBarChartFill, BsCheckCircleFill, BsPeople } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { GoTasklist } from "react-icons/go";
import { RiHandCoinFill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { initializeApollo } from "../../../../../../lib/apolloClient";
import CardMedia from "../../../../../components/custom/CardMedia";
import BreadcrumbItems from "../../../../../components/layout/BreadcrumbItems";
import QuestCard from "../../../../../components/projects/quests/QuestCard";
import useCustomColor from "../../../../../core/hooks/useCustomColor";
import { usePageMarkdownTheme } from "../../../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../../../core/hooks/useTokenList";
import { PROJECT_BY_ID_QUERY } from "../../../../../graphql/projects";

type Props = {
  projectId: string | null;
  pathwayId: string | null;
  locale: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string; pathwayId: string; locale: string }
> = async (ctx) => {
  const locale = ctx.locale || "en";
  const pathwayId = ctx.params?.pathwayId ?? null;
  const projectId = ctx.params?.projectId ?? null;
  console.log({ pathwayId, projectId });
  if (!pathwayId || !projectId) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_PATHWAY_BY_ID_QUERY,
      variables: {
        pathwayId,
      },
    });
    console.log({ data });
    return {
      props: {
        id: pathwayId,
        ...data.getPathwayById,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    console.log({ error });
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

function PathwayPage({
  id,
  title,
  description,
  slogan,
  image,
  quizQuests = [],
  bountyQuests = [],
  difficulty,
  createdBy,
  createdAt,
  rewardAmount,
  rewardUserCap,
  rewardCurrency,
  projectId,
  streamId,
}: any) {
  const { t } = useTranslation("common");
  const toast = useToast();
  const [pathwayProgress, setPathwayProgress] = useState<{
    totalQuestCount: number;
    completedQuestCount: number;
    ratio: number;
  }>();

  const [claimedBy, setClaimedBy] = useState<string[]>();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [rewardStatus, setRewardStatus] = useState<string>();
  const { getRewardCurrency } = useTokenList();
  const pathwayMarkdownTheme = usePageMarkdownTheme();

  const { account, isReviewer, contracts, self } = useContext(Web3Context);

  const { getAccentColor } = useCustomColor();
  const [claimPathwayRewardsMutation] = useMutation(
    CLAIM_PATHWAY_REWARDS_MUTATION
  );
  const { data, loading, error } = useQuery(
    GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
    {
      variables: {
        pathwayId: id,
      },
    }
  );
  const {
    data: projectRes,
    loading: projectLoading,
    error: projectError,
  } = useQuery(PROJECT_BY_ID_QUERY, {
    variables: {
      projectId,
    },
  });

  const allQuests = useMemo(
    () => [
      ...(data?.getAllQuestsByPathwayId?.quizQuests || []),
      ...(data?.getAllQuestsByPathwayId?.bountyQuests || []),
    ],
    [
      data?.getAllQuestsByPathwayId?.quizQuests,
      data?.getAllQuestsByPathwayId?.bountyQuests,
    ]
  );
  useEffect(() => {
    const totalQuestCount = allQuests.length;
    const completedQuestCount = self?.id
      ? allQuests.filter((q) => q.completedBy.includes(self.id) && !q.isPending)
          .length
      : 0;
    const ratio = (completedQuestCount / totalQuestCount) * 100;

    setPathwayProgress({
      totalQuestCount,
      completedQuestCount,
      ratio,
    });
  }, [allQuests, self?.id]);

  useEffect(() => {
    async function init() {
      if (contracts && streamId) {
        const claimedByAddresses =
          await contracts.pathwayNFTContract.getAllAddrsByPathwayIDVersion(
            streamId,
            0
          );
        const currentUserHasClaimed = claimedByAddresses.includes(account);

        setIsClaimed(currentUserHasClaimed);
        setRewardStatus(currentUserHasClaimed ? "Claimed" : "Claim");
        setClaimedBy(claimedByAddresses);
      }
      null;
    }
    init();
  }, [contracts, streamId, account]);
  const handleClaimPathwayRewards = async () => {
    setIsClaiming(true);
    setRewardStatus("Claiming rewards");

    setRewardStatus("Generating tokenURI");
    const formData = new FormData();
    const ogFile = await fetch(`https://ipfs.io/ipfs/${image}`);
    const questImage = await ogFile.blob();
    formData.append("image", questImage);
    formData.append(
      "metadata",
      JSON.stringify({
        id,
        title,
        description,
        slogan,
        image,
        quizQuests,
        bountyQuests,
        difficulty,
        createdBy,
        createdAt,
        rewardAmount,
        rewardUserCap,
        rewardCurrency,
        projectId,
      })
    );

    const nftCidRes = await fetch("/api/pathway-nft-storage", {
      method: "POST",
      body: formData,
    });
    const { url } = await nftCidRes.json();
    setRewardStatus("Verifying claim");

    const { data } = await claimPathwayRewardsMutation({
      variables: {
        input: {
          pathwayId: id,
          did: self.id,
        },
      },
    });

    const [, tokenAddressOrSymbol] = rewardCurrency.split(":");
    const isNativeToken = tokenAddressOrSymbol ? false : true;

    const [metadataVerify] = data.claimPathwayRewards.expandedServerSignatures;
    console.log({ metadataVerify });
    setRewardStatus("Claiming on-chain");
    const claimRewardsTx =
      await contracts.pathwayNFTContract.claimPathwayRewards(
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

    const claimedByAddresses =
      await contracts.PathwayNFTContract.getAllAddrsByPathwayIDVersion(
        streamId,
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

  const getShortenedAddress = (address: string) => {
    let displayAddress = address.slice(0, 6);
    displayAddress += `...${address.slice(-4)}`;

    return displayAddress;
  };

  const isOwner = createdBy === account;
  const isProjectContributor = useMemo(
    () =>
      projectRes?.getProjectById?.squads &&
      projectRes.getProjectById.squads
        .flatMap(({ members }: { members: string[] }) => members)
        .includes(account),
    [projectRes?.getProjectById, account]
  );
  const canEdit = isProjectContributor || isOwner;

  const canReviewQuests = isProjectContributor || isOwner || isReviewer;

  const renderQuests = useCallback(
    (questsToRender: Record<string, unknown>[]) => {
      return (
        data?.getAllQuestsByPathwayId &&
        projectRes?.getProjectById &&
        questsToRender.map((quest: any) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            canReviewQuests={canReviewQuests}
            pathwayStreamId={data.getAllQuestsByPathwayId.streamId}
            projectContributors={
              projectRes.getProjectById.squads.flatMap(
                ({ members }: { members: string[] }) => members
              ) || []
            }
          />
        ))
      );
    },
    [data?.getAllQuestsByPathwayId, canReviewQuests, projectRes?.getProjectById]
  );

  if (loading || projectLoading || !projectRes?.getProjectById)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">
          {t("pathway")} {t("loading")}
        </Text>
        <Progress size="xs" isIndeterminate />
      </Stack>
    );
  if (error || projectError)
    return `Loading error! ${error?.message || projectError?.message}`;

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
            label: title,
            href: `/projects/${projectId}/pathways/${id}/`,
            isCurrentPage: true,
          },
        ]}
      />

      <VStack align="left" w="full">
        <Heading as="h1" size="2xl" color="text" py="4">
          {title}
        </Heading>
        <HStack w="full" justify="space-between">
          <Text color="text-weak">{slogan}</Text>
          {canEdit && (
            <NextLink
              href={`/projects/${projectId}/pathways/${id}/edit`}
              passHref
            >
              {/** TODO: Edit pathway form or page **/}
              <Button disabled leftIcon={<AddIcon />}>
                {t("edit-pathway")}
              </Button>
            </NextLink>
          )}
        </HStack>
        <Tabs w="full">
          <HStack w="full">
            <TabList w="full">
              <Tab w="full">Quests</Tab>
              <Tab w="full">Guide</Tab>
              <Tab w="full">Details&amp;Rewards</Tab>
            </TabList>
          </HStack>

          <TabPanels>
            {/* Quests */}
            <TabPanel px="0">
              <Tabs w="full" variant="unstyled">
                <Flex
                  w="full"
                  direction={["column", "column", "row"]}
                  justify="space-between"
                >
                  <TabList>
                    <Tab>{t("all-quests")}</Tab>
                    {canReviewQuests && <Tab>{t("pending-quests")}</Tab>}
                    <Tab>{t("completed-quests")}</Tab>
                  </TabList>

                  <NextLink
                    href={`/projects/${projectId}/pathways/${id}/add-quest`}
                    passHref
                  >
                    <Flex pt="4" w="full" justify={["center", "center", "end"]}>
                      <Button variant="outline" leftIcon={<AddIcon />}>
                        {t("add-quest")}
                      </Button>
                    </Flex>
                  </NextLink>
                </Flex>

                <TabPanels>
                  <TabPanel>
                    <SimpleGrid columns={[1, 2]} spacing={10}>
                      {renderQuests(
                        allQuests.filter((quest: any) => !quest.isPending)
                      )}
                    </SimpleGrid>
                  </TabPanel>
                  {canReviewQuests && (
                    <TabPanel>
                      <SimpleGrid columns={[1, 2]} spacing={10}>
                        {renderQuests(
                          allQuests.filter((quest: any) => quest.isPending)
                        )}
                      </SimpleGrid>
                    </TabPanel>
                  )}
                  <TabPanel>
                    <SimpleGrid columns={[1, 2]} spacing={10} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>

            {/* Guide */}
            <TabPanel px="0">
              <VStack w="full" align="flex-start">
                <ReactMarkdown
                  components={ChakraUIRenderer(pathwayMarkdownTheme)}
                  skipHtml
                >
                  {description}
                </ReactMarkdown>
              </VStack>
            </TabPanel>

            {/* Details */}
            <TabPanel px="0">
              <Flex
                w="full"
                align="left"
                direction={["column", "column", "row"]}
                justify="space-between"
              >
                <VStack align="left">
                  <HStack>
                    <Icon as={BsBarChartFill} />
                    <Text
                      fontWeight="bold"
                      fontSize="xl"
                      color="text"
                      textTransform="uppercase"
                    >
                      Difficulty
                    </Text>
                    <Spacer />
                    <Flex align="end" direction="column">
                      <Tag>{difficulty}</Tag>
                    </Flex>
                  </HStack>
                  <Tooltip
                    label={`${pathwayProgress?.ratio}% - ${pathwayProgress?.completedQuestCount}/${pathwayProgress?.totalQuestCount} quests completed`}
                    hasArrow
                    fontWeight="extrabold"
                    placement="right"
                  >
                    <VStack w="full" align="left">
                      <HStack>
                        <Icon as={GoTasklist} />
                        <Text
                          fontWeight="bold"
                          fontSize="xl"
                          color="text"
                          textTransform="uppercase"
                        >
                          Progress
                        </Text>
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
                    </VStack>
                  </Tooltip>
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
                    <HStack>
                      <Tag p="2" variant="solid">
                        {claimedBy?.length || 0}/{rewardUserCap} Claimed
                      </Tag>
                    </HStack>
                  </HStack>
                  <HStack w="full">
                    <Icon as={GiTwoCoins} />
                    <Text
                      fontWeight="bold"
                      fontSize="xl"
                      color="text"
                      textTransform="uppercase"
                    >
                      Rewards
                    </Text>
                    <Tag variant="outline" size="lg">
                      {rewardAmount} {getRewardCurrency(rewardCurrency)}
                    </Tag>
                  </HStack>
                </VStack>
                <Flex align="center" maxW="full" py="4">
                  {createdBy && (
                    <Blockies
                      seed={createdBy}
                      className="blockies"
                      size={7}
                      scale={10}
                    />
                  )}
                  <VStack align="flex-start" mx="2">
                    <Text color="text-weak" textStyle="small" isTruncated>
                      {t("creation-date")}{" "}
                      {new Date(createdAt).toLocaleString()}
                    </Text>
                    <Text fontSize="sm" isTruncated>
                      {t("by")} {getShortenedAddress(createdBy)}
                    </Text>
                    {isOwner && (
                      // TODO: edit pathway form
                      <NextLink
                        href={`/projects/${projectId}/pathways/${id}/edit-pathway`}
                        passHref
                      >
                        <Button leftIcon={<EditIcon />}>
                          {t("edit-pathway")}
                        </Button>
                      </NextLink>
                    )}
                  </VStack>
                </Flex>
              </Flex>
              {allQuests && (
                <Text pt="8" fontSize="xs">
                  {allQuests.length} Quest{allQuests.length > 1 ? "s" : ""}
                </Text>
              )}
              <SimpleGrid columns={[1, 2]} spacing={10}>
                <CardMedia
                  h="xs"
                  src={`https://ipfs.io/ipfs/${image}`}
                  imageHeight="120px"
                >
                  <VStack w="full" align="start">
                    <Text color="accent">Rewards</Text>
                    <HStack pb="2">
                      <Avatar
                        boxSize="3rem"
                        src={`https://ipfs.io/ipfs/${image}`}
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
                      <Text>+</Text>
                      <Tag variant="outline" size="lg">
                        {rewardAmount} {getRewardCurrency(rewardCurrency)}
                      </Tag>
                    </HStack>

                    <Button
                      w="full"
                      fontSize="md"
                      disabled={isClaiming || isClaimed}
                      colorScheme={isClaimed ? "accent" : "primary"}
                      loadingText={rewardStatus}
                      isLoading={isClaiming}
                      variant="outline"
                      leftIcon={
                        isClaimed ? <BsCheckCircleFill /> : <RiHandCoinFill />
                      }
                      onClick={handleClaimPathwayRewards}
                    >
                      {rewardStatus}
                    </Button>
                  </VStack>
                </CardMedia>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}

export default PathwayPage;
