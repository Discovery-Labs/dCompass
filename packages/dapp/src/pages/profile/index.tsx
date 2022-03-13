import {
  SkillTreeGroup,
  SkillTree,
  SkillProvider,
  SkillType,
  SkillGroupDataType,
  SkillThemeType,
} from "@discovery-dao/tree";
import useCustomColor from "core/hooks/useCustomColor";
import { Heading } from "@chakra-ui/react";

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

function Profile() {
  const { getOverBgColor, getBorderColor, getPrimaryColor, getTextColor } =
    useCustomColor();

  const treeTheme: SkillThemeType = {
    border: `2px solid ${getBorderColor}`,
    borderRadius: "8px",
    nodeBackgroundColor: getOverBgColor,
    // backgroundColor: "",
    // primaryFont: "",
    primaryFontColor: getTextColor,
    treeBackgroundColor: getOverBgColor,
    nodeBorderColor: getBorderColor,
    // disabledTreeOpacity: 1,
    edgeBorder: `1px solid ${getBorderColor}`,
    // headingFont: "",
    // headingFontColor: "",
    // headingFontSize: "",
    // headingHoverColor: "",
    // headingHoverColorTransition: "",
    // tooltipBackgroundColor: "",
    // tooltipFontColor: "",
    // tooltipZIndex: 0,
    // nodeAlternativeFontColor: "",
    // nodeAltenativeActiveFontColor: "",
    nodeOverlayColor: getPrimaryColor,
    // nodeAlternativeActiveBackgroundColor: "",
    // nodeActiveBackgroundColor: "",
    nodeHoverBorder: "2px solid",
    // nodeHoverBorderColor: "",
    // nodeIconWidth: "",
    // nodeMobileTextNodeHeight: "",
    // nodeMobileTextNodeWidth: "",
    // nodeMobileFontSize: "",
    // nodeDesktopTextNodeHeight: "",
    // nodeDesktopTextNodeWidth: "",
    // nodeDesktopFontSize: "",
  };

  return (
    <div>
      Profile
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
