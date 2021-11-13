require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
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
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: INFURA_ID
        ? `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
        : "https://rpc-mumbai.matic.today",
      accounts: [DEPLOYER_PRIVATE_KEY]
    },
    matic: {
      url: INFURA_ID
      ? `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`
      : "https://rpc-mainnet.maticvigil.com",
      accounts: [DEPLOYER_PRIVATE_KEY]
    },
    kovan : {
      url: INFURA_ID
      ? `https://kovan.infura.io/v3/${INFURA_ID}`
      : ``,
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId : 42
    }
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  }
};

