export const questBaseProperties = {
  name: {
    type: "string",
    title: "name",
    maxLength: 100,
  },
  description: {
    type: "string",
  },
  pathwayId: {
    $ref: "#/definitions/CeramicStreamId",
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
  // nfts: {
  //   type: "array",
  //   minItems: 1,
  //   items: {
  //     type: "object",
  //     properties: {
  //       claimedBy: {
  //         type: "array",
  //         title: "claimedBy",
  //         items: {
  //           type: "string",
  //         },
  //       },
  //       rarity: {
  //         type: "string",
  //         enum: ["common", "uncommon", "epic", "legendary"],
  //       },
  //       name: {
  //         type: "string",
  //         maxLength: 200,
  //       },
  //       url: {
  //         $ref: "#/definitions/IPFSUrl",
  //       },
  //     },
  //   },
  // },
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
