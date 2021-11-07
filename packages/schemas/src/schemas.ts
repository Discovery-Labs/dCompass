import { ContributorsSchema } from "./contributors/contributors-schema";
import { CourseSchema } from "./courses/course-schema";
import { CoursesSchema } from "./courses/courses-schema";
import { ProjectSchema } from "./projects/project-schema";
import { ProjectsSchema } from "./projects/projects-schema";
import { QuestSchema } from "./quests/quest-schema";
import { QuestsSchema } from "./quests/quests-schema";
import { TagSchema } from "./tags/tag-schema";
import { TagsSchema } from "./tags/tags-schema";

export const schemas = {
  dCompass: {
    Contributors: ContributorsSchema,
    Projects: ProjectsSchema,
    Project: ProjectSchema,
    courses: CoursesSchema,
    course: CourseSchema,
    quests: QuestsSchema,
    quest: QuestSchema,
    Tags: TagsSchema,
    Tag: TagSchema,
  },
};
