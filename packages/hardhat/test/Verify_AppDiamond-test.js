const { expect } = require("chai");
const {ethers} = require("hardhat");
require("dotenv").config();
const { smock } = require('@defi-wonderland/smock');
const { BigNumber, Contract } = require("ethers");
const buildList = require("@uniswap/default-token-list");

describe("Verify and app diamond", function() {
    
  
  let ProjectFactory;
  let projectNFT;
  let owner;
  let addr1, addr2, addr3, addr4, addr5, addr6;
  let addrs;
  beforeEach( async () => {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrs] = await ethers.getSigners();
    ProjectFactory = await ethers.getContractFactory("ProjectNFT");
    projectNFT = await ProjectFactory.deploy(`${owner.address}`, [`${owner.address}`, `${addr1.address}`, `${addr2.address}`, `${addr3.address}`, `${addr4.address}`], 10);
    await projectNFT.deployed();
    VerifyFactory = await ethers.getContractFactory("Verify");
    verify = await VerifyFactory.deploy(`${process.env.SERVER_ADDRESS}`,[`${owner.address}`, `${addr1.address}`, `${addr2.address}`, `${addr3.address}`, `${addr4.address}`]);
    await verify.deployed();
    RandomNumberConsumerFactory = await ethers.getContractFactory("RandomNumberConsumer");
    rng = await RandomNumberConsumerFactory.deploy([`${owner.address}`, `${addr1.address}`, `${addr2.address}`, `${addr3.address}`, `${addr4.address}`]);
    await rng.deployed();
    PathwayFactory = await ethers.getContractFactory("PathwayNFT");
    pathwayNFT = await PathwayFactory.deploy(`${rng.address}`, `${projectNFT.address}`, `${verify.address}`);
    await pathwayNFT.deployed();
    SponsorSFTFactory = await ethers.getContractFactory("SponsorPassSFT");
    sponsorSFT = await SponsorSFTFactory.deploy([`0xde0b6b3a7640000`, `0x29a2241af62c0000`, `0x4563918244f40000`], `${projectNFT.address}`);
    await sponsorSFT.deployed();
    AppDiamondFactory = await ethers.getContractFactory("AppDiamond");
    appDiamond = await AppDiamondFactory.deploy(`${projectNFT.address}`, `${pathwayNFT.address}`, `${verify.address}`, `${sponsorSFT.address}`,`${process.env.SERVER_ADDRESS}`);
    await appDiamond.deployed();
  })

  describe("Testing secondary contracts", function() {

        it("testing verify require statements", async function(){
            BadVerifyFactory = await ethers.getContractFactory("Verify");
            await expect(BadVerifyFactory.deploy('0x0000000000000000000000000000000000000000', [])).to.be.reverted;
        })

        it("testing verify reverts", async function(){
            await expect(verify.metaDataVerify(`${addr1.address}`, `test_parent_id`, 'test_object_id',
                "0x0000000000000000000000000000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000000000000000000000000000002", 27)).to.be.revertedWith("SIGNER MUST BE SERVER in metaDataVerify");
            await expect(verify.thresholdVerify(`${addr1.address}`, 'test_object_id', 5,
                "0x0000000000000000000000000000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000000000000000000000000000002", 27)).to.be.revertedWith("SIGNER MUST BE SERVER in thresholdVerify");
            await expect(verify.deployDiamondVerify(`${addr1.address}`, 'test_project_id',
                "0x0000000000000000000000000000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000000000000000000000000000002", 27)).to.be.revertedWith("SIGNER MUST BE SERVER in deployDiamondVerify");
            await expect(verify.connect(addr5).setServerAddress(`${addrs[0].address}`)).to.be.revertedWith("must be approved");
            await expect(verify.connect(addr1).setServerAddress(`0x0000000000000000000000000000000000000000`)).to.be.reverted;
            await verify.connect(addr1).setServerAddress(`${addrs[0].address}`);

        })

    })

})