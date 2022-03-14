import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
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

const gitcoinPath: SkillType[] = [
  {
    id: "get-started",
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
        id: "mmm",
        title: "Memes, Merch and Marketing",
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
  const [badges, setBadges] = useState<BadgesData>();
  const { account } = useContext(Web3Context);
  const { getOverBgColor, getBorderColor, getPrimaryColor, getTextColor } =
    useCustomColor();

  const treeTheme: SkillThemeType = {
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

  const getBadges = async () => {
    const badgesResponse = await fetch(`/api/user-badges`, {
      method: "POST",
      body: JSON.stringify(fetchBadgesBody),
    });
    const badgesData = await badgesResponse.json();
    setBadges(badgesData);
    console.log("badges", badges);
  };

  useEffect(() => {
    getBadges();
  }, []);

  return (
    <div>
      <Heading>Badges</Heading>
      <HStack py="4">
        {badges &&
          badges.totalCount !== 0 &&
          badges.ownedNfts.map((badge) => (
            <VStack key={badge.id.tokenId}>
              <Avatar
                size="lg"
                name={badge.title}
                src={badge.media[0].gateway}
              />
              <Text>{badge.title}</Text>
            </VStack>
          ))}
        {!badges && <Text>Loading badges...</Text>}
      </HStack>
      <Heading>Skill Tree</Heading>
      <SkillProvider>
        <SkillTreeGroup theme={treeTheme}>
          {({ skillCount }: SkillGroupDataType) => (
            <>
              <SkillTree
                treeId="first-tree"
                title="Gitcoin"
                data={gitcoinPath}
                collapsible
              />
              <SkillTree
                treeId="second-tree"
                title="Gitcoin"
                data={gitcoinPath}
                collapsible
              />
              <SkillTree
                treeId="third-tree"
                title="Gitcoin"
                data={gitcoinPath}
                collapsible
                description="description"
              />
            </>
          )}
        </SkillTreeGroup>
      </SkillProvider>
    </div>
  );
}

export default Profile;
