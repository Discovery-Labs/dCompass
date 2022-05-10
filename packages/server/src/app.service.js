"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppService = void 0;
var common_1 = require("@nestjs/common");
var ethers_1 = require("ethers");
var abis_json_1 = require("@discovery-dao/hardhat/abis.json");
var INFURA_ID = process.env.INFURA_ID;
var NETWORKS = {
    '31337': {
        name: 'localhost',
        color: '#666666',
        chainId: 31337,
        blockExplorer: '',
        rpcUrl: "http://localhost:8545"
    },
    '1': {
        name: 'mainnet',
        color: '#ff8b9e',
        chainId: 1,
        rpcUrl: "https://mainnet.infura.io/v3/".concat(INFURA_ID),
        blockExplorer: 'https://etherscan.io/'
    },
    '42': {
        name: 'kovan',
        color: '#7003DD',
        chainId: 42,
        rpcUrl: "https://kovan.infura.io/v3/".concat(INFURA_ID),
        blockExplorer: 'https://kovan.etherscan.io/',
        faucet: 'https://gitter.im/kovan-testnet/faucet'
    },
    '4': {
        name: 'rinkeby',
        color: '#e0d068',
        chainId: 4,
        rpcUrl: "https://rinkeby.infura.io/v3/".concat(INFURA_ID),
        faucet: 'https://faucet.rinkeby.io/',
        blockExplorer: 'https://rinkeby.etherscan.io/'
    },
    '3': {
        name: 'ropsten',
        color: '#F60D09',
        chainId: 3,
        faucet: 'https://faucet.ropsten.be/',
        blockExplorer: 'https://ropsten.etherscan.io/',
        rpcUrl: "https://ropsten.infura.io/v3/".concat(INFURA_ID)
    },
    '5': {
        name: 'goerli',
        color: '#0975F6',
        chainId: 5,
        faucet: 'https://goerli-faucet.slock.it/',
        blockExplorer: 'https://goerli.etherscan.io/',
        rpcUrl: "https://goerli.infura.io/v3/".concat(INFURA_ID)
    },
    '100': {
        name: 'xdai',
        color: '#48a9a6',
        chainId: 100,
        price: 1,
        gasPrice: 1000000000,
        rpcUrl: 'https://dai.poa.network',
        faucet: 'https://xdai-faucet.top/',
        blockExplorer: 'https://blockscout.com/poa/xdai/'
    },
    '137': {
        name: 'matic',
        color: '#2bbdf7',
        chainId: 137,
        price: 1,
        gasPrice: 1000000000,
        rpcUrl: 'https://rpc-mainnet.maticvigil.com',
        faucet: 'https://faucet.matic.network/',
        blockExplorer: 'https://explorer-mainnet.maticvigil.com//'
    },
    '80001': {
        name: 'mumbai',
        color: '#92D9FA',
        chainId: 80001,
        price: 1,
        gasPrice: 1000000000,
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        faucet: 'https://faucet.matic.network/',
        blockExplorer: 'https://mumbai-explorer.matic.today/'
    },
    '153869338190755': {
        name: 'localArbitrum',
        color: '#50a0ea',
        chainId: 153869338190755,
        blockExplorer: '',
        rpcUrl: "http://localhost:8547"
    },
    '44010': {
        name: 'localArbitrumL1',
        color: '#50a0ea',
        chainId: 44010,
        blockExplorer: '',
        rpcUrl: "http://localhost:7545"
    },
    '421611': {
        name: 'Arbitrum Testnet',
        color: '#50a0ea',
        chainId: 421611,
        blockExplorer: 'https://rinkeby-explorer.arbitrum.io/#/',
        rpcUrl: "https://rinkeby.arbitrum.io/rpc"
    },
    '42161': {
        name: 'Arbitrum',
        color: '#50a0ea',
        chainId: 42161,
        blockExplorer: 'https://explorer.arbitrum.io/#/',
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        gasPrice: 0
    },
    // 31337: {
    //   name: "localOptimismL1",
    //   color: "#f01a37",
    //   chainId: 31337,
    //   blockExplorer: "",
    //   rpcUrl: `http://localhost:9545`,
    // },
    '420': {
        name: 'localOptimism',
        color: '#f01a37',
        chainId: 420,
        blockExplorer: '',
        rpcUrl: "http://localhost:8545",
        gasPrice: 0
    },
    '69': {
        name: 'kovanOptimism',
        color: '#f01a37',
        chainId: 69,
        blockExplorer: 'https://kovan-optimistic.etherscan.io/',
        rpcUrl: "https://kovan.optimism.io",
        gasPrice: 0
    },
    '10': {
        name: 'optimism',
        color: '#f01a37',
        chainId: 10,
        blockExplorer: 'https://optimistic.etherscan.io/',
        rpcUrl: "https://mainnet.optimism.io"
    },
    '43112': {
        name: 'localAvalanche',
        color: '#666666',
        chainId: 43112,
        blockExplorer: '',
        rpcUrl: "http://localhost:9650/ext/bc/C/rpc",
        gasPrice: 225000000000
    },
    '43113': {
        name: 'fujiAvalanche',
        color: '#666666',
        chainId: 43113,
        blockExplorer: 'https://cchain.explorer.avax-test.network/',
        rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
        gasPrice: 225000000000
    },
    '43114': {
        name: 'mainnetAvalanche',
        color: '#666666',
        chainId: 43114,
        blockExplorer: 'https://cchain.explorer.avax.network/',
        rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
        gasPrice: 225000000000
    },
    '1666700000': {
        name: 'Harmony Testnet',
        color: '#00b0ef',
        chainId: 1666700000,
        blockExplorer: 'https://explorer.pops.one/',
        rpcUrl: "https://api.s0.b.hmny.io",
        gasPrice: 1000000000
    },
    '1666600000': {
        name: 'Harmony Mainnet',
        color: '#00b0ef',
        chainId: 1666600000,
        blockExplorer: 'https://explorer.harmony.one/',
        rpcUrl: "https://api.harmony.one",
        gasPrice: 1000000000
    }
};
var AppService = /** @class */ (function () {
    function AppService() {
    }
    AppService.prototype.getContract = function (chainId, name) {
        console.log({ chainId: chainId });
        var network = NETWORKS[chainId];
        var localProviderUrl = network.rpcUrl;
        console.log('🏠 Connecting to provider:', localProviderUrl);
        var localProvider = new ethers_1.ethers.providers.StaticJsonRpcProvider(localProviderUrl);
        var abis = abis_json_1["default"];
        var contractAbis = abis[chainId][network.name].contracts[name];
        var contract = new ethers_1.ethers.Contract(contractAbis.address, contractAbis.abi, localProvider);
        return contract;
    };
    AppService = __decorate([
        (0, common_1.Injectable)()
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
