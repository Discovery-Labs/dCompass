export const questBaseProperties = {
  _id: {
    type: "string",
  },
  streamId: {
    type: "string",
  },
  pathwayId: {
    type: "string",
  },
  slogan: {
    type: "string",
  },
  name: {
    type: "string",
    title: "name",
    maxLength: 100,
  },
  description: {
    type: "string",
  },
  completedBy: {
    type: "array",
    title: "completedBy",
    items: {
      type: "string",
    },
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
  questType: {
    type: "string",
    maxLength: 150,
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
};

export const QuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Quest",
  description:
    "A quest is a challenge that certifies the knowledge aquired within a pathway",
  type: "object",
  properties: {
    ...questBaseProperties,
  },
  definitions: {
    IPFSUrl: {
      type: "string",
      pattern: "^ipfs://.+",
      maxLength: 150,
    },
    CeramicStreamId: {
      type: "string",
      pattern: "^ceramic://.+(\\\\?version=.+)?",
      maxLength: 150,
    },
  },
};
