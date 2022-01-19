import { gql } from "@apollo/client";

export const CREATE_QUEST_MUTATION = gql`
  mutation CreateQuest($input: CreateQuestInput!) {
    createQuest(input: $input) {
      id
      name
      description
      pathwayId
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
      pathwayId
      proposalId
    }
  }
`;

export const CREATE_NFT_OWNER_QUEST_MUTATION = gql`
  mutation CreateNFTOwnerQuest($input: CreateQuestInput!) {
    createNFTOwnerQuest(input: $input) {
      id
      name
      description
      pathwayId
      collectionContractAddress
    }
  }
`;

export const CREATE_QUIZ_QUEST_MUTATION = gql`
  mutation CreateQuizQuest($input: CreateQuestInput!) {
    createQuizQuest(input: $input) {
      id
      name
      description
      pathwayId
      questions {
        question
        choices
        answer
      }
    }
  }
`;

export const APPROVE_QUEST_MUTATION = gql`
  mutation ApproveQuest($input: ApproveQuestInput!) {
    approveQuest(input: $input) {
      id
      name
      description
      pathwayId
      image
      isPending
    }
  }
`;

export const GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY = gql`
  query GetAllQuestsByPathwayId($pathwayId: String!) {
    getAllQuestsByPathwayId(pathwayId: $pathwayId) {
      id
      name
      description
      pathwayId
      questType
      image
      rewardCurrency
      rewardAmount
      isPending
    }
  }
`;

export const SUBMIT_QUEST_ANSWERS_MUTATION = gql`
  mutation SubmitQuestAnswers($input: QuestAnswersSubmitionInput!) {
    submitQuestAnswers(input: $input)
  }
`;
