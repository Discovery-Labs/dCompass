import { questBaseProperties } from "./quest-schema";

export const QuizQuestSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "QuizQuest",
    description: "This quest certifies that a user has passed a quiz.",
    type: "object",
    properties: {
        ...questBaseProperties,
        submissions: {
            type: "array",
            title: "submissions",
            items: {
                type: "object",
                title: "solutionSubmission",
                properties: {
                    did: {
                        type: "string",
                    },
                    solution: {
                        type: "string",
                    },
                    status: {
                        type: "string"
                    },
                    reviewComment: {
                        type: "string"
                    }
                },
            },
        },
    },
};
