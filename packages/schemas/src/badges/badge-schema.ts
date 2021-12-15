export const BadgeSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Badge",
  description:
    "A badge covers a specific topic within a project or an ecosystem",
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
    difficulty: {
      type: "string",
      enum: ["beginner", "intermediate", "advanced", "expert", "wizard"],
    },
    isFeatured: {
      type: "boolean",
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
        type: "object",
        title: "QuestItem",
        properties: {
          id: {
            $ref: "#/definitions/CeramicStreamId",
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
