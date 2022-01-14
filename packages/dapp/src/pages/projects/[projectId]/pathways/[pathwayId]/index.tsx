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
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";

import { initializeApollo } from "../../../../../../lib/apolloClient";
import QuestCard from "../../../../../components/projects/quests/QuestCard";
import useCustomColor from "../../../../../core/hooks/useCustomColor";
import { PROJECT_BY_ID_QUERY } from "../../../../../graphql/projects";
import Container from "components/layout/Container";
import { Web3Context } from "contexts/Web3Provider";
import { GET_PATHWAY_BY_ID_QUERY } from "graphql/pathways";
import { GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY } from "graphql/quests";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  createdBy,
  createdAt,
  projectId,
}: any) {
  const { t } = useTranslation("common");
  const { account } = useContext(Web3Context);
  const { getColoredText } = useCustomColor();

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

  console.log({ projectRes });
  return (
    <Container>
      <Flex w="full">
        <HStack>
          <Image
            rounded="md"
            src={`https://ipfs.io/ipfs/${image}`}
            objectFit="cover"
            w={150}
            h={150}
          />
          <Heading as="h1" size="4xl" pl="4">
            {title}
          </Heading>
        </HStack>
        <Spacer />
        {isOwner && (
          // TODO: edit pathway form
          <NextLink
            href={`/projects/${id.split("://")[1]}/edit-project/`}
            passHref
          >
            <Button leftIcon={<EditIcon />}>{t("all-projects")}</Button>
          </NextLink>
        )}
      </Flex>

      <Flex w="full" direction="column" pt="4">
        <Flex align="center" maxW="full">
          {createdBy && <Blockies seed={createdBy} className="blockies" />}
          <VStack align="flex-start" ml="2">
            <Text color={getColoredText} textStyle="small" isTruncated>
              {t("creation-date")} {new Date(createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm" isTruncated>
              {t("by")} {createdBy}
            </Text>
          </VStack>
        </Flex>

        <Text pt="8">{description}</Text>
        {quests && (
          <Text pt="8" fontSize="xs">
            {quests.length} Quest{quests.length > 1 ? "s" : ""}
          </Text>
        )}
      </Flex>

      <Tabs py="2rem" w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>{t("all-quests")}</Tab>
            <Tab>{t("pending-quests")}</Tab>
            <Tab>{t("completed-quests")}</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/${projectId.split("://")[1]}/pathways/${
                id.split("://")[1]
              }/add-quest`}
              passHref
            >
              <Button leftIcon={<PlusSquareIcon />}>Add Quest</Button>
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
