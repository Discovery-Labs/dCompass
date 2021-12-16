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
import { useContext } from "react";

import { Web3Context } from "../../../contexts/Web3Provider";
import Card from "components/custom/Card";

type Badge = {
  id: string;
  image: string;
  title: string;
  description: string;
  projectId: string;
  difficulty: string;
  isPending: boolean;
  createdBy: string;
};

function BadgeCard({ badge }: { badge: Badge }) {
  const { account } = useContext(Web3Context);
  const router = useRouter();
  const isOwner = badge.createdBy === account;
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
        {badge.isPending && isOwner && (
          <Button fontSize="md" onClick={() => console.log("Approve Badge")}>
            Approve
          </Button>
        )}
        {!badge.isPending && (
          <Button fontSize="md" onClick={() => console.log("Approve Badge")}>
            Approve
          </Button>
        )}
      </Flex>
    </Card>
  );
}

export default BadgeCard;