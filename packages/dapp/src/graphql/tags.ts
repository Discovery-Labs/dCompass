import { gql } from "@apollo/client";

export const ALL_TAGS_QUERY = gql`
  query getAllTags {
    getAllTags {
      id
      name
      description
      color
    }
  }
`;
