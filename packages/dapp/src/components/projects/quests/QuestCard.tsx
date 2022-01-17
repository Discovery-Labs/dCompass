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
  Tooltip,
  Stack,
  Icon,
  VStack,
  Box,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { GiSwordwoman, GiTwoCoins } from "react-icons/gi";
import { RiHandCoinFill, RiSwordLine } from "react-icons/ri";

import { Web3Context } from "../../../contexts/Web3Provider";
import useCustomColor from "../../../core/hooks/useCustomColor";
import { APPROVE_QUEST_MUTATION } from "../../../graphql/quests";
import Card from "components/custom/Card";

import { LockIcon } from "@chakra-ui/icons";

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
  // unlocked: boolean;
};
const unlocked = false;

function QuestCard({
  quest,
  projectContributors,
}: {
  quest: Quest;
  projectContributors: string[];
}) {
  const router = useRouter();
  const { getTextColor, getColoredText, getBgColor, getAccentColor } =
    useCustomColor();
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

  const LockedScreen = () => {
    return (
      <Box
        zIndex="overlay"
        borderRadius="8"
        bgColor={getBgColor}
        position="absolute"
        top="0"
        right="0"
        left="0"
        bottom="0"
        opacity="0.6"
      >
        <Flex height="full" align="center" justify="center">
          <LockIcon w={32} h={32} color={getColoredText} />
        </Flex>
      </Box>
    );
  };

  return (
    <Card position="relative" h="lg" layerStyle="no-border-hover" spacing="6">
      {!unlocked && <LockedScreen />}

      <Flex w="full" minH="56px">
        <Heading
          noOfLines={2}
          as="h2"
          fontSize="2xl"
          color={getTextColor}
          textTransform="uppercase"
        >
          {quest.name}
        </Heading>

        <Spacer />
        <Flex align="end" direction="column">
          <Tag variant="subtle">{quest.completed || "COMPLETED"}</Tag>
          <Tag my="2">
            <Text fontSize="sm">{quest.reward || "200xp"}</Text>
          </Tag>
        </Flex>
      </Flex>
      <Tooltip label={quest.description} hasArrow placement="top">
        <Heading
          noOfLines={3}
          as="h4"
          size="md"
          color={getColoredText}
          minH="65px"
        >
          {quest.description}
        </Heading>
      </Tooltip>
      <VStack w="full" align="left">
        <HStack>
          <Icon as={RiSwordLine} />
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={getTextColor}
            textTransform="uppercase"
          >
            Quest type
          </Text>
        </HStack>
        <HStack>
          <Tag variant="outline" size="lg">
            Snapshot Voter
          </Tag>
        </HStack>
        <HStack>
          <Icon as={GiTwoCoins} />
          <Text
            fontWeight="bold"
            fontSize="xl"
            color={getTextColor}
            textTransform="uppercase"
          >
            Rewards
          </Text>
        </HStack>

        <Stack
          w="full"
          justifyContent="space-between"
          direction="row"
          spacing={4}
          align="center"
        >
          <Avatar
            boxSize="4.8rem"
            src={`https://ipfs.io/ipfs/${quest.image}`}
            position="relative"
          />
          <Text color="purple.500" fontSize="3xl" fontWeight="bold">
            NFT
          </Text>
          <Text fontFamily="heading" fontSize={{ base: "4xl", md: "6xl" }}>
            +
          </Text>
          <Flex
            align="center"
            justify="center"
            fontFamily="heading"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "lg" }}
            color="purple.500"
            rounded="full"
          >
            <Text fontSize="3xl" fontWeight="bold">
              0.1 ETH
            </Text>
          </Flex>
        </Stack>
      </VStack>

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
              leftIcon={<GiSwordwoman />}
              fontSize="md"
              onClick={() => console.log("Start Quest")}
            >
              Start
            </Button>
            <Button
              fontSize="md"
              onClick={() => console.log("Claim Reward")}
              variant="outline"
              leftIcon={<RiHandCoinFill />}
            >
              Claim
            </Button>
          </>
        )}
      </Flex>
    </Card>
  );
}

export default QuestCard;
