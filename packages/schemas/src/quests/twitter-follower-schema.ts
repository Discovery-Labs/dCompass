import { questBaseProperties } from "./quest-schema";

export const TwitterFollowerQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "TwitterFollowerQuest",
  description:
    "This quest certifies that a user is following the specified handles.",
  type: "object",
  properties: {
    ...questBaseProperties,
    twitterHandles: {
      type: "array",
      items: {
        type: "string",
        maxLength: 15,
      },
    },
  },
};
