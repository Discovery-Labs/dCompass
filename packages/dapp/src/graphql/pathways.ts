import { gql } from "@apollo/client";

export const CREATE_PATHWAY_MUTATION = gql`
  mutation CreatePathway($input: CreatePathwayInput!) {
    createPathway(input: $input) {
      id
      title
      difficulty
      description
    }
  }
`;

export const APPROVE_PATHWAY_MUTATION = gql`
  mutation ApprovePathway($input: ApprovePathwayInput!) {
    approvePathway(input: $input) {
      id
      title
      difficulty
      image
      description
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
      difficulty
      image
      projectStreamId
      description
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
        image
        difficulty
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        projectId
        quests {
          id
          name
        }
      }
      pendingPathways {
        id
        streamId
        title
        description
        image
        difficulty
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        projectId
        quests {
          id
          name
        }
      }
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
      difficulty
      description
      rewardCurrency
      rewardAmount
      rewardUserCap
      image
      projectId
      prerequisites
      quests {
        id
        name
      }
    }
  }
`;
