import { questBaseProperties } from "./quest-schema";

export const SnaphotVoterQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "SnaphotVoterQuest",
  description:
    "This quest certifies that a user has voted on a snapshot proposal",
  type: "object",
  properties: {
    ...questBaseProperties,
    proposalId: {
      type: "string",
      maxLength: 200,
    },
  },
};
