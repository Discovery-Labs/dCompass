import { useQuery } from "@apollo/client";
import { EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  HStack,
  VStack,
  Image,
  useBreakpointValue,
  Avatar,
  Icon,
  Stack,
  Tag,
  Tooltip,
  Progress,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";
import { BsBarChartFill } from "react-icons/bs";
import { GiTwoCoins } from "react-icons/gi";
import { GoTasklist } from "react-icons/go";

import { initializeApollo } from "../../../../../../lib/apolloClient";
import CardMedia from "../../../../../components/custom/CardMedia";
import BreadcrumbItems from "../../../../../components/layout/BreadcrumbItems";
import QuestCard from "../../../../../components/projects/quests/QuestCard";
import { streamIdToUrl, streamUrlToId } from "../../../../../core/helpers";
import useCustomColor from "../../../../../core/hooks/useCustomColor";
import useTokenList from "../../../../../core/hooks/useTokenList";
import { PROJECT_BY_ID_QUERY } from "../../../../../graphql/projects";
import Container from "components/layout/Container";
import { Web3Context } from "contexts/Web3Provider";
import { GET_PATHWAY_BY_ID_QUERY } from "graphql/pathways";
import { GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY } from "graphql/quests";

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
        pathwayId: `ceramic://${pathwayId}`,
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
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

const QuestData = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  completed: "completed",
  project: "alpha",
  owner: "huxwell.eth",
  name: "Project Alpha",
  description:
    "This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.",
  website: "https://www.google.com",
  network: "ethereum",
  reward: "200 xp",
};

const allQuests = [QuestData, QuestData, QuestData];

function PathwayPage({
  id,
  title,
  description,
  image,
  quests = [],
  difficulty,
  createdBy,
  createdAt,
  rewardAmount,
  rewardCurrency,
  projectId,
}: any) {
  const { t } = useTranslation("common");
  const { getRewardCurrency } = useTokenList();

  const { account } = useContext(Web3Context);
  const { getTextColor, getColoredText, getBgColor, getAccentColor } =
    useCustomColor();

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
  if (loading || projectLoading) return "Loading...";
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
            label: title,
            href: `/projects/${streamUrlToId(
              projectId
            )}/pathways/${streamUrlToId(id)}/`,
            isCurrentPage: true,
          },
        ]}
      />

      <VStack align="left" w="full">
        <Heading as="h1" size="3xl" color={getTextColor}>
          {title}
        </Heading>
        <Heading as="h2" size="xl" color={getColoredText} py="4">
          {description}
        </Heading>
      </VStack>

      <HStack w="full" align="left" justifyContent="space-between">
        <VStack align="left">
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
                  color={getTextColor}
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
                  bgColor={getBgColor}
                />
              </HStack>
            </VStack>
          </Tooltip>
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
            <Text color={getColoredText} textStyle="small" isTruncated>
              {t("creation-date")} {new Date(createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm" isTruncated>
              {t("by")} {createdBy}
            </Text>
            {isOwner && (
              // TODO: edit pathway form
              <NextLink
                href={`/projects/${streamUrlToId(
                  projectId
                )}/pathways/${streamUrlToId(id)}/edit-pathway`}
                passHref
              >
                <Button leftIcon={<EditIcon />}>{t("edit-pathway")}</Button>
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

      <HStack w="full" align="left">
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
                  {rewardAmount} {getRewardCurrency(rewardCurrency)}
                </Text>
              </Flex>
            </Stack>
          </VStack>
        </CardMedia>
      </HStack>

      <Tabs py="2rem" w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>{t("all-quests")}</Tab>
            <Tab>{t("pending-quests")}</Tab>
            <Tab>{t("completed-quests")}</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/${streamUrlToId(
                projectId
              )}/pathways/${streamUrlToId(id)}/add-quest`}
              passHref
            >
              <Button leftIcon={<PlusSquareIcon />}>{t("add-quest")}</Button>
            </NextLink>
          )}
        </HStack>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllQuestsByPathwayId
                .filter((quest: any) => !quest.isPending)
                .map((quest: any) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    projectContributors={
                      projectRes.getProjectById.squads.flatMap(
                        (squad: any) => squad.members
                      ) || []
                    }
                  />
                ))}
            </SimpleGrid>
            {/* <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllPathwaysByProjectId
                .filter((pathway: any) => pathway.isPending)
                .map((pathway: any) => (
                  <PathwayCard key={pathway.title} pathway={pathway} />
                ))}
            </SimpleGrid> */}
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllQuestsByPathwayId
                .filter((quest: any) => quest.isPending)
                .map((quest: any) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    projectContributors={
                      projectRes.getProjectById.squads.flatMap(
                        (squad: any) => squad.members
                      ) || []
                    }
                  />
                ))}
            </SimpleGrid>
            {/* <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllPathwaysByProjectId
                .filter((pathway: any) => !pathway.isPending)
                .map((pathway: any) => (
                  <PathwayCard key={pathway.title} pathway={pathway} />
                ))}
            </SimpleGrid> */}
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              <QuestCard key={QuestData.name} quest={QuestData} />
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default PathwayPage;
