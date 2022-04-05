import { questBaseProperties } from "./quest-schema";

export const QuestsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "QuestsList",
  type: "object",
  properties: {
    quests: {
      type: "array",
      title: "quests",
      items: {
        type: "object",
        title: "QuestItem",
        properties: {
          id: {
            type: "string",
          },
          ...questBaseProperties,
        },
      },
    },
  },
  definitions: {
    CeramicStreamId: {
      type: "string",
      pattern: "^ceramic://.+(\\\\?version=.+)?",
      maxLength: 150,
    },
  },
};
