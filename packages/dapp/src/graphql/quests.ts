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

export const APPROVE_QUEST_MUTATION = gql`
  mutation ApproveBadge($input: ApproveQuestInput!) {
    approveQuest(input: $input) {
      id
      name
      description
      image
      isPending
    }
  }
`;

export const GET_ALL_QUESTS_BY_BADGE_ID_QUERY = gql`
  query GetAllQuestsByBadgeId($badgeId: String!) {
    getAllQuestsByBadgeId(badgeId: $badgeId) {
      id
      name
      description
      badgeId
      image
      isPending
    }
  }
`;

export const SUBMIT_QUEST_ANSWERS_MUTATION = gql`
  mutation SubmitQuestAnswers($input: QuestAnswersSubmitionInput!) {
    submitQuestAnswers(input: $input)
  }
`;
