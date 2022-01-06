import { useMutation } from "@apollo/client";
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
import { APPROVE_BADGE_MUTATION } from "../../../graphql/badges";
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

function BadgeCard({
  badge,
  projectContributors,
}: {
  badge: Badge;
  projectContributors: string[];
}) {
  const [approveBadgeMutation] = useMutation(APPROVE_BADGE_MUTATION, {
    refetchQueries: "all",
  });

  const { account, provider } = useContext(Web3Context);
  const router = useRouter();
  const isContributor = account && projectContributors.includes(account);
  function openBadge() {
    return router.push(
      `/projects/${badge.projectId.split("://")[1]}/badges/${badge.id.split("://")[1]
      }`
    );
  }

  const handleApproveBadge = async () => {
    const signatureInput = {
      id: badge.id,
      projectId: badge.projectId,
    };
    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify(signatureInput),
      account,
    ]);
    return approveBadgeMutation({
      variables: {
        input: {
          id: badge.id,
          badgeApproverSignature: signature.result,
        },
      },
    });
  };

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
          Quests
        </Button>
        {badge.isPending && isContributor && (
          <Button fontSize="md" onClick={handleApproveBadge}>
            Approve
          </Button>
        )}
        {!badge.isPending && (
          <Button fontSize="md" onClick={() => console.log("Claim Badge")}>
            Claim
          </Button>
        )}
      </Flex>
    </Card>
  );
}

export default BadgeCard;
