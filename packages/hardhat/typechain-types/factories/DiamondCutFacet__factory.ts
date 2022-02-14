/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  DiamondCutFacet,
  DiamondCutFacetInterface,
} from "../DiamondCutFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        indexed: false,
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "DiamondCut",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamondCut.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondCut.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "_init",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "diamondCut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611448806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80631f931c1c14610030575b600080fd5b61004361003e366004610e6b565b610045565b005b61004d61009e565b61009761005a8587611148565b8484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061011a92505050565b5050505050565b60008051602061137f833981519152600301546001600160a01b031633146101185760405162461bcd60e51b815260206004820152602260248201527f4c69624469616d6f6e643a204d75737420626520636f6e7472616374206f776e60448201526132b960f11b60648201526084015b60405180910390fd5b565b60005b83518110156102e357600084828151811061013a5761013a611352565b60200260200101516020015190506000600281111561015b5761015b611326565b81600281111561016d5761016d611326565b14156101bc576101b785838151811061018857610188611352565b6020026020010151600001518684815181106101a6576101a6611352565b60200260200101516040015161032e565b6102d0565b60018160028111156101d0576101d0611326565b141561021a576101b78583815181106101eb576101eb611352565b60200260200101516000015186848151811061020957610209611352565b60200260200101516040015161058d565b600281600281111561022e5761022e611326565b1415610278576101b785838151811061024957610249611352565b60200260200101516000015186848151811061026757610267611352565b602002602001015160400151610856565b60405162461bcd60e51b815260206004820152602760248201527f4c69624469616d6f6e644375743a20496e636f727265637420466163657443756044820152663a20b1ba34b7b760c91b606482015260840161010f565b50806102db816112f5565b91505061011d565b507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb67383838360405161031793929190610f65565b60405180910390a16103298282610bd8565b505050565b600081511161034f5760405162461bcd60e51b815260040161010f9061107f565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667a5460008051602061137f833981519152906001600160a01b0384166103ec5760405162461bcd60e51b815260206004820152602c60248201527f4c69624469616d6f6e644375743a204164642066616365742063616e2774206260448201526b65206164647265737328302960a01b606482015260840161010f565b61040e8460405180606001604052806024815260200161139f60249139610de5565b60005b835181101561009757600084828151811061042e5761042e611352565b6020908102919091018101516001600160e01b031981166000908152918690526040909120549091506001600160a01b031680156104cc5760405162461bcd60e51b815260206004820152603560248201527f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f6044820152746e207468617420616c72656164792065786973747360581b606482015260840161010f565b6040805180820182526001600160a01b03808a16825261ffff80881660208085019182526001600160e01b0319881660009081528b8252958620945185549251909316600160a01b026001600160b01b0319909216929093169190911717909155600180880180549182018155835291206008820401805460e085901c60046007909416939093026101000a92830263ffffffff909302191691909117905583610575816112d3565b94505050508080610585906112f5565b915050610411565b60008151116105ae5760405162461bcd60e51b815260040161010f9061107f565b60008051602061137f8339815191526001600160a01b03831661062c5760405162461bcd60e51b815260206004820152603060248201527f4c69624469616d6f6e644375743a205265706c6163652066616365742063616e60448201526f2774206265206164647265737328302960801b606482015260840161010f565b61064e836040518060600160405280602881526020016113eb60289139610de5565b60005b825181101561085057600083828151811061066e5761066e611352565b6020908102919091018101516001600160e01b031981166000908152918590526040909120549091506001600160a01b0316308114156107085760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e2774207265706c61636520696d6d60448201526e3aba30b1363290333ab731ba34b7b760891b606482015260840161010f565b856001600160a01b0316816001600160a01b031614156107905760405162461bcd60e51b815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e20776974682073616d652066756e6374696f6e0000000000000000606482015260840161010f565b6001600160a01b03811661080c5760405162461bcd60e51b815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e207468617420646f65736e27742065786973740000000000000000606482015260840161010f565b506001600160e01b031916600090815260208390526040902080546001600160a01b0319166001600160a01b03861617905580610848816112f5565b915050610651565b50505050565b60008151116108775760405162461bcd60e51b815260040161010f9061107f565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667a5460008051602061137f833981519152906001600160a01b0384161561091f5760405162461bcd60e51b815260206004820152603660248201527f4c69624469616d6f6e644375743a2052656d6f76652066616365742061646472604482015275657373206d757374206265206164647265737328302960501b606482015260840161010f565b60005b835181101561009757600084828151811061093f5761093f611352565b6020908102919091018101516001600160e01b0319811660009081528683526040908190208151808301909252546001600160a01b038116808352600160a01b90910461ffff169382019390935290925090610a035760405162461bcd60e51b815260206004820152603760248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360448201527f74696f6e207468617420646f65736e2774206578697374000000000000000000606482015260840161010f565b80516001600160a01b0316301415610a755760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560448201526e3a30b1363290333ab731ba34b7b71760891b606482015260840161010f565b83610a7f816112bc565b94505083816020015161ffff1614610b5d576000856001018581548110610aa857610aa8611352565b90600052602060002090600891828204019190066004029054906101000a900460e01b90508086600101836020015161ffff1681548110610aeb57610aeb611352565b600091825260208083206008830401805463ffffffff60079094166004026101000a938402191660e09590951c92909202939093179055838201516001600160e01b03199390931681529087905260409020805461ffff60a01b1916600160a01b61ffff909316929092029190911790555b84600101805480610b7057610b7061133c565b60008281526020808220600860001990940193840401805463ffffffff600460078716026101000a0219169055919092556001600160e01b0319909316815291859052506040902080546001600160b01b031916905580610bd0816112f5565b915050610922565b6001600160a01b038216610c5f57805115610c5b5760405162461bcd60e51b815260206004820152603c60248201527f4c69624469616d6f6e644375743a205f696e697420697320616464726573732860448201527f3029206275745f63616c6c64617461206973206e6f7420656d70747900000000606482015260840161010f565b5050565b6000815111610cd65760405162461bcd60e51b815260206004820152603d60248201527f4c69624469616d6f6e644375743a205f63616c6c6461746120697320656d707460448201527f7920627574205f696e6974206973206e6f742061646472657373283029000000606482015260840161010f565b6001600160a01b0382163014610d0857610d08826040518060600160405280602881526020016113c360289139610de5565b600080836001600160a01b031683604051610d239190610f49565b600060405180830381855af49150503d8060008114610d5e576040519150601f19603f3d011682016040523d82523d6000602084013e610d63565b606091505b50915091508161085057805115610d8e578060405162461bcd60e51b815260040161010f9190611065565b60405162461bcd60e51b815260206004820152602660248201527f4c69624469616d6f6e644375743a205f696e69742066756e6374696f6e2072656044820152651d995c9d195960d21b606482015260840161010f565b813b81816108505760405162461bcd60e51b815260040161010f9190611065565b80356001600160a01b0381168114610e1d57600080fd5b919050565b60008083601f840112610e3457600080fd5b50813567ffffffffffffffff811115610e4c57600080fd5b602083019150836020828501011115610e6457600080fd5b9250929050565b600080600080600060608688031215610e8357600080fd5b853567ffffffffffffffff80821115610e9b57600080fd5b818801915088601f830112610eaf57600080fd5b813581811115610ebe57600080fd5b8960208260051b8501011115610ed357600080fd5b60208301975080965050610ee960208901610e06565b94506040880135915080821115610eff57600080fd5b50610f0c88828901610e22565b969995985093965092949392505050565b60008151808452610f35816020860160208601611290565b601f01601f19169290920160200192915050565b60008251610f5b818460208701611290565b9190910192915050565b60006060808301818452808751808352608092508286019150828160051b8701016020808b0160005b8481101561103557898403607f19018652815180516001600160a01b03168552838101518986019060038110610fd457634e487b7160e01b600052602160045260246000fd5b868601526040918201519186018a905281519081905290840190600090898701905b808310156110205783516001600160e01b0319168252928601926001929092019190860190610ff6565b50978501979550505090820190600101610f8e565b50506001600160a01b038a169088015286810360408801526110578189610f1d565b9a9950505050505050505050565b6020815260006110786020830184610f1d565b9392505050565b6020808252602b908201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660408201526a1858d95d081d1bc818dd5d60aa1b606082015260800190565b6040516060810167ffffffffffffffff811182821017156110ed576110ed611368565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561111c5761111c611368565b604052919050565b600067ffffffffffffffff82111561113e5761113e611368565b5060051b60200190565b600061115b61115684611124565b6110f3565b838152602080820191908460053688821b8301111561117957600080fd5b60005b8881101561128357823567ffffffffffffffff8082111561119c57600080fd5b818a019150606082360312156111b157600080fd5b6111b96110ca565b6111c283610e06565b815286830135600381106111d557600080fd5b81880152604083810135838111156111ec57600080fd5b939093019236601f85011261120057600080fd5b8335925061121061115684611124565b83815288810190858a0136868a1b88018c01111561122d57600080fd5b600096505b858710156112665780356001600160e01b03198116811461125257600080fd5b835260019690960195918a01918a01611232565b50918301919091525088525050948301949183019160010161117c565b5092979650505050505050565b60005b838110156112ab578181015183820152602001611293565b838111156108505750506000910152565b6000816112cb576112cb611310565b506000190190565b600061ffff808316818114156112eb576112eb611310565b6001019392505050565b600060001982141561130957611309611310565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fdfe1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f00365666794c69624469616d6f6e644375743a2041646420666163657420686173206e6f20636f64654c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e644375743a205265706c61636520666163657420686173206e6f20636f6465a26469706673582212203e9969b0dd9eec223523a07f52ee6da2f1566aea6086f75eb6360094a39da97564736f6c63430008070033";

type DiamondCutFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondCutFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DiamondCutFacet__factory extends ContractFactory {
  constructor(...args: DiamondCutFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "DiamondCutFacet";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DiamondCutFacet> {
    return super.deploy(overrides || {}) as Promise<DiamondCutFacet>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DiamondCutFacet {
    return super.attach(address) as DiamondCutFacet;
  }
  connect(signer: Signer): DiamondCutFacet__factory {
    return super.connect(signer) as DiamondCutFacet__factory;
  }
  static readonly contractName: "DiamondCutFacet";
  public readonly contractName: "DiamondCutFacet";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondCutFacetInterface {
    return new utils.Interface(_abi) as DiamondCutFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondCutFacet {
    return new Contract(address, _abi, signerOrProvider) as DiamondCutFacet;
  }
}
