import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      tokenUri
      isFeatured
    }
  }
`;

export const APPROVE_PROJECT_MUTATION = gql`
  mutation ApproveProject($input: ApproveProjectInput!) {
    approveProject(input: $input) {
      id
      tokenUri
      isFeatured
    }
  }
`;

export const ALL_PROJECTS_QUERY = gql`
  query getAllProjects {
    getAllProjects {
      id
      name
      description
      tokenUri
      isFeatured
      logo
    }
  }
`;

export const PROJECT_BY_ID_QUERY = gql`
  query GetProjectById($projectId: String!) {
    getProjectById(projectId: $projectId) {
      id
      name
      description
      tokenUri
      isFeatured
      logo
      squads {
        name
        image
        members
      }
    }
  }
`;
