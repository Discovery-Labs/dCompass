/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  DiamondInit,
  DiamondInitInterface,
} from "../../../contracts/upgradeInitializers/DiamondInit";

const _abi = [
  {
    inputs: [],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610149806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e1c7392a14610030575b600080fd5b6101117f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667b6020527feb2f0faa9f58b368f5bc8732fb87496c66caf4486126d13f076858cb93e7e3728054600160ff1991821681179092557f1a7ba4f5e5e2201ae53e896dd7a98c428430d83c215ad3fb1b1ddb23f66e65d680548216831790557ff8d38f5e5407a66e917f154061d70ab6363752adc0555b44f27dfc3b4a48252f80548216831790556307f5828d60e41b6000527fc85ff13a5333fe235befb7a3c2bf15e1e1ba70076230de51f579cd7bc553532b80549091169091179055565b00fea26469706673582212209f2ed38189ec40f8841037f0c12962b5e1dbd9c2989e4bae96bbd65816e6a2ff64736f6c63430008070033";

type DiamondInitConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondInitConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DiamondInit__factory extends ContractFactory {
  constructor(...args: DiamondInitConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DiamondInit> {
    return super.deploy(overrides || {}) as Promise<DiamondInit>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DiamondInit {
    return super.attach(address) as DiamondInit;
  }
  override connect(signer: Signer): DiamondInit__factory {
    return super.connect(signer) as DiamondInit__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondInitInterface {
    return new utils.Interface(_abi) as DiamondInitInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondInit {
    return new Contract(address, _abi, signerOrProvider) as DiamondInit;
  }
}
