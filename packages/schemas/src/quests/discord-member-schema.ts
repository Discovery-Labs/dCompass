import { questBaseProperties } from "./quest-schema";

export const DiscordMemberQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "DiscordMemberQuest",
  description:
    "This quest certifies that a user is a member of the specified Discord server.",
  type: "object",
  properties: {
    ...questBaseProperties,
    discordGuildId: {
      type: "array",
      items: {
        type: "string",
        maxLength: 15,
      },
    },
  },
};
