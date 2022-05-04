import { Client } from "@textile/hub";
export type State = {
  isSignedIn: boolean;
  loading: boolean;
  account: null | string;
  ens?: string;
  self: null | any;
  core: null | any;
  identityLink: null | any;
  privateIdentity: null | any;
  authorizedClient: null | Client;
  contracts: null | any;
  isReviewer: boolean;
  connectWeb3?: any;
  logout?: any;
};
export const Web3Reducer = (state: State, action: Record<string, any>) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return {
        ...state,
        account: action.payload,
      };
    case "SET_ENS":
      return {
        ...state,
        ens: action.payload,
      };
    case "SET_IS_SIGNED_IN":
      return {
        ...state,
        isSignedIn: action.payload,
      };
    case "SET_SELF":
      return {
        ...state,
        self: action.payload,
      };
    case "SET_CORE":
      return {
        ...state,
        core: action.payload,
      };
    case "SET_IDENTITY_LINK":
      return {
        ...state,
        identityLink: action.payload,
      };
    case "SET_PRIVATE_IDENTITY":
      return {
        ...state,
        identity: action.payload,
      };
    case "SET_IS_REVIEWER":
      return {
        ...state,
        isReviewer: action.payload,
      };
    case "SET_CONTRACTS":
      return {
        ...state,
        contracts: action.payload,
      };
    default:
      return state;
  }
};
