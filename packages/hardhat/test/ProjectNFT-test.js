const { expect } = require("chai");
const {ethers} = require("hardhat");
const { smock } = require('@defi-wonderland/smock');
const { BigNumber, Contract } = require("ethers");

describe("ProjectNFT", function() {
    
  it("testing constructor and reviewer setters and getters", async function() {
    const [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    let ProjectFactory = await ethers.getContractFactory("ProjectNFT");
    let projectNFT = await ProjectFactory.deploy(`${owner.address}`, [`${owner.address}`, `${addr1.address}`, `${addr2.address}`, `${addr3.address}`, `${addr4.address}`], 10);
    await projectNFT.deployed();
    console.log(`${owner.address}`);

    //set in constructor
    expect(await projectNFT.multiSigThreshold()).to.be.equal(10);
    expect(await projectNFT.numReviewers()).to.be.equal(5);
    expect(await projectNFT.owner()).to.be.equal(`${owner.address}`);

    //reviewers can change Threshold
    await projectNFT.setThreshold(40);
    expect(await projectNFT.multiSigThreshold()).to.be.equal(40);
    await projectNFT.connect(addr1).setThreshold(30);
    expect(await projectNFT.multiSigThreshold()).to.be.equal(30);

    //check all reviewers
    expect(await projectNFT.reviewers("0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631")).to.be.false;
    expect(await projectNFT.reviewers(`${addr1.address}`)).to.be.true;
    expect(await projectNFT.reviewers(`${addr2.address}`)).to.be.true;
    expect(await projectNFT.reviewers(`${addr3.address}`)).to.be.true;
    expect(await projectNFT.reviewers(`${addr4.address}`)).to.be.true;
    expect(await projectNFT.reviewers(`${owner.address}`)).to.be.true;
  })
  
  it("When threshold is 10 should approve right away", async function() {
    const [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrs] = await ethers.getSigners();
    let ProjectFactory = await ethers.getContractFactory("ProjectNFT");
    let projectNFT = await ProjectFactory.deploy(`${owner.address}`, [`${owner.address}`, `${addr1.address}`, `${addr2.address}`, `${addr3.address}`, `${addr4.address}`], 10);
    await projectNFT.deployed();

    await projectNFT.voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], 15, "firstTestProject");
    expect(await projectNFT.status("firstTestProject")).to.be.equal(3);//approve Enum value
    expect(await projectNFT.reviewerVotes("firstTestProject", `${owner.address}`)).to.be.true;//person who voted is marked true
    expect(await projectNFT.reviewerVotes("firstTestProject", `${addr1.address}`)).to.be.false;//reviewer who didn't vote is still false
    expect(await projectNFT.votes("firstTestProject")).to.be.equal(1);//1 vote needed for approval
    
  })

})
