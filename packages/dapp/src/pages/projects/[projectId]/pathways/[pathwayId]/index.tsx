import { useQuery } from "@apollo/client";
import { EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
  VStack,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Container from "components/layout/Container";
import { Web3Context } from "contexts/Web3Provider";
import { GET_PATHWAY_BY_ID_QUERY } from "graphql/pathways";
import { GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY } from "graphql/quests";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";
import { BsBarChartFill, BsPeople } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { GoTasklist } from "react-icons/go";
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
  quests = [],
  difficulty,
  createdBy,
  createdAt,
  rewardAmount,
  rewardUserCap,
  rewardCurrency,
  projectId,
}: any) {
  const { t } = useTranslation("common");
  const { getRewardCurrency } = useTokenList();
  const pathwayMarkdownTheme = usePageMarkdownTheme();

  const { account, isReviewer } = useContext(Web3Context);
  const { getAccentColor } = useCustomColor();

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

  const isOwner = createdBy === account;

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
  const isProjectContributor = projectRes.getProjectById.squads
    .flatMap(({ members }: { members: string[] }) => members)
    .includes(account);
  const canEdit = isProjectContributor || isOwner;
  console.log({ canEdit, isOwner, isProjectContributor });
  const canReviewQuests = isProjectContributor || isOwner || isReviewer;
  const renderQuests = (questsToRender: Record<string, unknown>[]) => {
    return questsToRender.map((quest: any) => (
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
    ));
  };

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
              <Button disabled leftIcon={<PlusSquareIcon />}>
                {t("edit-pathway")}
              </Button>
            </NextLink>
          )}
        </HStack>
        <Tabs w="full">
          <HStack justifyContent="space-between">
            <TabList>
              <Tab>Quests</Tab>
              <Tab>Guide</Tab>
              <Tab>Details &amp; rewards</Tab>
            </TabList>
          </HStack>

          <TabPanels>
            {/* Quests */}
            <TabPanel px="0">
              <Tabs w="full" variant="unstyled">
                <HStack justifyContent="space-between">
                  <TabList>
                    <Tab>{t("all-quests")}</Tab>
                    {canReviewQuests && <Tab>{t("pending-quests")}</Tab>}
                    <Tab>{t("completed-quests")}</Tab>
                  </TabList>

                  <NextLink
                    href={`/projects/${projectId}/pathways/${id}/add-quest`}
                    passHref
                  >
                    <Button leftIcon={<PlusSquareIcon />}>
                      {t("add-quest")}
                    </Button>
                  </NextLink>
                </HStack>

                <TabPanels>
                  <TabPanel>
                    <SimpleGrid columns={[1, 2]} spacing={10}>
                      {renderQuests(
                        data.getAllQuestsByPathwayId.quests.filter(
                          (quest: any) => !quest.isPending
                        )
                      )}
                    </SimpleGrid>
                  </TabPanel>
                  {canReviewQuests && (
                    <TabPanel>
                      <SimpleGrid columns={[1, 2]} spacing={10}>
                        {renderQuests(
                          data.getAllQuestsByPathwayId.quests.filter(
                            (quest: any) => quest.isPending
                          )
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
              <HStack w="full" align="left" justifyContent="space-between">
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
                    label="50% - 4/8 quests completed"
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
                          value={50}
                          border={`solid 1px ${getAccentColor}`}
                          hasStripe
                          colorScheme="accentDark"
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
                    <Tag variant="outline" size="lg">
                      0/{rewardUserCap}
                    </Tag>
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
                      {t("by")} {createdBy}
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
              </HStack>
              {quests && (
                <Text pt="8" fontSize="xs">
                  {quests.length} Quest{quests.length > 1 ? "s" : ""}
                </Text>
              )}

              <HStack w="full" align="left" pt="2">
                <CardMedia
                  h="xs"
                  src={`https://ipfs.io/ipfs/${image}`}
                  imageHeight="160px"
                >
                  <VStack w="full" align="left">
                    <Stack
                      w="full"
                      justifyContent="space-between"
                      direction="row"
                      spacing={4}
                      align="center"
                    >
                      <Avatar
                        boxSize="4.5rem"
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
                      <Text color="purple.500" fontSize="3xl" fontWeight="bold">
                        NFT
                      </Text>
                      <Text
                        fontFamily="heading"
                        fontSize={{ base: "4xl", md: "6xl" }}
                      >
                        +
                      </Text>
                      <Flex
                        align="center"
                        justify="center"
                        fontFamily="heading"
                        fontWeight="bold"
                        fontSize={{ base: "sm", md: "lg" }}
                        bg="violet.100"
                        color="text"
                        rounded="full"
                        position="relative"
                        _before={{
                          content: '""',
                          width: "full",
                          height: "full",
                          rounded: "full",
                          transform: "scale(1.125)",
                          bgGradient: "linear(to-bl, purple.400,purple.500)",
                          position: "absolute",
                          zIndex: -1,
                          top: 0,
                          left: 0,
                        }}
                      >
                        <Text fontSize="3xl" fontWeight="bold">
                          {rewardAmount / rewardUserCap}{" "}
                          {getRewardCurrency(rewardCurrency)}
                        </Text>
                      </Flex>
                    </Stack>
                  </VStack>
                </CardMedia>
              </HStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}

export default PathwayPage;
