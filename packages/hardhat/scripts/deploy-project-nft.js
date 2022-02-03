// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Project = await hre.ethers.getContractFactory("ProjectNFT");
  const devAddress = "0x7E13623dd5D070967c8568066bE81a3E5bF75226"; // "0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631"
  const project = await Project.deploy(
    devAddress,
    [
      devAddress,
      "0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631",
      "0x2c0B08C414A8EE088596832cf64eFcA283D46703",
      "0x16eBE01dCae1338f8d1802C63712C5279e768d29",
      "0x3E31155a1c17c9F85e74828447aec412090a4622",
      "0x4678854dB7421fF1B3C5ACAe6c5C11e73f4F5702",
      "0xDAFf97a69408Cdb4AeFE331eA029a55e189ef60b",
      "0xD39C3Cdb811f6544067ECFeDEf40855578cA0C52",
    ],
    10
  );

  await project.deployed();

  // TODO: writeFile("projectNFT abi with deployed address")
  console.log("Project deployed to:", project.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
