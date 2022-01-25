import { createContext } from "react";

import { State } from "./Web3Reducer";

export const initialState = {
  loading: false,
  account: null,
  contracts: null,
} as State;
export const Web3Context = createContext(initialState);
