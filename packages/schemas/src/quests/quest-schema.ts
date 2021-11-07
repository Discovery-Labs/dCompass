export const QuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Quest",
  description: "A quest is a challenge that certifies the knowledge aquired during a course",
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
    questions: {
      type: "array",
      title: "questions",
      minItems: 3,
      items: {
        type: "object",
        title: "questionItem",
        properties: {
          choices: {
            type: "array",
            title: "choices",
            minItems: 2,
            maxItems: 10,
            items: {
              type: "string",
              maxLength: 500
            }
          },
          question: {
            type: "string",
            maxLength: 500
          },
          answer: {
            type: "string",
            maxLength: 200
          }
        },
      }
    },
    nfts: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          claimedBy: {
            type: "array",
            title: "claimedBy",
            items: {
              type: "string",
            }
          },
          rarity: {
            type: "string",
            enum: ["common", "uncommon", "epic", "legendary"]
          },
          name: {
            type: "string",
            maxLength: 200
          },
          url: {
            $ref: "#/definitions/IPFSUrl"
          }
        },
      }
    },
  },
  definitions: {
    IPFSUrl: {
      type: "string",
      pattern: "^ipfs://.+",
      maxLength: 150
    },
  }
}