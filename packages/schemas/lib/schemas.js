"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const contributors_schema_1 = require("./contributors/contributors-schema");
const badge_schema_1 = require("./badges/badge-schema");
const badges_schema_1 = require("./badges/badges-schema");
const app_projects_schema_1 = require("./projects/app-projects-schema");
const project_schema_1 = require("./projects/project-schema");
const projects_schema_1 = require("./projects/projects-schema");
const quest_schema_1 = require("./quests/quest-schema");
const quests_schema_1 = require("./quests/quests-schema");
const tag_schema_1 = require("./tags/tag-schema");
const tags_schema_1 = require("./tags/tags-schema");
exports.schemas = {
    dCompass: {
        Contributors: contributors_schema_1.ContributorsSchema,
        AppProjects: app_projects_schema_1.AppProjectsSchema,
        Projects: projects_schema_1.ProjectsSchema,
        Project: project_schema_1.ProjectSchema,
        Badges: badges_schema_1.BadgesSchema,
        Badge: badge_schema_1.BadgeSchema,
        Quests: quests_schema_1.QuestsSchema,
        Quest: quest_schema_1.QuestSchema,
        Tags: tags_schema_1.TagsSchema,
        Tag: tag_schema_1.TagSchema,
    },
};
//# sourceMappingURL=schemas.js.map