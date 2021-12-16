import { useQuery } from "@apollo/client";
import { EditIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useContext } from "react";

import { initializeApollo } from "../../../lib/apolloClient";
import Container from "../../components/layout/Container";
import BadgeCard from "../../components/projects/badges/BadgeCard";
import QuestCard from "../../components/QuestCard";
import { Web3Context } from "../../contexts/Web3Provider";
import { GET_ALL_BADGES_BY_PROJECT_ID_QUERY } from "../../graphql/badges";
import { PROJECT_BY_ID_QUERY } from "../../graphql/projects";
import IconWithState from "components/custom/IconWithState";

type Props = {
  projectId: string | null;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string }
> = async (ctx) => {
  const id = ctx.params?.projectId ?? null;
  if (id === null) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: PROJECT_BY_ID_QUERY,
      variables: {
        projectId: `ceramic://${id}`,
      },
    });
    return {
      props: { id, ...data.getProjectById },
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

function ProjectPage({
  id,
  name,
  createdBy,
  description,
  squads,
  logo,
  createdAt,
}: any) {
  const { account } = useContext(Web3Context);
  const { data, loading, error } = useQuery(
    GET_ALL_BADGES_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: id,
      },
    }
  );
  const isOwner = createdBy === account;
  if (loading) return "Loading...";
  if (error) return `Loading error! ${error.message}`;
  return (
    <Container>
      <Flex w="full">
        <Heading>{name}</Heading>
        <Spacer />
        {isOwner && (
          <NextLink
            href={`/projects/edit-project/${id.split("://")[1]}`}
            passHref
          >
            <Button rightIcon={<EditIcon />}>Edit Project</Button>
          </NextLink>
        )}
      </Flex>

      <Flex w="full" direction="column" pt="4">
        <Text fontSize="sm">by {createdBy}</Text>
        <Text pt="8">{description}</Text>
        <Text pt="8" fontSize="xs">
          {squads.length} Squad{squads.length > 1 ? "s" : ""}
        </Text>
        <Text>Creation date: {new Date(createdAt).toLocaleString()}</Text>
        <Flex pt="12" w="full" justify="space-around">
          <IconWithState icon="discord" active />
          <IconWithState icon="gitbook" />
          <IconWithState icon="github" />
          <IconWithState icon="twitter" />
        </Flex>
      </Flex>

      <Tabs py="2rem" w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>Pending badges</Tab>
            <Tab>Approved badges</Tab>
            <Tab>My badges</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/add-badge/${id.split("://")[1]}`}
              passHref
            >
              <Button rightIcon={<EditIcon />}>Add badge</Button>
            </NextLink>
          )}
        </HStack>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllBadgesByProjectId
                .filter((badge: any) => badge.isPending)
                .map((badge: any) => (
                  <BadgeCard key={badge.title} badge={badge} />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllBadgesByProjectId
                .filter((badge: any) => !badge.isPending)
                .map((badge: any) => (
                  <BadgeCard key={badge.title} badge={badge} />
                ))}
            </SimpleGrid>
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

export default ProjectPage;
