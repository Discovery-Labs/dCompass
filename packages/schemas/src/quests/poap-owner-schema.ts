import { questBaseProperties } from "./quest-schema";

export const PoapOwnerQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "PoapOwnerQuest",
  description: "This quest certifies that a user owns a specific POAP.",
  type: "object",
  properties: {
    ...questBaseProperties,
    poapTokenId: {
      type: "string",
      maxLength: 200,
    },
  },
};
