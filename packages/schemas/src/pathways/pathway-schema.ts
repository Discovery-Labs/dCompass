export const PathwaySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Pathway",
  description:
    "A pathway covers a specific topic within a project or an ecosystem",
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    streamId: {
      type: "string",
    },
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
      type: "string",
    },
    image: {
      type: "string",
    },
    slogan: {
      type: "string",
    },
    description: {
      type: "string",
    },
    createdBy: {
      type: "string",
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
      title: "quests",
      items: {
        type: "string",
      },
    },
    pendingQuests: {
      type: "array",
      title: "pendingQuests",
      items: {
        type: "string",
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
