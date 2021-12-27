import {
  Avatar,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Tag,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import Card from "components/custom/Card";

type Quest = {
  logo: string;
  completed: string;
  project: string;
  owner: string;
  name: string;
  description: string;
  website: string;
  network: string;
  reward: string;
};

function QuestCard({ quest }: { quest: Quest }) {
  const router = useRouter();

  function openQuest() {
    console.log("Open Quest");
    // router.push("/quest/example");
  }

  return (
    <Card layerStyle="no-border-hover">
      <Flex w="full">
        <Avatar mr="0.5rem" boxSize="4rem" src={quest.logo} />
        <Spacer />
        <Flex align="end" direction="column">
          <Tag>{quest.completed}</Tag>
          <Text textStyle="small">{quest.reward}</Text>
        </Flex>
      </Flex>
      <Text as="h2" textStyle="h2">
        {quest.name}
      </Text>
      <Text noOfLines={4}>{quest.description}</Text>
      <Spacer />
      <Flex w="full" justify="space-between">
        <Button variant="outline" fontSize="md" onClick={() => openQuest()}>
          Details
        </Button>
        <Button fontSize="md" onClick={() => console.log("Start Quest")}>
          Start Quest
        </Button>
      </Flex>
    </Card>
  );
}

export default QuestCard;
