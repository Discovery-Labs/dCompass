import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
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
  Input,
  HStack,
  IconButton,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import Container from "../../components/layout/Container";
import QuestCard from "../../components/QuestCard";

export type TagItem = {
  name: string;
};

interface IQuestData {
  logo: string;
  completed: string;
  project: string;
  owner: string;
  name: string;
  tags: Array<TagItem>;
  description: string;
  website: string;
  network: string;
  reward: string;
}

const QuestData = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  completed: "completed",
  project: "alpha",
  owner: "huxwell.eth",
  name: "Quest Alpha",
  tags: [{ name: "polygon" }],
  description:
    "This is an awesome quest.This is an awesome quest.This is an awesome quest.This is an awesome quest.This is an awesome quest.",
  website: "https://www.google.com",
  network: "ethereum",
  reward: "200 xp",
};

const QuestData2 = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  completed: "completed",
  project: "beta",
  owner: "huxwell.eth",
  name: "Quest Beta",
  tags: [{ name: "ethereum" }],
  description:
    "This is an awesome quest.This is an awesome quest.This is an awesome quest.This is an awesome quest.This is an awesome quest.",
  website: "https://www.google.com",
  network: "ethereum",
  reward: "200 xp",
};

const allQuests = [QuestData, QuestData2, QuestData];

const allTags = [{ name: "ethereum" }, { name: "polygon" }];

function Quests() {
  const [filteredQuests, setFilteredQuests] = useState<Array<IQuestData>>([]);
  const [fiterTags] = useState(() =>
    allTags && allTags.length > 0 ? allTags.map((tag) => tag.name) : []
  );

  function filterWithTags(e: Array<string>) {
    const newFilteredQuests = allQuests.filter((quest: IQuestData) => {
      return quest.tags && quest.tags.some((tag) => e.includes(tag.name));
    });
    setFilteredQuests(newFilteredQuests);
  }

  const QuestsCard = () => {
    return (
      <>
        {filteredQuests.length !== 0
          ? filteredQuests.map((quest) => (
              <QuestCard key={quest.name} quest={quest} />
            ))
          : allQuests.map((quest) => (
              <QuestCard key={quest.name} quest={quest} />
            ))}
      </>
    );
  };

  return (
    <Container>
      <Flex w="full">
        <Heading>Quests</Heading>
        <Spacer />
        <NextLink href="/create-quest" passHref>
          <Button rightIcon={<AddIcon />}>Create Quest</Button>
        </NextLink>
      </Flex>

      <HStack py="1rem" w="full">
        <Input placeholder="Search..." />
        <IconButton
          variant="unstyled"
          aria-label="Filter"
          icon={<HamburgerIcon />}
        />
      </HStack>

      {allTags && allTags.length > 0 && (
        <CheckboxGroup
          onChange={(e: Array<string>) => filterWithTags(e)}
          defaultValue={fiterTags}
        >
          {allTags.map((tag) => (
            <Checkbox key={tag.name} value={tag.name}>
              {tag.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}

      <Tabs py="2rem" w="full">
        <TabList>
          <Tab>All quests</Tab>
          <Tab>My quests</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {allQuests ? <QuestsCard /> : "No project found"}
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

export default Quests;
