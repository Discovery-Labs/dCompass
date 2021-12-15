import { ContributorsSchema } from "./contributors/contributors-schema";
import { BadgeSchema } from "./badges/badge-schema";
import { BadgesSchema } from "./badges/badges-schema";
import { AppProjectsSchema } from "./projects/app-projects-schema";
import { ProjectSchema } from "./projects/project-schema";
import { ProjectsSchema } from "./projects/projects-schema";
import { QuestSchema } from "./quests/quest-schema";
import { QuestsSchema } from "./quests/quests-schema";
import { TagSchema } from "./tags/tag-schema";
import { TagsSchema } from "./tags/tags-schema";

export const schemas = {
  dCompass: {
    Contributors: ContributorsSchema,
    AppProjects: AppProjectsSchema,
    Projects: ProjectsSchema,
    Project: ProjectSchema,
    Badges: BadgesSchema,
    Badge: BadgeSchema,
    Quests: QuestsSchema,
    Quest: QuestSchema,
    Tags: TagsSchema,
    Tag: TagSchema,
  },
};
