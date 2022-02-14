/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ProjectDiamond,
  ProjectDiamondInterface,
} from "../ProjectDiamond";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_contractOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_diamondCutFacet",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_appApproval",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_projectSigningAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "_projectNFTAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pathwayNFTAddr",
        type: "address",
      },
      {
        internalType: "string",
        name: "_projectId",
        type: "string",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_pathwayId",
        type: "string",
      },
    ],
    name: "addPathwayId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405260405162002bd638038062002bd68339810160408190526200002691620011ee565b6200003c876200017560201b620001ba1760201c565b620000568585858585620001f960201b6200023d1760201c565b604080516001808252818301909252600091816020015b604080516060808201835260008083526020830152918101919091528152602001906001900390816200006d5750506040805160018082528183019092529192506000919060208083019080368337019050509050631f931c1c60e01b81600081518110620000e057620000e062001599565b6001600160e01b031990921660209283029190910182015260408051606081019091526001600160a01b038a16815290810160008152602001828152508260008151811062000133576200013362001599565b602002602001018190525062000166826000604051806020016040528060008152506200030f60201b620003501760201c565b505050505050505050620015c5565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667c80546001600160a01b031981166001600160a01b0384811691821790935560405160008051602062002b22833981519152939092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f0036566683805460ff19168615151790557f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667e80546001600160a01b03199081166001600160a01b03878116919091179092557f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667f805482168684161790557f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f00365666808054909116918416919091179055805160008051602062002b228339815191529062000306907f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f00365666819060208501906200112b565b50505050505050565b60005b83518110156200051e57600084828151811062000333576200033362001599565b6020026020010151602001519050600060028111156200035757620003576200156d565b8160028111156200036c576200036c6200156d565b1415620003cb57620003c58583815181106200038c576200038c62001599565b602002602001015160000151868481518110620003ad57620003ad62001599565b6020026020010151604001516200056d60201b60201c565b62000508565b6001816002811115620003e257620003e26200156d565b14156200043b57620003c585838151811062000402576200040262001599565b60200260200101516000015186848151811062000423576200042362001599565b6020026020010151604001516200082160201b60201c565b60028160028111156200045257620004526200156d565b1415620004ab57620003c585838151811062000472576200047262001599565b60200260200101516000015186848151811062000493576200049362001599565b60200260200101516040015162000b1060201b60201c565b60405162461bcd60e51b815260206004820152602760248201527f4c69624469616d6f6e644375743a20496e636f727265637420466163657443756044820152663a20b1ba34b7b760c91b60648201526084015b60405180910390fd5b5080620005158162001539565b91505062000312565b507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb67383838360405162000554939291906200136b565b60405180910390a162000568828262000ee8565b505050565b6000815111620005c35760405162461bcd60e51b815260206004820152602b602482015260008051602062002bb683398151915260448201526a1858d95d081d1bc818dd5d60aa1b6064820152608401620004ff565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667a5460008051602062002b22833981519152906001600160a01b038416620006635760405162461bcd60e51b815260206004820152602c60248201527f4c69624469616d6f6e644375743a204164642066616365742063616e2774206260448201526b65206164647265737328302960a01b6064820152608401620004ff565b620006888460405180606001604052806024815260200162002b426024913962001107565b60005b83518110156200081a576000848281518110620006ac57620006ac62001599565b6020908102919091018101516001600160e01b031981166000908152918690526040909120549091506001600160a01b03168015620007545760405162461bcd60e51b815260206004820152603560248201527f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f60448201527f6e207468617420616c72656164792065786973747300000000000000000000006064820152608401620004ff565b6040805180820182526001600160a01b03808a16825261ffff80881660208085019182526001600160e01b0319881660009081528b8252958620945185549251909316600160a01b026001600160b01b0319909216929093169190911717909155600180880180549182018155835291206008820401805460e085901c60046007909416939093026101000a92830263ffffffff909302191691909117905583620007ff8162001514565b94505050508080620008119062001539565b9150506200068b565b5050505050565b6000815111620008775760405162461bcd60e51b815260206004820152602b602482015260008051602062002bb683398151915260448201526a1858d95d081d1bc818dd5d60aa1b6064820152608401620004ff565b60008051602062002b228339815191526001600160a01b038316620008f85760405162461bcd60e51b815260206004820152603060248201527f4c69624469616d6f6e644375743a205265706c6163652066616365742063616e60448201526f2774206265206164647265737328302960801b6064820152608401620004ff565b6200091d8360405180606001604052806028815260200162002b8e6028913962001107565b60005b825181101562000b0a57600083828151811062000941576200094162001599565b6020908102919091018101516001600160e01b031981166000908152918590526040909120549091506001600160a01b031630811415620009dd5760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e2774207265706c61636520696d6d60448201526e3aba30b1363290333ab731ba34b7b760891b6064820152608401620004ff565b856001600160a01b0316816001600160a01b0316141562000a565760405162461bcd60e51b8152602060048201526038602482015260008051602062002b0283398151915260448201527f6374696f6e20776974682073616d652066756e6374696f6e00000000000000006064820152608401620004ff565b6001600160a01b03811662000ac35760405162461bcd60e51b8152602060048201526038602482015260008051602062002b0283398151915260448201527f6374696f6e207468617420646f65736e277420657869737400000000000000006064820152608401620004ff565b506001600160e01b031916600090815260208390526040902080546001600160a01b0319166001600160a01b0386161790558062000b018162001539565b91505062000920565b50505050565b600081511162000b665760405162461bcd60e51b815260206004820152602b602482015260008051602062002bb683398151915260448201526a1858d95d081d1bc818dd5d60aa1b6064820152608401620004ff565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667a5460008051602062002b22833981519152906001600160a01b0384161562000c185760405162461bcd60e51b815260206004820152603660248201527f4c69624469616d6f6e644375743a2052656d6f7665206661636574206164647260448201527f657373206d7573742062652061646472657373283029000000000000000000006064820152608401620004ff565b60005b83518110156200081a57600084828151811062000c3c5762000c3c62001599565b6020908102919091018101516001600160e01b0319811660009081528683526040908190208151808301909252546001600160a01b038116808352600160a01b90910461ffff16938201939093529092509062000d025760405162461bcd60e51b815260206004820152603760248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360448201527f74696f6e207468617420646f65736e27742065786973740000000000000000006064820152608401620004ff565b80516001600160a01b031630141562000d765760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560448201526e3a30b1363290333ab731ba34b7b71760891b6064820152608401620004ff565b8362000d8281620014bd565b94505083816020015161ffff161462000e6757600085600101858154811062000daf5762000daf62001599565b90600052602060002090600891828204019190066004029054906101000a900460e01b90508086600101836020015161ffff168154811062000df55762000df562001599565b600091825260208083206008830401805463ffffffff60079094166004026101000a938402191660e09590951c92909202939093179055838201516001600160e01b03199390931681529087905260409020805461ffff60a01b1916600160a01b61ffff909316929092029190911790555b8460010180548062000e7d5762000e7d62001583565b60008281526020808220600860001990940193840401805463ffffffff600460078716026101000a0219169055919092556001600160e01b0319909316815291859052506040902080546001600160b01b03191690558062000edf8162001539565b91505062000c1b565b6001600160a01b03821662000f725780511562000f6e5760405162461bcd60e51b815260206004820152603c60248201527f4c69624469616d6f6e644375743a205f696e697420697320616464726573732860448201527f3029206275745f63616c6c64617461206973206e6f7420656d707479000000006064820152608401620004ff565b5050565b600081511162000feb5760405162461bcd60e51b815260206004820152603d60248201527f4c69624469616d6f6e644375743a205f63616c6c6461746120697320656d707460448201527f7920627574205f696e6974206973206e6f7420616464726573732830290000006064820152608401620004ff565b6001600160a01b03821630146200102157620010218260405180606001604052806028815260200162002b666028913962001107565b600080836001600160a01b0316836040516200103e91906200134d565b600060405180830381855af49150503d80600081146200107b576040519150601f19603f3d011682016040523d82523d6000602084013e62001080565b606091505b50915091508162000b0a57805115620010af578060405162461bcd60e51b8152600401620004ff919062001472565b60405162461bcd60e51b815260206004820152602660248201527f4c69624469616d6f6e644375743a205f696e69742066756e6374696f6e2072656044820152651d995c9d195960d21b6064820152608401620004ff565b813b818162000b0a5760405162461bcd60e51b8152600401620004ff919062001472565b8280546200113990620014d7565b90600052602060002090601f0160209004810192826200115d5760008555620011a8565b82601f106200117857805160ff1916838001178555620011a8565b82800160010185558215620011a8579182015b82811115620011a85782518255916020019190600101906200118b565b50620011b6929150620011ba565b5090565b5b80821115620011b65760008155600101620011bb565b80516001600160a01b0381168114620011e957600080fd5b919050565b600080600080600080600060e0888a0312156200120a57600080fd5b6200121588620011d1565b96506200122560208901620011d1565b9550604088015180151581146200123b57600080fd5b94506200124b60608901620011d1565b93506200125b60808901620011d1565b92506200126b60a08901620011d1565b60c08901519092506001600160401b03808211156200128957600080fd5b818a0191508a601f8301126200129e57600080fd5b815181811115620012b357620012b3620015af565b604051601f8201601f19908116603f01168101908382118183101715620012de57620012de620015af565b816040528281528d6020848701011115620012f857600080fd5b6200130b8360208301602088016200148e565b809550505050505092959891949750929550565b60008151808452620013398160208601602086016200148e565b601f01601f19169290920160200192915050565b60008251620013618184602087016200148e565b9190910192915050565b60006060808301818452808751808352608092508286019150828160051b8701016020808b0160005b848110156200144057898403607f19018652815180516001600160a01b03168552838101518986019060038110620013dc57634e487b7160e01b600052602160045260246000fd5b868601526040918201519186018a905281519081905290840190600090898701905b808310156200142a5783516001600160e01b0319168252928601926001929092019190860190620013fe565b5097850197955050509082019060010162001394565b50506001600160a01b038a169088015286810360408801526200146481896200131f565b9a9950505050505050505050565b6020815260006200148760208301846200131f565b9392505050565b60005b83811015620014ab57818101518382015260200162001491565b8381111562000b0a5750506000910152565b600081620014cf57620014cf62001557565b506000190190565b600181811c90821680620014ec57607f821691505b602082108114156200150e57634e487b7160e01b600052602260045260246000fd5b50919050565b600061ffff808316818114156200152f576200152f62001557565b6001019392505050565b600060001982141562001550576200155062001557565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b61152d80620015d56000396000f3fe6080604052600436106100225760003560e01c80637c83c11f146100d457610029565b3661002957005b600080356001600160e01b0319168152600080516020611464833981519152602081905260409091205481906001600160a01b0316806100b05760405162461bcd60e51b815260206004820181905260248201527f4469616d6f6e643a2046756e6374696f6e20646f6573206e6f7420657869737460448201526064015b60405180910390fd5b3660008037600080366000845af43d6000803e8080156100cf573d6000f35b3d6000fd5b3480156100e057600080fd5b506100f46100ef3660046110dc565b6100f6565b005b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f0036566680546000805160206114648339815191529081906001600160a01b031633146101815760405162461bcd60e51b815260206004820152601d60248201527f50726f6a6563744469616d6f6e64203a2077726f6e672073656e64657200000060448201526064016100a7565b600182600b018460405161019591906111b9565b908152604051908190036020019020805491151560ff19909216919091179055505050565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667c80546001600160a01b031981166001600160a01b03848116918217909355604051600080516020611464833981519152939092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f0036566683805460ff19168615151790557f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667e80546001600160a01b03199081166001600160a01b03878116919091179092557f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667f805482168684161790557f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f00365666808054909116918416919091179055805160008051602061146483398151915290610347907f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f0036566681906020850190611043565b50505050505050565b60005b835181101561051957600084828151811061037057610370611437565b6020026020010151602001519050600060028111156103915761039161140b565b8160028111156103a3576103a361140b565b14156103f2576103ed8583815181106103be576103be611437565b6020026020010151600001518684815181106103dc576103dc611437565b602002602001015160400151610564565b610506565b60018160028111156104065761040661140b565b1415610450576103ed85838151811061042157610421611437565b60200260200101516000015186848151811061043f5761043f611437565b6020026020010151604001516107ca565b60028160028111156104645761046461140b565b14156104ae576103ed85838151811061047f5761047f611437565b60200260200101516000015186848151811061049d5761049d611437565b602002602001015160400151610a93565b60405162461bcd60e51b815260206004820152602760248201527f4c69624469616d6f6e644375743a20496e636f727265637420466163657443756044820152663a20b1ba34b7b760c91b60648201526084016100a7565b5080610511816113da565b915050610353565b507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb67383838360405161054d939291906111d5565b60405180910390a161055f8282610e15565b505050565b60008151116105855760405162461bcd60e51b81526004016100a7906112ef565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667a54600080516020611464833981519152906001600160a01b0384166106225760405162461bcd60e51b815260206004820152602c60248201527f4c69624469616d6f6e644375743a204164642066616365742063616e2774206260448201526b65206164647265737328302960a01b60648201526084016100a7565b6106448460405180606001604052806024815260200161148460249139611022565b60005b83518110156107c357600084828151811061066457610664611437565b6020908102919091018101516001600160e01b031981166000908152918690526040909120549091506001600160a01b031680156107025760405162461bcd60e51b815260206004820152603560248201527f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f6044820152746e207468617420616c72656164792065786973747360581b60648201526084016100a7565b6040805180820182526001600160a01b03808a16825261ffff80881660208085019182526001600160e01b0319881660009081528b8252958620945185549251909316600160a01b026001600160b01b0319909216929093169190911717909155600180880180549182018155835291206008820401805460e085901c60046007909416939093026101000a92830263ffffffff9093021916919091179055836107ab816113b8565b945050505080806107bb906113da565b915050610647565b5050505050565b60008151116107eb5760405162461bcd60e51b81526004016100a7906112ef565b6000805160206114648339815191526001600160a01b0383166108695760405162461bcd60e51b815260206004820152603060248201527f4c69624469616d6f6e644375743a205265706c6163652066616365742063616e60448201526f2774206265206164647265737328302960801b60648201526084016100a7565b61088b836040518060600160405280602881526020016114d060289139611022565b60005b8251811015610a8d5760008382815181106108ab576108ab611437565b6020908102919091018101516001600160e01b031981166000908152918590526040909120549091506001600160a01b0316308114156109455760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e2774207265706c61636520696d6d60448201526e3aba30b1363290333ab731ba34b7b760891b60648201526084016100a7565b856001600160a01b0316816001600160a01b031614156109cd5760405162461bcd60e51b815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e20776974682073616d652066756e6374696f6e000000000000000060648201526084016100a7565b6001600160a01b038116610a495760405162461bcd60e51b815260206004820152603860248201527f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e60448201527f6374696f6e207468617420646f65736e2774206578697374000000000000000060648201526084016100a7565b506001600160e01b031916600090815260208390526040902080546001600160a01b0319166001600160a01b03861617905580610a85816113da565b91505061088e565b50505050565b6000815111610ab45760405162461bcd60e51b81526004016100a7906112ef565b7f1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f003656667a54600080516020611464833981519152906001600160a01b03841615610b5c5760405162461bcd60e51b815260206004820152603660248201527f4c69624469616d6f6e644375743a2052656d6f76652066616365742061646472604482015275657373206d757374206265206164647265737328302960501b60648201526084016100a7565b60005b83518110156107c3576000848281518110610b7c57610b7c611437565b6020908102919091018101516001600160e01b0319811660009081528683526040908190208151808301909252546001600160a01b038116808352600160a01b90910461ffff169382019390935290925090610c405760405162461bcd60e51b815260206004820152603760248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e6360448201527f74696f6e207468617420646f65736e277420657869737400000000000000000060648201526084016100a7565b80516001600160a01b0316301415610cb25760405162461bcd60e51b815260206004820152602f60248201527f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7560448201526e3a30b1363290333ab731ba34b7b71760891b60648201526084016100a7565b83610cbc81611366565b94505083816020015161ffff1614610d9a576000856001018581548110610ce557610ce5611437565b90600052602060002090600891828204019190066004029054906101000a900460e01b90508086600101836020015161ffff1681548110610d2857610d28611437565b600091825260208083206008830401805463ffffffff60079094166004026101000a938402191660e09590951c92909202939093179055838201516001600160e01b03199390931681529087905260409020805461ffff60a01b1916600160a01b61ffff909316929092029190911790555b84600101805480610dad57610dad611421565b60008281526020808220600860001990940193840401805463ffffffff600460078716026101000a0219169055919092556001600160e01b0319909316815291859052506040902080546001600160b01b031916905580610e0d816113da565b915050610b5f565b6001600160a01b038216610e9c57805115610e985760405162461bcd60e51b815260206004820152603c60248201527f4c69624469616d6f6e644375743a205f696e697420697320616464726573732860448201527f3029206275745f63616c6c64617461206973206e6f7420656d7074790000000060648201526084016100a7565b5050565b6000815111610f135760405162461bcd60e51b815260206004820152603d60248201527f4c69624469616d6f6e644375743a205f63616c6c6461746120697320656d707460448201527f7920627574205f696e6974206973206e6f74206164647265737328302900000060648201526084016100a7565b6001600160a01b0382163014610f4557610f45826040518060600160405280602881526020016114a860289139611022565b600080836001600160a01b031683604051610f6091906111b9565b600060405180830381855af49150503d8060008114610f9b576040519150601f19603f3d011682016040523d82523d6000602084013e610fa0565b606091505b509150915081610a8d57805115610fcb578060405162461bcd60e51b81526004016100a791906112d5565b60405162461bcd60e51b815260206004820152602660248201527f4c69624469616d6f6e644375743a205f696e69742066756e6374696f6e2072656044820152651d995c9d195960d21b60648201526084016100a7565b813b8181610a8d5760405162461bcd60e51b81526004016100a791906112d5565b82805461104f9061137d565b90600052602060002090601f01602090048101928261107157600085556110b7565b82601f1061108a57805160ff19168380011785556110b7565b828001600101855582156110b7579182015b828111156110b757825182559160200191906001019061109c565b506110c39291506110c7565b5090565b5b808211156110c357600081556001016110c8565b6000602082840312156110ee57600080fd5b813567ffffffffffffffff8082111561110657600080fd5b818401915084601f83011261111a57600080fd5b81358181111561112c5761112c61144d565b604051601f8201601f19908116603f011681019083821181831017156111545761115461144d565b8160405282815287602084870101111561116d57600080fd5b826020860160208301376000928101602001929092525095945050505050565b600081518084526111a581602086016020860161133a565b601f01601f19169290920160200192915050565b600082516111cb81846020870161133a565b9190910192915050565b60006060808301818452808751808352608092508286019150828160051b8701016020808b0160005b848110156112a557898403607f19018652815180516001600160a01b0316855283810151898601906003811061124457634e487b7160e01b600052602160045260246000fd5b868601526040918201519186018a905281519081905290840190600090898701905b808310156112905783516001600160e01b0319168252928601926001929092019190860190611266565b509785019795505050908201906001016111fe565b50506001600160a01b038a169088015286810360408801526112c7818961118d565b9a9950505050505050505050565b6020815260006112e8602083018461118d565b9392505050565b6020808252602b908201527f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206660408201526a1858d95d081d1bc818dd5d60aa1b606082015260800190565b60005b8381101561135557818101518382015260200161133d565b83811115610a8d5750506000910152565b600081611375576113756113f5565b506000190190565b600181811c9082168061139157607f821691505b602082108114156113b257634e487b7160e01b600052602260045260246000fd5b50919050565b600061ffff808316818114156113d0576113d06113f5565b6001019392505050565b60006000198214156113ee576113ee6113f5565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fdfe1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f00365666794c69624469616d6f6e644375743a2041646420666163657420686173206e6f20636f64654c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e644375743a205265706c61636520666163657420686173206e6f20636f6465a26469706673582212201304d8e814d57ef5d1c03ffed4689dcaa39fe2e682c8d53a4c63c5309b4d860264736f6c634300080700334c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e1e4e032ead9f5cbf2bef2ad76af6882907961bfa4f161b1b0cdb1f00365666794c69624469616d6f6e644375743a2041646420666163657420686173206e6f20636f64654c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e644375743a205265706c61636520666163657420686173206e6f20636f64654c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e2066";

type ProjectDiamondConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProjectDiamondConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProjectDiamond__factory extends ContractFactory {
  constructor(...args: ProjectDiamondConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ProjectDiamond";
  }

  deploy(
    _contractOwner: string,
    _diamondCutFacet: string,
    _appApproval: boolean,
    _projectSigningAddr: string,
    _projectNFTAddr: string,
    _pathwayNFTAddr: string,
    _projectId: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ProjectDiamond> {
    return super.deploy(
      _contractOwner,
      _diamondCutFacet,
      _appApproval,
      _projectSigningAddr,
      _projectNFTAddr,
      _pathwayNFTAddr,
      _projectId,
      overrides || {}
    ) as Promise<ProjectDiamond>;
  }
  getDeployTransaction(
    _contractOwner: string,
    _diamondCutFacet: string,
    _appApproval: boolean,
    _projectSigningAddr: string,
    _projectNFTAddr: string,
    _pathwayNFTAddr: string,
    _projectId: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _contractOwner,
      _diamondCutFacet,
      _appApproval,
      _projectSigningAddr,
      _projectNFTAddr,
      _pathwayNFTAddr,
      _projectId,
      overrides || {}
    );
  }
  attach(address: string): ProjectDiamond {
    return super.attach(address) as ProjectDiamond;
  }
  connect(signer: Signer): ProjectDiamond__factory {
    return super.connect(signer) as ProjectDiamond__factory;
  }
  static readonly contractName: "ProjectDiamond";
  public readonly contractName: "ProjectDiamond";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProjectDiamondInterface {
    return new utils.Interface(_abi) as ProjectDiamondInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProjectDiamond {
    return new Contract(address, _abi, signerOrProvider) as ProjectDiamond;
  }
}
