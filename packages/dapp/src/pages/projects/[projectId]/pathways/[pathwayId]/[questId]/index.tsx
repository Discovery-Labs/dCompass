/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import { useQuery } from "@apollo/client";
import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  HStack,
  VStack,
  Avatar,
  Icon,
  Stack,
  Tag,
  Progress,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";
import { BsPeople } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { RiSwordLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

import CardMedia from "../../../../../../components/custom/CardMedia";
import BreadcrumbItems from "../../../../../../components/layout/BreadcrumbItems";
import GithubContributorQuestForm from "../../../../../../components/projects/quests/github/GithubContributorQuestForm";
import QuizForm from "../../../../../../components/projects/quests/quizz/QuizForm";
import SnapshotVoterForm from "../../../../../../components/projects/quests/snapshot/SnapshotVoterForm";
import ClaimNFTOwnerForm from "../../../../../../components/projects/quests/token/ClaimNFTOwnerForm";
import ClaimTokenHolderForm from "../../../../../../components/projects/quests/token/ClaimTokenHolderForm";
import { ceramicCoreFactory } from "../../../../../../core/ceramic";
import { streamIdToUrl, streamUrlToId } from "../../../../../../core/helpers";
import useCustomColor from "../../../../../../core/hooks/useCustomColor";
import { usePageMarkdownTheme } from "../../../../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../../../../core/hooks/useTokenList";
import { PROJECT_BY_ID_QUERY } from "../../../../../../graphql/projects";
import Container from "components/layout/Container";
import { Web3Context } from "contexts/Web3Provider";
import { GET_PATHWAY_BY_ID_QUERY } from "graphql/pathways";

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
  if (!pathwayId || !projectId || !questId) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }

  const core = ceramicCoreFactory();
  // const client = initializeApollo();
  try {
    const questInfos = await core.ceramic.loadStream(questId);
    const questCreatorDID = questInfos.controllers[0];
    const questCreatorBasicProfile = await core.get(
      "basicProfile",
      questCreatorDID
    );
    return {
      props: {
        id: questId,
        ...questInfos.content,
        ...(await serverSideTranslations(locale, ["common"])),
        projectId,
        createdBy: {
          did: questCreatorDID,
          name: questCreatorBasicProfile?.name,
        },
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

function QuestPage({
  id,
  name,
  description,
  image,
  createdAt,
  rewardAmount,
  rewardCurrency,
  rewardUserCap,
  type,
  pathwayId,
  projectId,
  questions,
  proposalId,
  githubOrgId,
  createdBy,
  collectionContractAddress,
  tokenContractAddress,
  amount,
  chainId: tokenChainId,
  namespace,
}: any) {
  const { t } = useTranslation("common");
  const { getRewardCurrency } = useTokenList();
  const questMarkdownTheme = usePageMarkdownTheme();

  const { account } = useContext(Web3Context);
  const { getTextColor, getColoredText } = useCustomColor();

  const { data, loading, error } = useQuery(GET_PATHWAY_BY_ID_QUERY, {
    variables: {
      pathwayId,
    },
  });
  const {
    data: projectRes,
    loading: projectLoading,
    error: projectError,
  } = useQuery(PROJECT_BY_ID_QUERY, {
    variables: {
      projectId: streamIdToUrl(projectId),
    },
  });

  const isOwner = createdBy === account;
  if (loading || projectLoading)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">
          {t("quest")} {t("loading")}
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
            href: `/projects/${streamUrlToId(projectId)}`,
          },
          {
            label: "Pathways",
            href: `/projects/${streamUrlToId(projectId)}`,
          },
          {
            label: data.getPathwayById.title,
            href: `/projects/${streamUrlToId(
              projectId
            )}/pathways/${streamUrlToId(pathwayId)}/`,
          },
          {
            label: name,
            href: `/projects/${streamUrlToId(
              projectId
            )}/pathways/${streamUrlToId(pathwayId)}/${streamUrlToId(id)}`,
            isCurrentPage: true,
          },
        ]}
      />

      <VStack align="left" w="full">
        <Heading as="h1" size="2xl" color={getColoredText} py="4">
          {name} <Icon as={RiSwordLine} color={getColoredText} />
        </Heading>
        <Tabs w="full">
          <HStack justifyContent="space-between">
            <TabList>
              <Tab>Guide</Tab>
              <Tab>Details &amp; rewards</Tab>
              <Tab>Play quest</Tab>
            </TabList>
          </HStack>

          <TabPanels>
            <TabPanel px="0">
              <VStack w="full" align="flex-start">
                <ReactMarkdown
                  components={ChakraUIRenderer(questMarkdownTheme)}
                  skipHtml
                >
                  {description}
                </ReactMarkdown>
              </VStack>
            </TabPanel>

            <TabPanel px="0">
              <HStack w="full" align="left" justifyContent="space-between">
                <VStack align="left">
                  <HStack>
                    <Icon as={RiSwordLine} />
                    <Text
                      fontWeight="bold"
                      fontSize="xl"
                      color={getTextColor}
                      textTransform="uppercase"
                    >
                      Quest type
                    </Text>
                    <Tag variant="outline" size="lg">
                      {type.label}
                    </Tag>
                  </HStack>
                  <HStack>
                    <HStack>
                      <Icon as={BsPeople} />
                      <Text
                        fontWeight="bold"
                        fontSize="xl"
                        color={getTextColor}
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
                      color={getTextColor}
                      textTransform="uppercase"
                    >
                      Rewards
                    </Text>
                    <Tag variant="outline" size="lg">
                      {rewardAmount}
                    </Tag>
                  </HStack>
                </VStack>
                <Flex align="center" maxW="full" py="4">
                  {createdBy && (
                    <Blockies
                      seed={createdBy.name || createdBy.did}
                      className="blockies"
                      size={7}
                      scale={10}
                    />
                  )}
                  <VStack align="flex-start" mx="2">
                    <Text color={getColoredText} textStyle="small" isTruncated>
                      {t("creation-date")}{" "}
                      {new Date(createdAt || Date.now()).toLocaleString()}
                    </Text>
                    <Text fontSize="sm" isTruncated>
                      {t("by")} {createdBy.name || createdBy.did}
                    </Text>
                    {isOwner && (
                      // TODO: edit quest form
                      <NextLink
                        href={`/projects/${streamUrlToId(
                          projectId
                        )}/pathways/${streamUrlToId(pathwayId)}/${streamUrlToId(
                          id
                        )}/edit-quest`}
                        passHref
                      >
                        <Button leftIcon={<EditIcon />}>
                          {t("edit-quest")}
                        </Button>
                      </NextLink>
                    )}
                  </VStack>
                </Flex>
              </HStack>

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
                        color={getTextColor}
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
            <TabPanel px="0">
              {/* TODO: Make a wrapper component */}
              {type?.value === "quiz" && (
                <QuizForm questions={questions} questId={id} />
              )}
              {type?.value === "snapshot-voter" && (
                <SnapshotVoterForm proposalId={proposalId} questId={id} />
              )}
              {type?.value === "github-contributor" && (
                <GithubContributorQuestForm
                  githubOrgId={githubOrgId}
                  questId={id}
                />
              )}
              {type?.value === "nft-owner" && (
                <ClaimNFTOwnerForm
                  questId={id}
                  contractAddress={collectionContractAddress}
                  namespace={namespace || "eip155"}
                  collectionChainId={tokenChainId}
                />
              )}
              {type?.value === "token-holder" && (
                <ClaimTokenHolderForm
                  questId={id}
                  amount={amount}
                  contractAddress={tokenContractAddress}
                  namespace={namespace || "eip155"}
                  tokenChainId={tokenChainId}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}

export default QuestPage;
