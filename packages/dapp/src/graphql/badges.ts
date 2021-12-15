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

export const GET_ALL_BADGES_BY_PROJECT_ID_QUERY = gql`
  query GetAllBadgesByProjectId($projectId: String!) {
    getAllBadgesByProjectId(projectId: $projectId) {
      id
      title
      description
      image
      difficulty
      isPending
    }
  }
`;

export const GET_BADGE_BY_ID_QUERY = gql`
  query GetBadgeById($badgeId: String!) {
    getBadgeById(badgeId: $badgeId) {
      id
      title
      difficulty
      description
      projectId
      prerequisites
      quests {
        id
        name
      }
    }
  }
`;
