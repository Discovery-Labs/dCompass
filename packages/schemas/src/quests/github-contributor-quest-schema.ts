import { questBaseProperties } from "./quest-schema";

export const GithubContributorQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "GithubContributorQuest",
  description:
    "This quest certifies that a user has submitted PRs that have been reviewed & approved.",
  type: "object",
  properties: {
    ...questBaseProperties,
    githubOrgId: {
      type: "string",
      maxLength: 200,
    },
  },
};
