import { PathwaySchema } from "./pathways/pathway-schema";
import { PathwaysSchema } from "./pathways/pathways-schema";
import { AppProjectsSchema } from "./projects/app-projects-schema";
import { ProjectSchema } from "./projects/project-schema";
import { ProjectsSchema } from "./projects/projects-schema";
import { DiscordMemberQuestSchema } from "./quests/discord-member-schema";
import { NFTOwnerQuestSchema } from "./quests/nft-owner-schema";
import { PoapOwnerQuestSchema } from "./quests/poap-owner-schema";
import { QuestSchema } from "./quests/quest-schema";
import { QuestsSchema } from "./quests/quests-schema";
import { QuizQuestSchema } from "./quests/quiz-quest-schema";
import { SnaphotVoterQuestSchema } from "./quests/snaphot-voter-quest-schema";
import { TokenHolderQuestSchema } from "./quests/token-holder-schema";
import { TwitterFollowerQuestSchema } from "./quests/twitter-follower-schema";
import { TagSchema } from "./tags/tag-schema";
import { TagsSchema } from "./tags/tags-schema";
import { UserPrivateIdentitySchema } from "./user-private-identity";

export const schemas = {
  dCompass: {
    UserPrivateIdentity: UserPrivateIdentitySchema,
    AppProjects: AppProjectsSchema,
    Projects: ProjectsSchema,
    Project: ProjectSchema,
    Pathways: PathwaysSchema,
    Pathway: PathwaySchema,
    Quests: QuestsSchema,
    Quest: QuestSchema,
    SnaphotVoterQuest: SnaphotVoterQuestSchema,
    NFTOwnerQuest: NFTOwnerQuestSchema,
    PoapOwnerQuest: PoapOwnerQuestSchema,
    DiscordMemberQuest: DiscordMemberQuestSchema,
    QuizQuest: QuizQuestSchema,
    TokenHolderQuest: TokenHolderQuestSchema,
    TwitterFollowerVoterQuest: TwitterFollowerQuestSchema,
    Tags: TagsSchema,
    Tag: TagSchema,
  },
};
