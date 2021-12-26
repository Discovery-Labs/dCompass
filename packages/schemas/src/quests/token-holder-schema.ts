import { questBaseProperties } from "./quest-schema";

export const TokenHolderQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "TokenHolderQuest",
  description:
    "This quest certifies that a user holds a specific token, amount is optional.",
  type: "object",
  properties: {
    ...questBaseProperties,
    amount: {
      type: "number",
    },
    tokenContractAddress: {
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
