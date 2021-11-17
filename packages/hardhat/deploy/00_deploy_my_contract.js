// deploy/00_deploy_your_contract.js

// const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const devAddress = process.env.DEV_ADDRESS;

  await deploy("ProjectNFT", {
    from: devAddress,
    args: [
      devAddress,
      [
        devAddress,
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
module.exports.tags = ["ProjectNFT"];
