/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { AdventurerNFT, AdventurerNFTInterface } from "../AdventurerNFT";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "factory",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        name: "_objectId",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_isPathway",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_parentId",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isPathway",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "newTokenId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
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
    name: "objectId",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
    name: "parentId",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
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
    name: "totalSupply",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600b81526a1910dbdb5c185cdcd3919560aa1b6020808301918252835180850190945260088452671110d3d35413919560c21b908401528151919291620000659160009162000096565b5080516200007b90600190602084019062000096565b5050600d80546001600160a01b031916331790555062000179565b828054620000a4906200013c565b90600052602060002090601f016020900481019282620000c8576000855562000113565b82601f10620000e357805160ff191683800117855562000113565b8280016001018555821562000113579182015b8281111562000113578251825591602001919060010190620000f6565b506200012192915062000125565b5090565b5b8082111562000121576000815560010162000126565b600181811c908216806200015157607f821691505b602082108114156200017357634e487b7160e01b600052602260045260246000fd5b50919050565b6121d980620001896000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c80636352211e116100b8578063c45a01551161007c578063c45a01551461028b578063c87b56dd1461029e578063d3fc9864146102b1578063d4d5a06d146102c4578063e8879c45146102cc578063e985e9c5146102df57600080fd5b80636352211e1461023757806370a082311461024a57806395d89b411461025d578063a22cb46514610265578063b88d4fde1461027857600080fd5b8063186e811b1161010a578063186e811b146101d657806323b872dd146101de5780632f745c59146101f157806342842e0e146102045780634f6ccce714610217578063623903d21461022a57600080fd5b806301ffc9a71461014757806306fdde031461016f578063081812fc14610184578063095ea7b3146101af57806318160ddd146101c4575b600080fd5b61015a610155366004611d47565b61031b565b60405190151581526020015b60405180910390f35b61017761032c565b6040516101669190611f78565b610197610192366004611deb565b610363565b6040516001600160a01b039091168152602001610166565b6101c26101bd366004611cc2565b6103f0565b005b6009545b604051908152602001610166565b610177610506565b6101c26101ec366004611bcc565b610594565b6101c86101ff366004611cc2565b6105c5565b6101c2610212366004611bcc565b61065b565b6101c8610225366004611deb565b610676565b60105461015a9060ff1681565b610197610245366004611deb565b610709565b6101c8610258366004611b59565b610780565b610177610807565b6101c2610273366004611c8d565b610813565b6101c2610286366004611c0d565b610822565b600e54610197906001600160a01b031681565b6101776102ac366004611deb565b61085a565b6101c86102bf366004611cee565b610865565b610177610ae0565b6101c26102da366004611d81565b610aed565b61015a6102ed366004611b93565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b600061032682610bf7565b92915050565b60606000610338610c1c565b905080600f60405160200161034e929190611e7b565b60405160208183030381529060405291505090565b600061036e82610cae565b6103d45760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006103fb82610709565b9050806001600160a01b0316836001600160a01b031614156104695760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016103cb565b336001600160a01b0382161480610485575061048581336102ed565b6104f75760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016103cb565b6105018383610ccb565b505050565b601180546105139061209d565b80601f016020809104026020016040519081016040528092919081815260200182805461053f9061209d565b801561058c5780601f106105615761010080835404028352916020019161058c565b820191906000526020600020905b81548152906001019060200180831161056f57829003601f168201915b505050505081565b61059e3382610d39565b6105ba5760405162461bcd60e51b81526004016103cb90611fdd565b610501838383610e23565b60006105d083610780565b82106106325760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b60648201526084016103cb565b506001600160a01b03919091166000908152600760209081526040808320938352929052205490565b61050183838360405180602001604052806000815250610822565b600061068160095490565b82106106e45760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b60648201526084016103cb565b600982815481106106f7576106f7612149565b90600052602060002001549050919050565b6000818152600260205260408120546001600160a01b0316806103265760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016103cb565b60006001600160a01b0382166107eb5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016103cb565b506001600160a01b031660009081526003602052604090205490565b60606000610338610fca565b61081e338383610fd9565b5050565b61082c3383610d39565b6108485760405162461bcd60e51b81526004016103cb90611fdd565b610854848484846110a8565b50505050565b6060610326826110db565b6010546000908190606090829060ff161561092a57600e5460408051600481526024810182526020810180516001600160e01b0316632bd3b45160e11b17905290516001600160a01b03909216916108bd9190611e30565b6000604051808303816000865af19150503d80600081146108fa576040519150601f19603f3d011682016040523d82523d6000602084013e6108ff565b606091505b5090935091508261090f57600080fd5b818060200190518101906109239190611b76565b90506109d5565b600e5460408051600481526024810182526020810180516001600160e01b03166266af6760e01b17905290516001600160a01b039092169161096c9190611e30565b6000604051808303816000865af19150503d80600081146109a9576040519150601f19603f3d011682016040523d82523d6000602084013e6109ae565b606091505b509093509150826109be57600080fd5b818060200190518101906109d29190611b76565b90505b336001600160a01b03821614610a3c5760405162461bcd60e51b815260206004820152602660248201527f416476656e74757265724e4654203a20696e636f7272656374206d696e74206160448201526564647265737360d01b60648201526084016103cb565b85610a4688610780565b610a5190600161202e565b14610aaf5760405162461bcd60e51b815260206004820152602860248201527f416476656e747572654e4654203a206e6f7420616c6c6f77656420746f206d69604482015267373a1030b3b0b4b760c11b60648201526084016103cb565b610abd600c80546001019055565b600c549350610acc878561124a565b610ad68486611389565b5050509392505050565b600f80546105139061209d565b600b54610100900460ff16610b0857600b5460ff1615610b0c565b303b155b610b6f5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016103cb565b600b54610100900460ff16158015610b9157600b805461ffff19166101011790555b600e80546001600160a01b03191633179055600f80548190610bb29061209d565b610bbd92919061199a565b506010805460ff19168415151790558151610bdf906011906020850190611a25565b50801561085457600b805461ff001916905550505050565b60006001600160e01b0319821663780e9d6360e01b1480610326575061032682611414565b606060008054610c2b9061209d565b80601f0160208091040260200160405190810160405280929190818152602001828054610c579061209d565b8015610ca45780601f10610c7957610100808354040283529160200191610ca4565b820191906000526020600020905b815481529060010190602001808311610c8757829003601f168201915b5050505050905090565b6000908152600260205260409020546001600160a01b0316151590565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610d0082610709565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000610d4482610cae565b610da55760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016103cb565b6000610db083610709565b9050806001600160a01b0316846001600160a01b03161480610deb5750836001600160a01b0316610de084610363565b6001600160a01b0316145b80610e1b57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610e3682610709565b6001600160a01b031614610e9a5760405162461bcd60e51b815260206004820152602560248201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060448201526437bbb732b960d91b60648201526084016103cb565b6001600160a01b038216610efc5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103cb565b610f07838383611464565b610f12600082610ccb565b6001600160a01b0383166000908152600360205260408120805460019290610f3b90849061205a565b90915550506001600160a01b0382166000908152600360205260408120805460019290610f6990849061202e565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b606060018054610c2b9061209d565b816001600160a01b0316836001600160a01b0316141561103b5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103cb565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6110b3848484610e23565b6110bf8484848461146f565b6108545760405162461bcd60e51b81526004016103cb90611f8b565b60606110e682610cae565b61114c5760405162461bcd60e51b815260206004820152603160248201527f45524337323155524953746f726167653a2055524920717565727920666f72206044820152703737b732bc34b9ba32b73a103a37b5b2b760791b60648201526084016103cb565b600082815260066020526040812080546111659061209d565b80601f01602080910402602001604051908101604052809291908181526020018280546111919061209d565b80156111de5780601f106111b3576101008083540402835291602001916111de565b820191906000526020600020905b8154815290600101906020018083116111c157829003601f168201915b5050505050905060006111fc60408051602081019091526000815290565b905080516000141561120f575092915050565b815115611241578082604051602001611229929190611e4c565b60405160208183030381529060405292505050919050565b610e1b8461157c565b6001600160a01b0382166112a05760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016103cb565b6112a981610cae565b156112f65760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103cb565b61130260008383611464565b6001600160a01b038216600090815260036020526040812080546001929061132b90849061202e565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b61139282610cae565b6113f55760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b60648201526084016103cb565b6000828152600660209081526040909120825161050192840190611a25565b60006001600160e01b031982166380ac58cd60e01b148061144557506001600160e01b03198216635b5e139f60e01b145b8061032657506301ffc9a760e01b6001600160e01b0319831614610326565b610501838383611654565b60006001600160a01b0384163b1561157157604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906114b3903390899088908890600401611f3b565b602060405180830381600087803b1580156114cd57600080fd5b505af19250505080156114fd575060408051601f3d908101601f191682019092526114fa91810190611d64565b60015b611557573d80801561152b576040519150601f19603f3d011682016040523d82523d6000602084013e611530565b606091505b50805161154f5760405162461bcd60e51b81526004016103cb90611f8b565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610e1b565b506001949350505050565b606061158782610cae565b6115eb5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016103cb565b600061160260408051602081019091526000815290565b90506000815111611622576040518060200160405280600081525061164d565b8061162c8461170c565b60405160200161163d929190611e4c565b6040516020818303038152906040525b9392505050565b6001600160a01b0383166116af576116aa81600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b6116d2565b816001600160a01b0316836001600160a01b0316146116d2576116d2838261180a565b6001600160a01b0382166116e957610501816118a7565b826001600160a01b0316826001600160a01b031614610501576105018282611956565b6060816117305750506040805180820190915260018152600360fc1b602082015290565b8160005b811561175a5780611744816120d8565b91506117539050600a83612046565b9150611734565b60008167ffffffffffffffff8111156117755761177561215f565b6040519080825280601f01601f19166020018201604052801561179f576020820181803683370190505b5090505b8415610e1b576117b460018361205a565b91506117c1600a866120f3565b6117cc90603061202e565b60f81b8183815181106117e1576117e1612149565b60200101906001600160f81b031916908160001a905350611803600a86612046565b94506117a3565b6000600161181784610780565b611821919061205a565b600083815260086020526040902054909150808214611874576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b6009546000906118b99060019061205a565b6000838152600a6020526040812054600980549394509092849081106118e1576118e1612149565b90600052602060002001549050806009838154811061190257611902612149565b6000918252602080832090910192909255828152600a9091526040808220849055858252812055600980548061193a5761193a612133565b6001900381819060005260206000200160009055905550505050565b600061196183610780565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b8280546119a69061209d565b90600052602060002090601f0160209004810192826119c85760008555611a15565b82601f106119d95780548555611a15565b82800160010185558215611a1557600052602060002091601f016020900482015b82811115611a155782548255916001019190600101906119fa565b50611a21929150611a99565b5090565b828054611a319061209d565b90600052602060002090601f016020900481019282611a535760008555611a15565b82601f10611a6c57805160ff1916838001178555611a15565b82800160010185558215611a15579182015b82811115611a15578251825591602001919060010190611a7e565b5b80821115611a215760008155600101611a9a565b600067ffffffffffffffff80841115611ac957611ac961215f565b604051601f8501601f19908116603f01168101908282118183101715611af157611af161215f565b81604052809350858152868686011115611b0a57600080fd5b858560208301376000602087830101525050509392505050565b80358015158114611b3457600080fd5b919050565b600082601f830112611b4a57600080fd5b61164d83833560208501611aae565b600060208284031215611b6b57600080fd5b813561164d81612175565b600060208284031215611b8857600080fd5b815161164d81612175565b60008060408385031215611ba657600080fd5b8235611bb181612175565b91506020830135611bc181612175565b809150509250929050565b600080600060608486031215611be157600080fd5b8335611bec81612175565b92506020840135611bfc81612175565b929592945050506040919091013590565b60008060008060808587031215611c2357600080fd5b8435611c2e81612175565b93506020850135611c3e81612175565b925060408501359150606085013567ffffffffffffffff811115611c6157600080fd5b8501601f81018713611c7257600080fd5b611c8187823560208401611aae565b91505092959194509250565b60008060408385031215611ca057600080fd5b8235611cab81612175565b9150611cb960208401611b24565b90509250929050565b60008060408385031215611cd557600080fd5b8235611ce081612175565b946020939093013593505050565b600080600060608486031215611d0357600080fd5b8335611d0e81612175565b925060208401359150604084013567ffffffffffffffff811115611d3157600080fd5b611d3d86828701611b39565b9150509250925092565b600060208284031215611d5957600080fd5b813561164d8161218d565b600060208284031215611d7657600080fd5b815161164d8161218d565b600080600060608486031215611d9657600080fd5b833567ffffffffffffffff80821115611dae57600080fd5b611dba87838801611b39565b9450611dc860208701611b24565b93506040860135915080821115611dde57600080fd5b50611d3d86828701611b39565b600060208284031215611dfd57600080fd5b5035919050565b60008151808452611e1c816020860160208601612071565b601f01601f19169290920160200192915050565b60008251611e42818460208701612071565b9190910192915050565b60008351611e5e818460208801612071565b835190830190611e72818360208801612071565b01949350505050565b600083516020611e8e8285838901612071565b602d60f81b918401918252845460019060009080831c81841680611eb357607f821691505b858210811415611ed157634e487b7160e01b84526022600452602484fd5b808015611ee55760018114611efa57611f2b565b60ff1984168887015282880186019450611f2b565b60008b81526020902060005b84811015611f215781548a8201890152908701908801611f06565b5050858389010194505b50929a9950505050505050505050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611f6e90830184611e04565b9695505050505050565b60208152600061164d6020830184611e04565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6000821982111561204157612041612107565b500190565b6000826120555761205561211d565b500490565b60008282101561206c5761206c612107565b500390565b60005b8381101561208c578181015183820152602001612074565b838111156108545750506000910152565b600181811c908216806120b157607f821691505b602082108114156120d257634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156120ec576120ec612107565b5060010190565b6000826121025761210261211d565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461218a57600080fd5b50565b6001600160e01b03198116811461218a57600080fdfea2646970667358221220d4673be9c4d544fa6814d967ef6f57db110c854dcf60917cc745a1c7e2689f4a64736f6c63430008070033";

type AdventurerNFTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AdventurerNFTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AdventurerNFT__factory extends ContractFactory {
  constructor(...args: AdventurerNFTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "AdventurerNFT";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AdventurerNFT> {
    return super.deploy(overrides || {}) as Promise<AdventurerNFT>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AdventurerNFT {
    return super.attach(address) as AdventurerNFT;
  }
  connect(signer: Signer): AdventurerNFT__factory {
    return super.connect(signer) as AdventurerNFT__factory;
  }
  static readonly contractName: "AdventurerNFT";
  public readonly contractName: "AdventurerNFT";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AdventurerNFTInterface {
    return new utils.Interface(_abi) as AdventurerNFTInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AdventurerNFT {
    return new Contract(address, _abi, signerOrProvider) as AdventurerNFT;
  }
}
