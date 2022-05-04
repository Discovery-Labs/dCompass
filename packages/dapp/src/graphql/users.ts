import { gql } from "@apollo/client";

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SiweRegisterInput!) {
    signIn(input: $input) {
      id
      did
      addresses
    }
  }
`;

export const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      did
      addresses
    }
  }
`;

export const GET_NONCE_QUERY = gql`
  query GetNonce {
    getNonce
  }
`;
