/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OwnershipFacet,
  OwnershipFacetInterface,
} from "../OwnershipFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610248806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80638da5cb5b1461003b578063f2fde38b1461005f575b600080fd5b610043610074565b6040516001600160a01b03909116815260200160405180910390f35b61007261006d3660046101e2565b6100ac565b005b60006100a77f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667c546001600160a01b031690565b905090565b6100b46100c0565b6100bd8161014d565b50565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f0036566679600301546001600160a01b0316331461014b5760405162461bcd60e51b815260206004820152602260248201527f4c69624469616d6f6e643a204d75737420626520636f6e7472616374206f776e60448201526132b960f11b606482015260840160405180910390fd5b565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667c80546001600160a01b031981166001600160a01b038481169182179093556040517f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f0036566679939092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b6000602082840312156101f457600080fd5b81356001600160a01b038116811461020b57600080fd5b939250505056fea26469706673582212201b90cc93e583c7cb30a9e2b2210be10a6a92729272547aa90ef3b5dbb95bab4164736f6c63430008070033";

type OwnershipFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OwnershipFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OwnershipFacet__factory extends ContractFactory {
  constructor(...args: OwnershipFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "OwnershipFacet";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OwnershipFacet> {
    return super.deploy(overrides || {}) as Promise<OwnershipFacet>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): OwnershipFacet {
    return super.attach(address) as OwnershipFacet;
  }
  connect(signer: Signer): OwnershipFacet__factory {
    return super.connect(signer) as OwnershipFacet__factory;
  }
  static readonly contractName: "OwnershipFacet";
  public readonly contractName: "OwnershipFacet";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OwnershipFacetInterface {
    return new utils.Interface(_abi) as OwnershipFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OwnershipFacet {
    return new Contract(address, _abi, signerOrProvider) as OwnershipFacet;
  }
}
