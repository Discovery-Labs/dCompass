import { gql } from "@apollo/client";

export const CREATE_QUEST_MUTATION = gql`
  mutation CreateQuest($quest: CreateQuestInput!) {
    createQuest(input: $quest) {
      id
      name
      description
      courseId
      questions {
        answer
        choices
        question
      }
    }
  }
`;

export const SUBMIT_QUEST_ANSWERS_MUTATION = gql`
  mutation SubmitQuestAnswers($input: QuestAnswersSubmitionInput!) {
    submitQuestAnswers(input: $input)
  }
`;
