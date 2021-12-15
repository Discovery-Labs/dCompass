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

type Badge = {
  id: string;
  image: string;
  title: string;
  description: string;
  projectId: string;
  difficulty: string;
};

function BadgeCard({ badge }: { badge: Badge }) {
  const router = useRouter();

  function openBadge() {
    console.log("Open Badge");
    return router.push(`/badges/${badge.id}`);
  }

  return (
    <Card>
      <Flex w="full">
        <Avatar
          mr="0.5rem"
          boxSize="4rem"
          src={`https://ipfs.io/ipfs/${badge.image}`}
        />
        <Spacer />
        <Flex align="end" direction="column">
          <Tag>{badge.difficulty}</Tag>
        </Flex>
      </Flex>
      <Heading fontSize="2xl">{badge.title}</Heading>
      <Text noOfLines={4}>{badge.description}</Text>
      <Spacer />
      <Flex w="full" justify="space-between">
        <Button variant="outline" fontSize="md" onClick={() => openBadge()}>
          Details
        </Button>
        <Button fontSize="md" onClick={() => console.log("Start Badge")}>
          Claim Badge
        </Button>
      </Flex>
    </Card>
  );
}

export default BadgeCard;
