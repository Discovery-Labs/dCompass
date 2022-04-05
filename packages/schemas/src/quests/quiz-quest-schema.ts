import { questBaseProperties } from "./quest-schema";

export const QuizQuestSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "QuizQuest",
  description: "This quest certifies that a user has passed a quiz.",
  type: "object",
  properties: {
    ...questBaseProperties,
    questions: {
      type: "array",
      title: "questions",
      minItems: 3,
      items: {
        type: "object",
        title: "questionItem",
        properties: {
          question: {
            type: "string",
            maxLength: 500,
          },
          answer: {
            type: "string",
          },
          choices: {
            type: "array",
            title: "choices",
            minItems: 2,
            maxItems: 10,
            items: {
              type: "string",
              maxLength: 500,
            },
          },
        },
      },
    },
  },
};
