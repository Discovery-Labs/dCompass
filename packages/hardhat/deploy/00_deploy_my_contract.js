// deploy/00_deploy_your_contract.js

const { ethers } = require("ethers");
const buildList = require("@uniswap/default-token-list");

// const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { DEPLOYER_PRIVATE_KEY, DEV_ADDRESS, SERVER_ADDRESS, CHAIN_IDS } =
    process.env;

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
        "0xD39C3Cdb811f6544067ECFeDEf40855578cA0C52",
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
        "0xD39C3Cdb811f6544067ECFeDEf40855578cA0C52",
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
        "0xD39C3Cdb811f6544067ECFeDEf40855578cA0C52",
      ],
    ],
    log: true,
  });

  const pathway = await deploy("PathwayNFT", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [vrf.address, project.address, verify.address],
    log: true,
  });

  const badge = await deploy("BadgeNFT", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [vrf.address, project.address, pathway.address, verify.address],
    log: true,
  });
  
  const sponsorSFT = await deploy("SponsorPassSFT", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [
      [`0xde0b6b3a7640000`, `0x29a2241af62c0000`, `0x4563918244f40000`],
      project.address,
    ],
    log: true,
  });

  const appDiamond = await deploy("AppDiamond", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [
      project.address,
      pathway.address,
      verify.address,
      sponsorSFT.address,
      SERVER_ADDRESS,
    ],
    log: true,
  });

  const adventurerNFTImpl = await deploy("AdventurerNFT", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [],
    log: true,
  });

  const adventurerNFTFactory = await deploy("AdventurerBadgeFactory", {
    from: DEPLOYER_PRIVATE_KEY,
    args: [adventurerNFTImpl.address, project.address, pathway.address, badge.address, appDiamond.address],
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
  await deployments.execute(
    "PathwayNFT",
    { from: DEPLOYER_PRIVATE_KEY },
    "setAppDiamond",
    appDiamond.address
  );
  await deployments.execute(
    "BadgeNFT",
    { from: DEPLOYER_PRIVATE_KEY },
    "setAppDiamond",
    appDiamond.address
  );
  await deployments.execute(
    "BadgeNFT",
    { from: DEPLOYER_PRIVATE_KEY },
    "setAdventureFactory",
    adventurerNFTFactory.address
  );

  const chainIds = CHAIN_IDS || "1, 4, 42, 137, 80001";
  const chainIdsArray = chainIds
    .split(", ")
    .map((chainId) => parseInt(chainId, 10));

  const chainAddrObj = {};
  chainIdsArray.forEach((value) => {
    chainAddrObj[value] = [];
  });

  const tokens = buildList.tokens;
  tokens.map((value, index) => {
    if (chainIdsArray.includes(value.chainId)) {
      chainAddrObj[value.chainId].push(value.address);
    }
  });

  for (let i = 0; i < chainIdsArray.length; i++) {
    await deployments.execute(
      "AppDiamond",
      { from: DEPLOYER_PRIVATE_KEY },
      "addERC20PerChain",
      chainIdsArray[i],
      chainAddrObj[chainIdsArray[i]]
    );
  }

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = [
  "ProjectNFT",
  "RandomNumberConsumer",
  "Verify",
  "PathwayNFT",
  "AppDiamond",
];
