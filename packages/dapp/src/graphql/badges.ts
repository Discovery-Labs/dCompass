import { gql } from "@apollo/client";

export const CREATE_BADGE_MUTATION = gql`
  mutation CreateBadge($input: CreateBadgeInput!) {
    createBadge(input: $input) {
      id
      title
      difficulty
      description
    }
  }
`;

export const APPROVE_BADGE_MUTATION = gql`
  mutation ApproveBadge($input: ApproveBadgeInput!) {
    approveBadge(input: $input) {
      id
      title
      difficulty
      description
      isPending
    }
  }
`;

export const GET_ALL_BADGES_BY_PROJECT_ID_QUERY = gql`
  query GetAllBadgesByProjectId($projectId: String!) {
    getAllBadgesByProjectId(projectId: $projectId) {
      id
      title
      description
      image
      difficulty
      isPending
      projectId
    }
  }
`;

export const GET_BADGE_BY_ID_QUERY = gql`
  query GetBadgeById($badgeId: String!) {
    getBadgeById(badgeId: $badgeId) {
      id
      title
      createdBy
      createdAt
      difficulty
      description
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
