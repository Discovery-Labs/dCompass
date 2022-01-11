import { useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Tag,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";

import { Web3Context } from "../contexts/Web3Provider";
import { APPROVE_QUEST_MUTATION } from "../graphql/quests";
import Card from "components/custom/Card";

type Quest = {
  id: string;
  image: string;
  completed: string;
  projectId: string;
  pathwayId: string;
  owner: string;
  name: string;
  questType: string;
  description: string;
  isPending: string;
  website: string;
  network: string;
  reward: string;
};

function QuestCard({
  quest,
  projectContributors,
}: {
  quest: Quest;
  projectContributors: string[];
}) {
  const router = useRouter();
  const { account, provider } = useContext(Web3Context);
  const [approveQuestMutation] = useMutation(APPROVE_QUEST_MUTATION, {
    refetchQueries: "all",
  });
  const isContributor =
    projectContributors && account && projectContributors.includes(account);

  function openQuest() {
    console.log("Open Quest");
    // router.push("/quest/example");
  }

  const handleApproveQuest = async () => {
    const signatureInput = {
      id: quest.id,
      pathwayId: quest.pathwayId,
    };
    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify(signatureInput),
      account,
    ]);
    return approveQuestMutation({
      variables: {
        input: {
          id: quest.id,
          questApproverSignature: signature.result,
        },
      },
    });
  };

  return (
    <Card layerStyle="no-border-hover">
      <Flex w="full">
        <Avatar
          mr="0.5rem"
          border="solid 5px gold"
          boxSize="10rem"
          src={`https://ipfs.io/ipfs/${quest.image}`}
        />

        <Spacer />
        <Flex align="end" direction="column">
          <Tag variant="subtle">{quest.completed || "COMPLETED"}</Tag>
          <Tag my="2">
            <Text fontSize="sm">{quest.reward || "200xp"}</Text>
          </Tag>
        </Flex>
      </Flex>
      <HStack>
        <Tag my="2" variant="outline">
          {quest.questType}
        </Tag>
      </HStack>
      <Heading fontSize="2xl">{quest.name}</Heading>
      <Text noOfLines={4}>{quest.description}</Text>
      <Spacer />
      <Flex w="full" justify="space-between">
        {quest.isPending && isContributor && (
          <>
            <Button
              variant="outline"
              fontSize="md"
              onClick={() => console.log("Details")}
            >
              Details
            </Button>
            <Button fontSize="md" onClick={handleApproveQuest}>
              Approve
            </Button>
          </>
        )}
        {!quest.isPending && (
          <>
            <Button
              variant="outline"
              fontSize="md"
              onClick={() => console.log("Start Quest")}
            >
              Start Quest
            </Button>
            <Button fontSize="md" onClick={() => console.log("Claim Reward")}>
              Claim
            </Button>
          </>
        )}
      </Flex>
    </Card>
  );
}

export default QuestCard;
