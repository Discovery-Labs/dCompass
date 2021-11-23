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
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";

import { initializeApollo } from "../../../lib/apolloClient";
import Container from "../../components/layout/Container";
import QuestCard from "../../components/QuestCard";
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

function ProjectPage({ id, name, createdBy, description, squads, logo }: any) {
  return (
    <Container>
      <Flex w="full">
        <Heading>{name}</Heading>
        <Spacer />
        <NextLink
          href={`/projects/edit-project/${id.split("://")[1]}`}
          passHref
        >
          <Button rightIcon={<EditIcon />}>Edit Project</Button>
        </NextLink>
      </Flex>

      <Flex w="full" direction="column" pt="4">
        <Text fontSize="sm">by {createdBy}</Text>
        <Text pt="8">{description}</Text>
        <Text pt="8" fontSize="xs">
          {squads.length} Squad{squads.length > 1 ? "s" : ""}
        </Text>
        <Text fontSize="xs">Created on </Text>
        <Flex pt="12" w="full" justify="space-around">
          <IconWithState icon="discord" active />
          <IconWithState icon="gitbook" />
          <IconWithState icon="github" />
          <IconWithState icon="twitter" />
        </Flex>
      </Flex>

      <Tabs py="2rem" w="full">
        <TabList>
          <Tab>All quests</Tab>
          <Tab>Completed quests</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {allQuests.map((quest) => (
                <QuestCard key={quest.name} quest={quest} />
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
