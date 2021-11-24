import { gql } from "@apollo/client";

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      tokenUris
      isFeatured
    }
  }
`;

export const EDIT_PROJECT_MUTATION = gql`
  mutation EditProject($input: EditProjectInput!) {
    editProject(input: $input) {
      id
      name
      createdBy
      createdAt
      description
      website
      whitepaper
      tokenUris
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

export const APPROVE_PROJECT_MUTATION = gql`
  mutation ApproveProject($input: ApproveProjectInput!) {
    approveProject(input: $input) {
      id
      tokenUris
      isFeatured
    }
  }
`;

export const ALL_PROJECTS_QUERY = gql`
  query getAllProjects {
    getAllProjects {
      id
      name
      createdBy
      description
      tokenUris
      website
      whitepaper
      createdAt
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

export const PROJECT_BY_ID_QUERY = gql`
  query GetProjectById($projectId: String!) {
    getProjectById(projectId: $projectId) {
      id
      name
      createdBy
      createdAt
      description
      tokenUris
      isFeatured
      website
      whitepaper
      logo
      squads {
        name
        image
        members
      }
    }
  }
`;
