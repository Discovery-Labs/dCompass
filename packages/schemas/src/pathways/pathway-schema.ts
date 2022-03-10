export const PathwaySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Pathway",
  description:
    "A pathway covers a specific topic within a project or an ecosystem",
  type: "object",
  properties: {
    createdAt: {
      type: "string",
      format: "date-time",
      maxLength: 30,
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      maxLength: 30,
    },
    title: {
      type: "string",
      title: "title",
      maxLength: 100,
    },
    projectId: {
      $ref: "#/definitions/CeramicStreamId",
    },
    image: {
      type: "string",
    },
    description: {
      type: "string",
    },
    createdBy: {
      type: "string",
    },
    difficulty: {
      type: "string",
      enum: ["beginner", "intermediate", "advanced", "expert", "wizard"],
    },
    isFeatured: {
      type: "boolean",
    },
    rewardAmount: {
      type: "number",
    },
    rewardUserCap: {
      type: "number",
    },
    rewardCurrency: {
      type: "string",
    },
    prerequisites: {
      type: "array",
      items: {
        type: "string",
      },
    },
    quests: {
      type: "array",
      title: "Quests",
      items: {
        type: "object",
        title: "QuestItem",
        properties: {
          id: {
            type: "string",
          },
        },
      },
    },
    pendingQuests: {
      type: "array",
      title: "PendingQuests",
      items: {
        type: "object",
        title: "PendingQuestItem",
        properties: {
          id: {
            type: "string",
          },
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
