import { gql } from "@apollo/client";

export const CREATE_PATHWAY_MUTATION = gql`
  mutation CreatePathway($input: CreatePathwayInput!) {
    createPathway(input: $input) {
      id
      title
      description
      slogan
    }
  }
`;

export const APPROVE_PATHWAY_MUTATION = gql`
  mutation ApprovePathway($input: ApprovePathwayInput!) {
    approvePathway(input: $input) {
      id
      title
      image
      description
      slogan
      projectStreamId
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;

export const VERIFY_PATHWAY_MUTATION = gql`
  mutation VerifyPathway($input: VerifyPathwayInput!) {
    verifyPathway(input: $input) {
      id
      title
      image
      projectStreamId
      description
      slogan
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;

export const GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY = gql`
  query GetAllPathwaysByProjectId($projectId: String!) {
    getAllPathwaysByProjectId(projectId: $projectId) {
      id
      streamId
      pathways {
        id
        streamId
        title
        description
        slogan
        image
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        projectId
        prerequisites
        createdBy
        quizQuests {
          id
          isPending
          completedBy
        }
        bountyQuests {
          id
          isPending
          completedBy
        }
      }
    }
  }
`;

export const EDIT_PATHWAY_MUTATION = gql`
  mutation EditPathway($input: EditPathwayInput!) {
    editPathway(input: $input) {
      id
      streamId
      title
      createdAt
      description
      slogan
      rewardCurrency
      rewardAmount
      rewardUserCap
      createdBy
      image
      projectId
      prerequisites
    }
  }
`;

export const GET_PATHWAY_BY_ID_QUERY = gql`
  query GetPathwayById($pathwayId: String!) {
    getPathwayById(pathwayId: $pathwayId) {
      id
      streamId
      title
      createdBy
      createdAt
      description
      slogan
      rewardCurrency
      rewardAmount
      rewardUserCap
      image
      projectId
      prerequisites
      quests {
        id
        isPending
        completedBy
      }
    }
  }
`;

export const CLAIM_PATHWAY_REWARDS_MUTATION = gql`
  mutation ClaimPathwayRewards($input: ClaimPathwayRewardsInput!) {
    claimPathwayRewards(input: $input) {
      id
      streamId
      title
      rewardCurrency
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
