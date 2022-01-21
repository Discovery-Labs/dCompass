"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const contributors_schema_1 = require("./contributors/contributors-schema");
const pathway_schema_1 = require("./pathways/pathway-schema");
const pathways_schema_1 = require("./pathways/pathways-schema");
const app_projects_schema_1 = require("./projects/app-projects-schema");
const project_schema_1 = require("./projects/project-schema");
const projects_schema_1 = require("./projects/projects-schema");
const discord_member_schema_1 = require("./quests/discord-member-schema");
const nft_owner_schema_1 = require("./quests/nft-owner-schema");
const poap_owner_schema_1 = require("./quests/poap-owner-schema");
const quest_schema_1 = require("./quests/quest-schema");
const quests_schema_1 = require("./quests/quests-schema");
const quiz_quest_schema_1 = require("./quests/quiz-quest-schema");
const snaphot_voter_quest_schema_1 = require("./quests/snaphot-voter-quest-schema");
const token_holder_schema_1 = require("./quests/token-holder-schema");
const twitter_follower_schema_1 = require("./quests/twitter-follower-schema");
const tag_schema_1 = require("./tags/tag-schema");
const tags_schema_1 = require("./tags/tags-schema");
exports.schemas = {
    dCompass: {
        Contributors: contributors_schema_1.ContributorsSchema,
        AppProjects: app_projects_schema_1.AppProjectsSchema,
        Projects: projects_schema_1.ProjectsSchema,
        Project: project_schema_1.ProjectSchema,
        Pathways: pathways_schema_1.PathwaysSchema,
        Pathway: pathway_schema_1.PathwaySchema,
        Quests: quests_schema_1.QuestsSchema,
        Quest: quest_schema_1.QuestSchema,
        SnaphotVoterQuest: snaphot_voter_quest_schema_1.SnaphotVoterQuestSchema,
        NFTOwnerQuest: nft_owner_schema_1.NFTOwnerQuestSchema,
        PoapOwnerQuest: poap_owner_schema_1.PoapOwnerQuestSchema,
        DiscordMemberQuest: discord_member_schema_1.DiscordMemberQuestSchema,
        QuizQuest: quiz_quest_schema_1.QuizQuestSchema,
        TokenHolderQuest: token_holder_schema_1.TokenHolderQuestSchema,
        TwitterFollowerVoterQuest: twitter_follower_schema_1.TwitterFollowerQuestSchema,
        Tags: tags_schema_1.TagsSchema,
        Tag: tag_schema_1.TagSchema,
    },
};
//# sourceMappingURL=schemas.js.map