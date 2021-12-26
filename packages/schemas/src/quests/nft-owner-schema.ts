import { questBaseProperties } from "./quest-schema";

export const NFTOwnerQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "NFTOwnerQuest",
  description: "This quest certifies that a user owns a specific NFT.",
  type: "object",
  properties: {
    ...questBaseProperties,
    collectionContractAddress: {
      type: "string",
      maxLength: 200,
    },
    namespace: {
      type: "string",
      maxLength: 200,
    },
    chainId: {
      type: "integer",
    },
  },
};
