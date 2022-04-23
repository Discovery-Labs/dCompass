import { gql } from "@apollo/client";

export const CREATE_SNAPSHOT_VOTER_QUEST_MUTATION = gql`
  mutation CreateSnapshotVoterQuest($input: CreateQuestInput!) {
    createSnapshotVoterQuest(input: $input) {
      id
      name
      description
      slogan
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
      slogan
      pathwayId
      collectionContractAddress
    }
  }
`;
export const CREATE_GITHUB_CONTRIBUTOR_QUEST_MUTATION = gql`
  mutation CreateGithubContributorQuest($input: CreateQuestInput!) {
    createGithubContributorQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      githubOrgId
    }
  }
`;

export const CREATE_QUIZ_QUEST_MUTATION = gql`
  mutation CreateQuizQuest($input: CreateQuestInput!) {
    createQuizQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      questions {
        question
        choices
        answer
      }
    }
  }
`;
export const CREATE_QUEST_MUTATION = gql`
  mutation CreateQuest($input: CreateQuestInput!) {
    createQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
    }
  }
`;

export const APPROVE_QUEST_MUTATION = gql`
  mutation ApproveQuest($input: ApproveQuestInput!) {
    approveQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      image
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;

export const VERIFY_QUEST_MUTATION = gql`
  mutation VerifyQuest($input: VerifyQuestInput!) {
    verifyQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      image
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;

export const GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY = gql`
  query GetAllQuestsByPathwayId($pathwayId: String!) {
    getAllQuestsByPathwayId(pathwayId: $pathwayId) {
      id
      streamId
      title
      description
      slogan
      image
      difficulty
      rewardCurrency
      rewardAmount
      rewardUserCap
      isPending
      projectId
      quests {
        id
        streamId
        name
        description
        slogan
        pathwayId
        questType
        image
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        completedBy
      }
    }
  }
`;

export const GET_QUIZ_QUEST_BY_ID_QUERY = gql`
  query GetQuizQuestById($questId: String!) {
    getQuizQuestById(questId: $questId) {
      id
      streamId
      name
      description
      slogan
      pathwayId
      questType
      image
      rewardCurrency
      rewardAmount
      rewardUserCap
      isPending
      completedBy
      createdBy {
        did
        name
      }
      questions {
        question
        choices
        answer
      }
    }
  }
`;

export const SUBMIT_QUEST_ANSWERS_MUTATION = gql`
  mutation SubmitQuestAnswers($input: QuestAnswersSubmitionInput!) {
    submitQuestAnswers(input: $input) {
      id
      isSuccess
      streamId
      name
      rewardCurrency
      completedBy
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;

export const CLAIM_QUEST_REWARDS_MUTATION = gql`
  mutation ClaimQuestRewards($input: ClaimQuestRewardsInput!) {
    claimQuestRewards(input: $input) {
      id
      streamId
      name
      rewardCurrency
      completedBy
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
