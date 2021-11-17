import { AddIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import NextLink from "next/link";

import Container from "../../components/layout/Container";
import QuestCard from "../../components/QuestCard";

const QuestData = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  completed: "completed",
  project: "alpha",
  owner: "huxwell.eth",
  name: "Quest Alpha",
  description:
    "This is an awesome quest.This is an awesome quest.This is an awesome quest.This is an awesome quest.This is an awesome quest.",
  website: "https://www.google.com",
  network: "ethereum",
  reward: "200 xp",
};

const allQuests = [QuestData, QuestData, QuestData];

function quests() {
  return (
    <Container>
      <Flex w="full">
        <Heading>Quests</Heading>
        <Spacer />
        <NextLink href="/create-project" passHref>
          <Button rightIcon={<AddIcon />}>Create Quest</Button>
        </NextLink>
      </Flex>

      <Tabs py="2rem" w="full">
        <TabList>
          <Tab>All quests</Tab>
          <Tab>My quests</Tab>
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

export default quests;
