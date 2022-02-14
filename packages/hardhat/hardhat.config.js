require("@typechain/hardhat");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-deploy");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
require("./tasks/faucet");
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const { INFURA_ID, DEPLOYER_PRIVATE_KEY } = process.env;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    mumbai: {
      url: /*INFURA_ID
        ? `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
        :*/ "https://rpc-mumbai.maticvigil.com",
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 80001,
    },
    matic: {
      url: INFURA_ID
        ? `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`
        : "https://rpc-mainnet.maticvigil.com",
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    kovan: {
      url: INFURA_ID ? `https://kovan.infura.io/v3/${INFURA_ID}` : ``,
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 42,
    },
    rinkeby: {
      url: INFURA_ID ? `https://rinkeby.infura.io/v3/${INFURA_ID}` : ``,
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 4,
    },
    ropsten: {
      url: INFURA_ID ? `https://ropsten.infura.io/v3/${INFURA_ID}` : ``,
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 3,
    },
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
};
