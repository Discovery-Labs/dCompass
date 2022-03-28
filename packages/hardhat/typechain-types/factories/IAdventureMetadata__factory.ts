/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IAdventureMetadata,
  IAdventureMetadataInterface,
} from "../IAdventureMetadata";

const _abi = [
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IAdventureMetadata__factory {
  static readonly abi = _abi;
  static createInterface(): IAdventureMetadataInterface {
    return new utils.Interface(_abi) as IAdventureMetadataInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAdventureMetadata {
    return new Contract(address, _abi, signerOrProvider) as IAdventureMetadata;
  }
}
