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
      title
      description
      image
      difficulty
      rewardCurrency
      rewardAmount
      isPending
      projectId
      quests {
        id
      }
    }
  }
`;

export const GET_PATHWAY_BY_ID_QUERY = gql`
  query GetPathwayById($pathwayId: String!) {
    getPathwayById(pathwayId: $pathwayId) {
      id
      title
      createdBy
      createdAt
      difficulty
      description
      rewardCurrency
      rewardAmount
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
