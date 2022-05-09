/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const ALL_TAGS_QUERY = gql`
  query GetAllTags {
    getAllTags {
      id
      label
      color
      value
    }
  }
`;
