import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Text,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import Container from "../../components/layout/Container";
import QuestCard from "../../components/projects/quests/QuestCard";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

const fuseOptions = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 50,
  maxPatternLength: 12,
  minMatchCharLength: 1,
  keys: ["name", "description"],
};

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
  const { t } = useTranslation("common");
  const [filteredQuests, setFilteredQuests] = useState<Array<IQuestData>>([]);
  const [searchedQuests, setSearchedQuests] = useState<
    Array<Fuse.FuseResult<IQuestData>>
  >([]);
  const [fiterTags] = useState(() =>
    allTags && allTags.length > 0 ? allTags.map((tag) => tag.name) : []
  );
  const [query, setQuery] = useState<string>("");

  const fuse = new Fuse(allQuests, fuseOptions);

  function onSearchQuery(event: React.ChangeEvent<HTMLInputElement>) {
    const theTarget = event.target as HTMLInputElement;
    const { value = "" } = theTarget;
    setQuery(value);
  }

  function filterWithTags(e: Array<string>) {
    const newFilteredQuests = allQuests.filter((quest: IQuestData) => {
      return quest.tags && quest.tags.some((tag) => e.includes(tag.name));
    });
    setFilteredQuests(newFilteredQuests);
  }

  useEffect(() => {
    const data = fuse.search(query) as unknown as Array<
      Fuse.FuseResult<IQuestData>
    >;
    setSearchedQuests(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const SearchedQuestsCard = () => {
    return (
      <>
        {searchedQuests.map((quest) => (
          <QuestCard key={quest.item.name} quest={quest.item} />
        ))}
      </>
    );
  };

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
        <Text as="h1" textStyle="h1">
          {t("quests")}
        </Text>
        <Spacer />
        <NextLink href="/create-quest" passHref>
          <Button leftIcon={<AddIcon />}>{t("create-quest")}</Button>
        </NextLink>
      </Flex>

      <HStack py="1rem" w="full">
        <Input onChange={(e) => onSearchQuery(e)} placeholder="Search..." />
        <Menu closeOnSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            aria-label="Filter"
            variant="outline"
          />
          <CheckboxGroup
            onChange={(e: Array<string>) => filterWithTags(e)}
            defaultValue={fiterTags}
          >
            <MenuList>
              {allTags.map((tag) => (
                <MenuItem key={tag.name}>
                  <Checkbox value={tag.name}>{tag.name}</Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </CheckboxGroup>
        </Menu>
      </HStack>

      <Tabs w="full" variant="line">
        <TabList>
          <Tab>{t("all-quests")}</Tab>
          <Tab>{t("my-quests")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {allQuests && query.length !== 0 && <SearchedQuestsCard />}
              {allQuests && query.length === 0 && <QuestsCard />}
              {!allQuests ?? "No quest found"}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {allQuests && query.length !== 0 && <SearchedQuestsCard />}
              {allQuests && query.length === 0 && <QuestsCard />}
              {!allQuests ?? "No quest found"}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default Quests;
