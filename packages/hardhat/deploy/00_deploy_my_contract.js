// deploy/00_deploy_your_contract.js

const { ethers } = require("ethers");
const buildList = require("@uniswap/default-token-list");

// const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { DEPLOYER_PRIVATE_KEY, DEV_ADDRESS, SERVER_ADDRESS, CHAIN_IDS} = process.env;

  const project = await deploy("ProjectNFT", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [
      DEV_ADDRESS,
      [
        DEV_ADDRESS,
        "0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631",
        "0x2c0B08C414A8EE088596832cf64eFcA283D46703",
        "0x16eBE01dCae1338f8d1802C63712C5279e768d29",
        "0x3E31155a1c17c9F85e74828447aec412090a4622",
        "0x4678854dB7421fF1B3C5ACAe6c5C11e73f4F5702",
        "0xDAFf97a69408Cdb4AeFE331eA029a55e189ef60b",
      ],
      10,
    ],
    log: true,
  });

  const vrf = await deploy("RandomNumberConsumer", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [
      [
        DEV_ADDRESS,
        "0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631",
        "0x2c0B08C414A8EE088596832cf64eFcA283D46703",
        "0x16eBE01dCae1338f8d1802C63712C5279e768d29",
        "0x3E31155a1c17c9F85e74828447aec412090a4622",
        "0x4678854dB7421fF1B3C5ACAe6c5C11e73f4F5702",
        "0xDAFf97a69408Cdb4AeFE331eA029a55e189ef60b",
      ],
    ],
    log: true,
  });

  const verify = await deploy("Verify", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [
      SERVER_ADDRESS,
      [
        DEV_ADDRESS,
        "0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631",
        "0x2c0B08C414A8EE088596832cf64eFcA283D46703",
        "0x16eBE01dCae1338f8d1802C63712C5279e768d29",
        "0x3E31155a1c17c9F85e74828447aec412090a4622",
        "0x4678854dB7421fF1B3C5ACAe6c5C11e73f4F5702",
        "0xDAFf97a69408Cdb4AeFE331eA029a55e189ef60b",
      ],
    ],
    log: true,
  });

  const pathway = await deploy("PathwayNFT", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [vrf.address, project.address, verify.address],
    log: true,
  });

  const sponsorSFT = await deploy("SponsorPassSFT",{
    from: DEPLOYER_PRIVATE_KEY,
    args: [
      [`0xde0b6b3a7640000`, `0x29a2241af62c0000`, `0x4563918244f40000`],
      project.address
    ],
    log: true,
  }
  )

  const appDiamond = await deploy("AppDiamond", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [project.address, verify.address, sponsorSFT.address, SERVER_ADDRESS],
    log: true,
  });

  await deployments.execute(
    "ProjectNFT",
    { from: DEPLOYER_PRIVATE_KEY },
    "setAppDiamond",
    appDiamond.address
  );
  await deployments.execute(
    "ProjectNFT",
    { from: DEPLOYER_PRIVATE_KEY },
    "setSFTAddr",
    sponsorSFT.address
  );

  //const chainIds = [1,4,42,137,80001];
  const chainIdString = CHAIN_IDS.split(" ");
  let chainIds = Array();
  chainIdString.map(value =>{chainIds.push(Number(value))})
  const chainAddrObj = {}
  chainIds.forEach(value => {chainAddrObj[value] = []})
  const tokens = buildList.tokens;
  tokens.map((value, index) => {
    if (chainIds.includes(value.chainId)){
        chainAddrObj[value.chainId].push(value.address)
    }
  })

  for (let i=0; i< chainIds.length; i++){
    await deployments.execute(
      "AppDiamond",
      { from: DEPLOYER_PRIVATE_KEY },
      "addERC20PerChain",
      chainIds[i],
      chainAddrObj[chainIds[i]]
    );
  }
};

module.exports.tags = [
  "ProjectNFT",
  "RandomNumberConsumer",
  "Verify",
  "PathwayNFT",
  "AppDiamond",
];