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
import NextLink from "next/link";

import Container from "../../components/layout/Container";
import QuestCard from "../../components/QuestCard";
import IconWithState from "components/custom/IconWithState";

const ProjectData = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA/",
  avatar: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  owner: "huxwell.eth",
  name: "Project Alpha",
  description:
    "This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.",
  website: "https://www.google.com",
  whitepaper: "https://www.twitter.com",
  social: {
    github: "https://github.com",
  },
  signals: 24,
  created: "2021-09-13",
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

function ProjectPage() {
  const project = ProjectData;

  return (
    <Container>
      <Flex w="full">
        <Heading>{project.name}</Heading>
        <Spacer />
        <NextLink href="/create-project" passHref>
          <Button rightIcon={<EditIcon />}>Edit Project</Button>
        </NextLink>
      </Flex>

      <Flex direction="column" pt="4">
        <Text fontSize="sm">by {project.owner}</Text>
        <Text pt="8">{project.description}</Text>
        <Text pt="8" fontSize="xs">
          {project.signals} Signals
        </Text>
        <Text fontSize="xs">Created on {project.created}</Text>
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
                <QuestCard quest={quest} />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              <QuestCard quest={QuestData} />
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default ProjectPage;
