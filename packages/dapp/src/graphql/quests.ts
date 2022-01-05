import { gql } from "@apollo/client";

export const CREATE_QUEST_MUTATION = gql`
  mutation CreateQuest($input: CreateQuestInput!) {
    createQuest(input: $input) {
      id
      name
      description
      badgeId
      questType
    }
  }
`;

export const CREATE_SNAPSHOT_VOTER_QUEST_MUTATION = gql`
  mutation CreateSnapshotVoterQuest($input: CreateQuestInput!) {
    createSnapshotVoterQuest(input: $input) {
      id
      name
      description
      badgeId
      questType
      proposalId
    }
  }
`;

export const SUBMIT_QUEST_ANSWERS_MUTATION = gql`
  mutation SubmitQuestAnswers($input: QuestAnswersSubmitionInput!) {
    submitQuestAnswers(input: $input)
  }
`;
