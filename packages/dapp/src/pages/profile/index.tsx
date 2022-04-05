import {
  Avatar,
  Heading,
  HStack,
  Text,
  VStack,
  Button,
  Box,
  Link,
  Icon,
} from "@chakra-ui/react";
import {
  SkillGroupDataType,
  SkillProvider,
  SkillThemeType,
  SkillTree,
  SkillTreeGroup,
  SkillType,
} from "@discovery-dao/tree";
import { Web3Context } from "contexts/Web3Provider";
import useCustomColor from "core/hooks/useCustomColor";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SiGithub, SiTwitter } from "react-icons/si";

const gitcoinPath: SkillType[] = [
  {
    id: "gitcoin",
    title: "Get Started",
    tooltip: { content: "" },
    children: [
      {
        id: "g1",
        title: "Moonshot Collective",
        tooltip: { content: "" },
        children: [],
      },
      {
        id: "g2",
        title: "Memes, Merch and Marketing",
        tooltip: { content: "" },
        children: [],
      },
      {
        id: "g3",
        title: "Workstream X",
        tooltip: { content: "" },
        children: [
          {
            id: "g4",
            title: "squad x",
            tooltip: { content: "" },
            children: [],
          },
          {
            id: "g5",
            title: "squad y",
            tooltip: { content: "" },
            children: [],
          },
        ],
      },
      {
        id: "g6",
        title: "DAO OPS",
        tooltip: { content: "" },
        children: [],
      },
    ],
  },
];

const theGraphPath: SkillType[] = [
  {
    id: "thegraph",
    title: "Get Started",
    tooltip: { content: "" },
    children: [
      {
        id: "t1",
        title: "Delegator",
        tooltip: { content: "" },
        children: [],
      },
      {
        id: "t2",
        title: "Developer",
        tooltip: { content: "" },
        children: [
          {
            id: "t3",
            title: "Define a Subgraph",
            tooltip: { content: "" },
            children: [
              {
                id: "t4",
                title: "Create a Subgraph",
                tooltip: { content: "" },
                children: [
                  {
                    id: "t5",
                    title: "Query a Subgraph",
                    tooltip: { content: "" },
                    children: [
                      {
                        id: "t6",
                        title: "Graph API",
                        tooltip: { content: "" },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "t7",
        title: "Indexer",
        tooltip: { content: "" },
        children: [],
      },
    ],
  },
];

const projectIdPath: SkillType[] = [
  {
    id: "thegraph",
    title: "Get Started",
    tooltip: { content: "" },
    children: [
      {
        id: "msc",
        title: "Moonshot Collective",
        tooltip: { content: "" },
        children: [],
      },
      {
        id: "fdd",
        title: "Workstream X",
        tooltip: { content: "" },
        children: [
          {
            id: "sx",
            title: "squad x",
            tooltip: { content: "" },
            children: [],
          },
          {
            id: "sy",
            title: "squad y",
            tooltip: { content: "" },
            children: [],
          },
        ],
      },
      {
        id: "daoops",
        title: "DAO OPS",
        tooltip: { content: "" },
        children: [],
      },
    ],
  },
];

type BadgeObject = {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
    tokenMetadata: {
      tokenType: string;
    };
  };
  balance: string;
  title: string;
  description: string;
  tokenUri: {
    gateway: string;
  };
  media: Array<{
    gateway: string;
  }>;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
};

type BadgesData = {
  ownedNfts: Array<BadgeObject>;
  totalCount: number;
};

function Profile() {
  // const [badges, setBadges] = useState<BadgesData>();
  const router = useRouter();
  const badges = {
    totalCount: 3,
    ownedNfts: [
      {
        id: {
          tokenId: 1,
        },
        title: "Tezian",
        media: [
          {
            gateway:
              "https://images.unsplash.com/photo-1638913971789-667874197280?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          },
        ],
      },
      {
        id: {
          tokenId: 1,
        },
        title: "Badgelor",
        media: [
          {
            gateway:
              "https://images.unsplash.com/photo-1521249692263-e0659c60326e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFkZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
          },
        ],
      },
      {
        id: {
          tokenId: 1,
        },
        title: "Zippy",
        media: [
          {
            gateway:
              "https://images.unsplash.com/photo-1617117437811-a5620436cf77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmFkZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
          },
        ],
      },
    ],
  };
  const { account } = useContext(Web3Context);
  const {
    getOverBgColor,
    getBorderColor,
    getPrimaryColor,
    getTextColor,
    getBgColor,
    getColoredText,
  } = useCustomColor();

  const treeTheme = {
    // : SkillThemeType
    border: `2px solid ${getBorderColor}`,
    borderRadius: "8px",
    nodeBackgroundColor: getOverBgColor,
    primaryFontColor: getTextColor,
    treeBackgroundColor: getOverBgColor,
    nodeBorderColor: getBorderColor,
    edgeBorder: `1px solid ${getBorderColor}`,
    nodeOverlayColor: getPrimaryColor,
    nodeHoverBorder: "2px solid",
  };

  const fetchBadgesBody = {
    ownerAddr: account || "",
    contractAddr: "0xc718EBf4A7B5eE42a5D0c152e5303fEe25C066AC",
  };

  // const getBadges = async () => {
  //   const badgesResponse = await fetch(`/api/user-badges`, {
  //     method: "POST",
  //     body: JSON.stringify(fetchBadgesBody),
  //   });
  //   const badgesData = await badgesResponse.json();
  //   setBadges(badgesData);
  //   console.log("badges", badges);
  // };

  // useEffect(() => {
  //   getBadges();
  // }, []);

  return (
    <VStack>
      <VStack pb={8}>
        <Heading>Profile</Heading>
        <Box p="8">
          <Avatar
            border={`4px solid ${getPrimaryColor}`}
            padding="1"
            bgColor={getBgColor}
            size="2xl"
            name="Profile Image"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
          />
        </Box>
        <Text textStyle="h2" fontWeight="bold">
          Satoshi Nakamoto
        </Text>
        <Text color={getColoredText}>
          Web3 Developer. Blockchain enthusiast. Shadowy Super Coder.{" "}
        </Text>
        <Link color={getColoredText} textStyle="small">
          https://shadowysupercoder.xyz
        </Link>
        <HStack py="2" spacing={4}>
          <Icon as={SiGithub} />
          <Icon as={SiTwitter} />
        </HStack>
        <Button onClick={() => router.push("/profile/edit")}>
          Edit Profile
        </Button>
      </VStack>
      <Heading>Badges</Heading>
      <HStack py="8" spacing={8}>
        {badges &&
          badges.totalCount !== 0 &&
          badges.ownedNfts.map((badge) => (
            <VStack key={badge.id.tokenId}>
              <Avatar
                size="lg"
                name={badge.title}
                src={badge.media[0].gateway}
              />
              <Text textStyle="small">{badge.title}</Text>
            </VStack>
          ))}
        {!badges && <Text>Loading badges...</Text>}
      </HStack>
      <Heading>Skill Trees</Heading>
      <SkillProvider>
        <SkillTreeGroup theme={treeTheme}>
          {({ skillCount }: SkillGroupDataType) => (
            <>
              <SkillTree
                treeId="gitcoin-tree"
                title="Gitcoin"
                data={gitcoinPath}
              />
              <SkillTree
                treeId="thegraph-tree"
                title="TheGraph"
                data={theGraphPath}
              />
              <SkillTree
                treeId="project-id"
                title="Project ID"
                data={gitcoinPath}
                description="description"
              />
            </>
          )}
        </SkillTreeGroup>
      </SkillProvider>
    </VStack>
  );
}

export default Profile;
