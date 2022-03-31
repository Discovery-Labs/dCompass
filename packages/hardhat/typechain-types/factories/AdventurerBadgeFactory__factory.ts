/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  AdventurerBadgeFactory,
  AdventurerBadgeFactoryInterface,
} from "../AdventurerBadgeFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_dCompERC721TokenImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_projectNFTAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pathwayNFTAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_badgeNFTAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_appDiamond",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    name: "allAddrsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "appDiamond",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "badgeNFTAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "objectId",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isPathway",
        type: "bool",
      },
      {
        internalType: "string",
        name: "parentId",
        type: "string",
      },
    ],
    name: "createNFTToken",
    outputs: [
      {
        internalType: "address",
        name: "newToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dCompERC721TokenImplementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllAddrs",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getAllUserBadges",
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
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "getNFTAddrs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "getType",
    outputs: [
      {
        internalType: "enum AdventurerBadgeFactory.ObjectType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "parentIdPerObjectId",
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
    name: "pathwayNFTAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projectNFTAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "_questOrPathwayId",
        type: "string",
      },
    ],
    name: "setUserInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "typeStrings",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userBadgeNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userBadgesByIndex",
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

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200138038038062001380833981016040819052620000349162000265565b6200003f3362000152565b600180546001600160a01b03199081166001600160a01b038881169190911790925560028054821687841617905560038054821686841617905560048054821685841617905560058054909116918316919091179055604080518082019091526007808252665061746877617960c81b602080840191825260008052919091529051620000ee917f6d5257204ebe7d88fd91ae87941cb2dd9d8062b64ae5a2bd2d28ec40b9fbf6df91620001a2565b50604080518082019091526005815264426164676560d81b6020808301918252600160005260079052905162000146917fb39221ace053465ec3453ce2b36430bd138b997ecea25c1043da0c366812b82891620001a2565b50505050505062000312565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054620001b090620002d5565b90600052602060002090601f016020900481019282620001d457600085556200021f565b82601f10620001ef57805160ff19168380011785556200021f565b828001600101855582156200021f579182015b828111156200021f57825182559160200191906001019062000202565b506200022d92915062000231565b5090565b5b808211156200022d576000815560010162000232565b80516001600160a01b03811681146200026057600080fd5b919050565b600080600080600060a086880312156200027e57600080fd5b620002898662000248565b9450620002996020870162000248565b9350620002a96040870162000248565b9250620002b96060870162000248565b9150620002c96080870162000248565b90509295509295909350565b600181811c90821680620002ea57607f821691505b602082108114156200030c57634e487b7160e01b600052602260045260246000fd5b50919050565b61105e80620003226000396000f3fe608060405234801561001057600080fd5b50600436106101205760003560e01c8063715018a6116100ad578063985ba97f11610071578063985ba97f1461027d578063b6342e48146102b8578063c25bd1a5146102cb578063cc01d209146102de578063f2fde38b146102f157600080fd5b8063715018a61461021c5780638a9ba3df146102265780638da5cb5b1461024657806390cc0f0f1461025757806395d787a01461026a57600080fd5b80633a4b479d116100f45780633a4b479d1461019a57806347d61101146101ad5780634b281eb3146101e15780635255124d146101f657806357a768a21461020957600080fd5b806266af6714610125578063100deec91461015557806316efb47d14610168578063174dd28e14610188575b600080fd5b600454610138906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b600154610138906001600160a01b031681565b61017b610176366004610d45565b610304565b60405161014c9190610f1e565b600c545b60405190815260200161014c565b61017b6101a8366004610bf9565b61039e565b6101386101bb366004610c93565b80516020818301810180516009825292820191909301209152546001600160a01b031681565b6101e9610464565b60405161014c9190610ea9565b61017b610204366004610c69565b6104c6565b600354610138906001600160a01b031681565b6102246104ea565b005b61018c610234366004610bf9565b600b6020526000908152604090205481565b6000546001600160a01b0316610138565b600254610138906001600160a01b031681565b610138610278366004610cc8565b610550565b6102ab61028b366004610c93565b805160208183018101805160068252928201919093012091525460ff1681565b60405161014c9190610ef6565b61017b6102c6366004610c93565b6107fd565b600554610138906001600160a01b031681565b6102246102ec366004610c1b565b610821565b6102246102ff366004610bf9565b6108f6565b6007602052600090815260409020805461031d90610f98565b80601f016020809104026020016040519081016040528092919081815260200182805461034990610f98565b80156103965780601f1061036b57610100808354040283529160200191610396565b820191906000526020600020905b81548152906001019060200180831161037957829003601f168201915b505050505081565b6001600160a01b0381166000908152600b6020526040902054606090806103f85760405162461bcd60e51b81526020600482015260096024820152686e6f2062616467657360b81b60448201526064015b60405180910390fd5b600160605b82821161045c576001600160a01b0385166000908152600a602090815260408083208584528252918290209151610438928492909101610de4565b6040516020818303038152906040529050818061045490610fd3565b9250506103fd565b949350505050565b6060600c8054806020026020016040519081016040528092919081815260200182805480156104bc57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161049e575b5050505050905090565b600a6020908152600092835260408084209091529082529020805461031d90610f98565b6000546001600160a01b031633146105445760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103ef565b61054e60006109c1565b565b6003546000906001600160a01b031633148061057657506004546001600160a01b031633145b6105c25760405162461bcd60e51b815260206004820152601a60248201527f64436f6d70466163746f72793a2057524f4e475f53454e44455200000000000060448201526064016103ef565b60006001600160a01b03166009856040516105dd9190610d8a565b908152604051908190036020019020546001600160a01b0316146106435760405162461bcd60e51b815260206004820152601a60248201527f64436f6d70466163746f72793a20544f4b454e5f45584953545300000000000060448201526064016103ef565b600084848460405160200161065a93929190610da6565b60405160208183030381529060405280519060200120905083156106bc57600060068660405161068a9190610d8a565b908152604051908190036020019020805460ff1916600183818111156106b2576106b2610ffc565b02179055506106fc565b60016006866040516106ce9190610d8a565b908152604051908190036020019020805460ff1916600183818111156106f6576106f6610ffc565b02179055505b600154610712906001600160a01b031682610a11565b60405163e8879c4560e01b81529092506001600160a01b0383169063e8879c459061074590889088908890600401610f31565b600060405180830381600087803b15801561075f57600080fd5b505af1158015610773573d6000803e3d6000fd5b50505050816009866040516107889190610d8a565b90815260405190819003602001902080546001600160a01b039283166001600160a01b031991821617909155600c80546001810182556000919091527fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c701805492851692909116919091179055509392505050565b80516020818301810180516008825292820191909301209152805461031d90610f98565b6003546001600160a01b031633148061084457506004546001600160a01b031633145b6108905760405162461bcd60e51b815260206004820152601a60248201527f64436f6d70466163746f72793a2057524f4e475f53454e44455200000000000060448201526064016103ef565b6001600160a01b0382166000908152600b602052604081208054916108b483610fd3565b90915550506001600160a01b0382166000908152600a60209081526040808320600b8352818420548452825290912082516108f192840190610ab7565b505050565b6000546001600160a01b031633146109505760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103ef565b6001600160a01b0381166109b55760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103ef565b6109be816109c1565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528360601b60148201526e5af43d82803e903d91602b57fd5bf360881b6028820152826037826000f59150506001600160a01b038116610ab15760405162461bcd60e51b815260206004820152601760248201527f455243313136373a2063726561746532206661696c656400000000000000000060448201526064016103ef565b92915050565b828054610ac390610f98565b90600052602060002090601f016020900481019282610ae55760008555610b2b565b82601f10610afe57805160ff1916838001178555610b2b565b82800160010185558215610b2b579182015b82811115610b2b578251825591602001919060010190610b10565b50610b37929150610b3b565b5090565b5b80821115610b375760008155600101610b3c565b80356001600160a01b0381168114610b6757600080fd5b919050565b600082601f830112610b7d57600080fd5b813567ffffffffffffffff80821115610b9857610b98611012565b604051601f8301601f19908116603f01168101908282118183101715610bc057610bc0611012565b81604052838152866020858801011115610bd957600080fd5b836020870160208301376000602085830101528094505050505092915050565b600060208284031215610c0b57600080fd5b610c1482610b50565b9392505050565b60008060408385031215610c2e57600080fd5b610c3783610b50565b9150602083013567ffffffffffffffff811115610c5357600080fd5b610c5f85828601610b6c565b9150509250929050565b60008060408385031215610c7c57600080fd5b610c8583610b50565b946020939093013593505050565b600060208284031215610ca557600080fd5b813567ffffffffffffffff811115610cbc57600080fd5b61045c84828501610b6c565b600080600060608486031215610cdd57600080fd5b833567ffffffffffffffff80821115610cf557600080fd5b610d0187838801610b6c565b9450602086013591508115158214610d1857600080fd5b90925060408501359080821115610d2e57600080fd5b50610d3b86828701610b6c565b9150509250925092565b600060208284031215610d5757600080fd5b5035919050565b60008151808452610d76816020860160208601610f68565b601f01601f19169290920160200192915050565b60008251610d9c818460208701610f68565b9190910192915050565b60008451610db8818460208901610f68565b84151560f81b9083019081528351610dd7816001840160208801610f68565b0160010195945050505050565b600083516020610df78285838901610f68565b615f5f60f01b9184019182528454600290600090600181811c9080831680610e2057607f831692505b868310811415610e3e57634e487b7160e01b85526022600452602485fd5b808015610e525760018114610e6757610e98565b60ff1985168988015283890187019550610e98565b60008c81526020902060005b85811015610e8e5781548b82018a0152908401908901610e73565b505086848a010195505b50939b9a5050505050505050505050565b6020808252825182820181905260009190848201906040850190845b81811015610eea5783516001600160a01b031683529284019291840191600101610ec5565b50909695505050505050565b6020810160028310610f1857634e487b7160e01b600052602160045260246000fd5b91905290565b602081526000610c146020830184610d5e565b606081526000610f446060830186610d5e565b84151560208401528281036040840152610f5e8185610d5e565b9695505050505050565b60005b83811015610f83578181015183820152602001610f6b565b83811115610f92576000848401525b50505050565b600181811c90821680610fac57607f821691505b60208210811415610fcd57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415610ff557634e487b7160e01b600052601160045260246000fd5b5060010190565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea2646970667358221220d8edb194bbdd7f4c03f3d2960b778e7be7c5081742c67b318f8d9f1d3e93aab264736f6c63430008070033";

type AdventurerBadgeFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AdventurerBadgeFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AdventurerBadgeFactory__factory extends ContractFactory {
  constructor(...args: AdventurerBadgeFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "AdventurerBadgeFactory";
  }

  deploy(
    _dCompERC721TokenImplementation: string,
    _projectNFTAddress: string,
    _pathwayNFTAddress: string,
    _badgeNFTAddress: string,
    _appDiamond: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AdventurerBadgeFactory> {
    return super.deploy(
      _dCompERC721TokenImplementation,
      _projectNFTAddress,
      _pathwayNFTAddress,
      _badgeNFTAddress,
      _appDiamond,
      overrides || {}
    ) as Promise<AdventurerBadgeFactory>;
  }
  getDeployTransaction(
    _dCompERC721TokenImplementation: string,
    _projectNFTAddress: string,
    _pathwayNFTAddress: string,
    _badgeNFTAddress: string,
    _appDiamond: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _dCompERC721TokenImplementation,
      _projectNFTAddress,
      _pathwayNFTAddress,
      _badgeNFTAddress,
      _appDiamond,
      overrides || {}
    );
  }
  attach(address: string): AdventurerBadgeFactory {
    return super.attach(address) as AdventurerBadgeFactory;
  }
  connect(signer: Signer): AdventurerBadgeFactory__factory {
    return super.connect(signer) as AdventurerBadgeFactory__factory;
  }
  static readonly contractName: "AdventurerBadgeFactory";
  public readonly contractName: "AdventurerBadgeFactory";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AdventurerBadgeFactoryInterface {
    return new utils.Interface(_abi) as AdventurerBadgeFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AdventurerBadgeFactory {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as AdventurerBadgeFactory;
  }
}