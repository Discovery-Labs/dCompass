import { gql } from "@apollo/client";

export const ALL_TAGS_QUERY = gql`
  query {
    getAllTags {
      id
      label
      color
      value
    }
  }
`;
