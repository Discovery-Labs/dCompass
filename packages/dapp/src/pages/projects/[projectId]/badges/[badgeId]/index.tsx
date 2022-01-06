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

import { initializeApollo } from "../../../../../../lib/apolloClient";
import { PROJECT_BY_ID_QUERY } from "../../../../../graphql/projects";
import IconWithState from "components/custom/IconWithState";
import Container from "components/layout/Container";
import BadgeCard from "components/projects/badges/BadgeCard";
import QuestCard from "components/QuestCard";
import { Web3Context } from "contexts/Web3Provider";
import { GET_BADGE_BY_ID_QUERY } from "graphql/badges";
import { GET_ALL_QUESTS_BY_BADGE_ID_QUERY } from "graphql/quests";

type Props = {
  projectId: string | null;
  badgeId: string | null;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string; badgeId: string }
> = async (ctx) => {
  const badgeId = ctx.params?.badgeId ?? null;
  const projectId = ctx.params?.projectId ?? null;
  if (!badgeId || !projectId) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_BADGE_BY_ID_QUERY,
      variables: {
        badgeId: `ceramic://${badgeId}`,
      },
    });
    console.log({ data });
    return {
      props: { id: badgeId, ...data.getBadgeById },
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

function BadgePage({
  id,
  title,
  description,
  image,
  quests = [],
  createdBy,
  createdAt,
  projectId,
}: any) {
  const { account } = useContext(Web3Context);
  const { data, loading, error } = useQuery(GET_ALL_QUESTS_BY_BADGE_ID_QUERY, {
    variables: {
      badgeId: id,
    },
  });
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
            rounded="full"
            border="solid 5px gold"
            src={`https://ipfs.io/ipfs/${image}`}
            w={100}
            h={100}
          />
          <Heading>{title}</Heading>
        </HStack>
        <Spacer />
        {isOwner && (
          <NextLink
            href={`/projects/edit-project/${id.split("://")[1]}`}
            passHref
          >
            <Button leftIcon={<EditIcon />}>Edit Badge</Button>
          </NextLink>
        )}
      </Flex>

      <Flex w="full" direction="column" pt="4">
        <Text fontSize="sm">by {createdBy}</Text>
        <Text fontSize="xs">
          Creation date: {new Date(createdAt).toLocaleString()}
        </Text>
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
            <Tab>All quests</Tab>
            <Tab>Pending quests</Tab>
            <Tab>Completed quests</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/${projectId.split("://")[1]}/badges/${id.split("://")[1]
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
              {data.getAllQuestsByBadgeId
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
              {data.getAllBadgesByProjectId
                .filter((badge: any) => badge.isPending)
                .map((badge: any) => (
                  <BadgeCard key={badge.title} badge={badge} />
                ))}
            </SimpleGrid> */}
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllQuestsByBadgeId
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
              {data.getAllBadgesByProjectId
                .filter((badge: any) => !badge.isPending)
                .map((badge: any) => (
                  <BadgeCard key={badge.title} badge={badge} />
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

export default BadgePage;
