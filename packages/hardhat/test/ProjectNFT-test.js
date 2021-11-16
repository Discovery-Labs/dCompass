const { expect } = require("chai");
const {ethers} = require("hardhat");
const { smock } = require('@defi-wonderland/smock');
const { BigNumber, Contract } = require("ethers");

describe("ProjectNFT", function() {
    
  
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
})

  describe("Testing deployment and voting", function() {
    it("testing constructor and reviewer setters and getters", async function() {
      console.log(`${owner.address}`);
  
      //set in constructor
      expect(await projectNFT.multiSigThreshold()).to.be.equal(10);
      expect(await projectNFT.numReviewers()).to.be.equal(5);
      expect(await projectNFT.owner()).to.be.equal(`${owner.address}`);
      
      //reviewers can change Threshold, and add reviewers
      await projectNFT.setThreshold(40);
      expect(await projectNFT.multiSigThreshold()).to.be.equal(40);
      await projectNFT.connect(addr1).setThreshold(30);
      expect(await projectNFT.multiSigThreshold()).to.be.equal(30);
      await projectNFT.connect(addr3).addReviewer(`${addr5.address}`);
      expect(await projectNFT.numReviewers()).to.be.equal(6);
  
      //check all reviewers
      expect(await projectNFT.reviewers("0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631")).to.be.false;
      expect(await projectNFT.reviewers(`${addr1.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${addr2.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${addr3.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${addr4.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${owner.address}`)).to.be.true;
    })
    
    it("When threshold is 10 should approve right away", async function() {
      await projectNFT.voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], 15, "firstTestProject");
      expect(await projectNFT.status("firstTestProject")).to.be.equal(3);//approve Enum value
      expect(await projectNFT.reviewerVotes("firstTestProject", `${owner.address}`)).to.be.true;//person who voted is marked true
      expect(await projectNFT.reviewerVotes("firstTestProject", `${addr1.address}`)).to.be.false;//reviewer who didn't vote is still false
      expect(await projectNFT.votes("firstTestProject")).to.be.equal(1);//1 vote needed for approval
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.false;//not minted yet
      expect(await projectNFT.projectThresholds("firstTestProject")).to.be.equal(15);//threshold for project set to 15
      let contributors = await projectNFT.getContributors("firstTestProject");
      expect(contributors.length).to.be.equal(5);//make sure contributors are added correctly

      await projectNFT.connect(addr2).createToken(['0x01701220','0x01701220','0x01701220','0x01701220','0x01701220'], ['0x8cb97a00a6c90a14ecf182d8363583d402f69919e38f0498edd9d92a5c02a7b4',
      '0xaaee392e31f4dc5c9aba87c950b4208b71eb628a0d76137317337faa9084beef', '0x7d836ef7074053a1e29f313f86e45e7d736c8aedb37c9d9ef9a748b6708978ef',
      '0xf4ae025d8039f4914e27df2749b9f07763e8daa85947e1b8f462620e73d71015', '0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301'], "firstTestProject");
      let tokenURI;
      for(var i = 1 ; i<=contributors.length; i++){
        tokenURI = await projectNFT.tokenURI(i);
        console.log(tokenURI);//should match ipfs://f + first array[i] + second array[i]
      }
    })
  })

})
