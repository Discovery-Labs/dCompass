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
  Badge,
  Stack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";

import { initializeApollo } from "../../../../lib/apolloClient";
import { Tag } from "../../../core/types";
import { GET_ALL_BADGES_BY_PROJECT_ID_QUERY } from "../../../graphql/badges";
import { PROJECT_BY_ID_QUERY } from "../../../graphql/projects";
import IconWithState from "components/custom/IconWithState";
import Container from "components/layout/Container";
import BadgeCard from "components/projects/badges/BadgeCard";
import QuestCard from "components/QuestCard";
import { Web3Context } from "contexts/Web3Provider";

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
  tags,
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
            href={`/projects/${id.split("://")[1]}/edit-project/`}
            passHref
          >
            <Button leftIcon={<EditIcon />}>Edit Project</Button>
          </NextLink>
        )}
      </Flex>

      <Flex w="full" direction="column" pt="4">
        <Flex align="center" maxW="full">
          {createdBy && <Blockies seed={createdBy} className="blockies" />}
          <Text ml="2" fontSize="sm" isTruncated>
            {createdBy}
          </Text>
        </Flex>
        <Stack direction="row" pt="4">
          {tags.map((tag: Tag) => (
            <Badge key={tag.id} colorScheme={tag.color}>
              {tag.label}
            </Badge>
          ))}
        </Stack>
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
            <Tab>All badges</Tab>
            <Tab>Pending badges</Tab>
            <Tab>My badges</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/${id.split("://")[1]}/badges/add-badge/`}
              passHref
            >
              <Button leftIcon={<EditIcon />}>Add badge</Button>
            </NextLink>
          )}
        </HStack>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllBadgesByProjectId
                .filter((badge: any) => !badge.isPending)
                .map((badge: any) => (
                  <BadgeCard
                    key={badge.title}
                    badge={badge}
                    projectContributors={squads.flatMap(
                      (squad: any) => squad.members
                    )}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllBadgesByProjectId
                .filter((badge: any) => badge.isPending)
                .map((badge: any) => (
                  <BadgeCard
                    key={badge.title}
                    badge={badge}
                    projectContributors={squads.flatMap(
                      (squad: any) => squad.members
                    )}
                  />
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
