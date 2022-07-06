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
      slogan
      website
      whitepaper
      tokenUris
      discord
      twitter
      github
      gitbook
      isFeatured
      logo
      squads {
        id
        name
        image
        members
      }
      tags {
        id
        label
        value
        color
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
  query GetAllProjects {
    getAllProjects {
      id
      name
      createdBy
      description
      slogan
      tokenUris
      website
      whitepaper
      discord
      twitter
      github
      gitbook
      createdAt
      isFeatured
      logo
      squads {
        id
        name
        image
        members
      }
      tags {
        id
        label
        value
        color
      }
    }
  }
`;

export const PROJECT_BY_ID_QUERY = gql`
  query GetProjectById($projectId: String!) {
    getProjectById(projectId: $projectId) {
      id
      streamId
      name
      createdBy
      createdAt
      description
      slogan
      tokenUris
      isFeatured
      website
      whitepaper
      discord
      twitter
      github
      gitbook
      logo
      squads {
        id
        name
        image
        members
      }
      tags {
        id
        label
        value
        color
      }
    }
  }
`;
