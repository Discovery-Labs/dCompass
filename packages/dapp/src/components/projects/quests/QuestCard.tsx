import { useMutation } from "@apollo/client";
import { LockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Tag,
  HStack,
  Stack,
  Icon,
  VStack,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FiUserCheck } from "react-icons/fi";
import { GiSwordwoman, GiTwoCoins } from "react-icons/gi";
import { RiHandCoinFill, RiSwordLine } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

import { Web3Context } from "../../../contexts/Web3Provider";
import { streamUrlToId } from "../../../core/helpers";
import useCustomColor from "../../../core/hooks/useCustomColor";
import useTokenList from "../../../core/hooks/useTokenList";
import { APPROVE_QUEST_MUTATION } from "../../../graphql/quests";
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
  rewardAmount: string;
  rewardUserCap: number;
  rewardCurrency: string;
  // unlocked: boolean;
};
const unlocked = true;

function QuestCard({
  quest,
  projectContributors,
}: {
  quest: Quest;
  projectContributors: string[];
}) {
  const router = useRouter();
  const { getRewardCurrency } = useTokenList();

  const { getTextColor, getColoredText, getBgColor } = useCustomColor();
  const { library } = useWeb3React();
  const { account } = useContext(Web3Context);
  const [approveQuestMutation] = useMutation(APPROVE_QUEST_MUTATION, {
    refetchQueries: "all",
  });
  const isContributor =
    projectContributors && account && projectContributors.includes(account);

  const openQuest = (questId: string) => {
    return router.push(`${router.asPath}/${streamUrlToId(questId)}`);
  };

  const handleApproveQuest = async () => {
    const signatureInput = {
      id: quest.id,
      pathwayId: quest.pathwayId,
    };
    const signature = await library.provider.send("personal_sign", [
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

  const pathwayCardMarkdownTheme = {
    h1: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h1" size="xl" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h2: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h2" size="lg" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h3: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h3" size="md" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    h4: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h4" size="md" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    p: (props) => {
      const { children } = props;
      return (
        <Text w="full" fontSize="xl">
          {children}
        </Text>
      );
    },
  };

  return (
    <Card position="relative" h="xl" layerStyle="no-border-hover" spacing="6">
      {!unlocked && <LockedScreen />}

      <Box filter={!unlocked ? "blur(4px)" : "blur(0px)"} w="full">
        <Flex w="full" minH="56px">
          <Heading
            noOfLines={2}
            as="h2"
            w="full"
            fontSize="2xl"
            color={getTextColor}
            textTransform="uppercase"
          >
            {quest.name}
          </Heading>

          <Spacer />
          <Flex align="end" direction="column" w="full">
            <Tag variant="subtle">{quest.completed || "COMPLETED"}</Tag>
            <Tag my="2">
              {quest.rewardAmount} {getRewardCurrency(quest.rewardCurrency)}
            </Tag>
          </Flex>
        </Flex>
        <VStack w="full" align="flex-start" h="160px">
          <ReactMarkdown
            className="card-markdown-quest-card"
            components={ChakraUIRenderer(pathwayCardMarkdownTheme)}
            children={quest.description}
            skipHtml
          />
        </VStack>
        <Divider />

        <VStack w="full" align="left" pt="2">
          <HStack justifyContent="space-between">
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
            <Tag variant="outline">{quest.questType}</Tag>
          </HStack>
          <Divider />
          <HStack justifyContent="space-between">
            <HStack>
              <Icon as={FiUserCheck} />
              <Text
                fontWeight="bold"
                fontSize="xl"
                color={getTextColor}
                textTransform="uppercase"
              >
                Claimed
              </Text>
            </HStack>
            <Tag variant="outline">0/{quest.rewardUserCap}</Tag>
          </HStack>
          <Divider />
          <HStack justifyContent="space-between">
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
            <Tag variant="outline">
              {quest.rewardAmount} {getRewardCurrency(quest.rewardCurrency)}
            </Tag>
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
                {parseFloat(quest.rewardAmount) / quest.rewardUserCap}{" "}
                {getRewardCurrency(quest.rewardCurrency)}
              </Text>
            </Flex>
          </Stack>
          <Spacer />
        </VStack>

        <Flex w="full" justify="space-between" pt="4">
          {quest.isPending && isContributor && (
            <>
              <Button
                variant="outline"
                fontSize="md"
                onClick={() => openQuest(quest.id)}
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
                onClick={() => openQuest(quest.id)}
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
      </Box>
    </Card>
  );
}

export default QuestCard;
