/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { LibBadge, LibBadgeInterface } from "../LibBadge";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousController",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "ControlTransferred",
    type: "event",
  },
];

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220cd409545b5ad8420fff229abc28a112d520691ce3bc61aca678b4ca1af7206df64736f6c63430008070033";

type LibBadgeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LibBadgeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LibBadge__factory extends ContractFactory {
  constructor(...args: LibBadgeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "LibBadge";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LibBadge> {
    return super.deploy(overrides || {}) as Promise<LibBadge>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LibBadge {
    return super.attach(address) as LibBadge;
  }
  connect(signer: Signer): LibBadge__factory {
    return super.connect(signer) as LibBadge__factory;
  }
  static readonly contractName: "LibBadge";
  public readonly contractName: "LibBadge";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LibBadgeInterface {
    return new utils.Interface(_abi) as LibBadgeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibBadge {
    return new Contract(address, _abi, signerOrProvider) as LibBadge;
  }
}
