const { expect } = require("chai");
const {ethers} = require("hardhat");
const { smock } = require('@defi-wonderland/smock');
const { BigNumber, Contract } = require("ethers");
require('dotenv').config();

const verifyNFTInfo = async function(nonce, nonceId_Threshold, account, nftAddress, verifyAddress, stringId, threshold){
  const serverAddress =  process.env.SERVER_ADDRESS;
  const signingKey = process.env.SERVER_PRIVATE_KEY;
  let wallet = new ethers.Wallet(signingKey);
  let hashMsg;

  if (threshold){
    hashMsg = ethers.utils.solidityKeccak256(["uint256", "uint256", "address", "address", "address", "string"], [nonce, nonceId_Threshold, account, nftAddress, verifyAddress, stringId]);
  }
  else{
    hashMsg = ethers.utils.solidityKeccak256(["uint256", "address", "address", "address", "string"], [nonceId_Threshold, account, nftAddress, verifyAddress, stringId]);
  }
  let messageHashBytes = ethers.utils.arrayify(hashMsg);
  let flatSig = await wallet.signMessage(messageHashBytes);

  let sig = ethers.utils.splitSignature(flatSig);

  return sig;
}


describe("PathwayNFT", function() {
 
  let ProjectFactory;
  let projectNFT;
  let CourseFactory;
  let pathwayNFT;
  let VerifyFactory;
  let verify;
  let RandomNumberConsumerFactory;
  let rng;
  let owner;
  let addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8;
  let addrs;
  beforeEach( async () => {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, ...addrs] = await ethers.getSigners();
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
    appDiamond = await AppDiamondFactory.deploy(`${projectNFT.address}`, `${verify.address}`, `${sponsorSFT.address}`,`${process.env.SERVER_ADDRESS}`);
    await appDiamond.deployed();
    
    //await rng.addContractToWhiteList(`${pathwayNFT.address}`);
    await projectNFT.connect(addr2).setAppDiamond(appDiamond.address);
    await projectNFT.setSFTAddr(sponsorSFT.address);
    await projectNFT.connect(addr6).addProjectWallet("firstTestProject", `${addr5.address}`, "SILVER" , {value : `0xde0b6b3a7640000`});
    await projectNFT.connect(owner).voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], 15, "firstTestProject");
    await projectNFT.connect(addr6).addProjectContributor("firstTestProject", `${addrs[0].address}`);
    await projectNFT.connect(addr2).createToken(['0x01701220','0x01701220','0x01701220','0x01701220','0x01701220','0x01701220' ], ['0x8cb97a00a6c90a14ecf182d8363583d402f69919e38f0498edd9d92a5c02a7b4',
      '0xaaee392e31f4dc5c9aba87c950b4208b71eb628a0d76137317337faa9084beef', '0x7d836ef7074053a1e29f313f86e45e7d736c8aedb37c9d9ef9a748b6708978ef',
      '0xf4ae025d8039f4914e27df2749b9f07763e8daa85947e1b8f462620e73d71015', '0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301', '0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301'], "firstTestProject");
    
    await expect(appDiamond.connect(addrs[0]).addProjectERC20PerChain("firstTestProject", [42, 137], [["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f"], ["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "0x8e870d67f660d95d5be530380d0ec0bd388289e1"]])).to.be.revertedWith("not approved app reviewer");
    await expect(appDiamond.connect(addr3).addProjectERC20PerChain("firstTestProject", [1, 42, 137], [["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f"], ["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "0x8e870d67f660d95d5be530380d0ec0bd388289e1"]])).to.be.revertedWith("invalid lengths sent");
    await appDiamond.connect(addr3).addProjectERC20PerChain("firstTestProject", [42, 137], [["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f"], ["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "0x8e870d67f660d95d5be530380d0ec0bd388289e1"]]);

    expect(await appDiamond.checkApprovedERC20PerProjectByChain("firstTestProject", 137, "0x8e870d67f660d95d5be530380d0ec0bd388289e1")).to.be.true;
    expect(await appDiamond.checkApprovedERC20PerProjectByChain("firstTestProject", 42, "0x8e870d67f660d95d5be530380d0ec0bd388289e1")).to.be.false;
    expect(await appDiamond.checkApprovedERC20PerProjectByChain("firstTestProject", 42, "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f")).to.be.true;
    expect(await appDiamond.getERC20AddrsPerProject("firstTestProject", 137)).to.be.eql(["0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F", "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "0x8E870D67F660D95d5be530380D0eC0bd388289E1"]);
})

  describe("Testing deployment", function() {
    it("testing constructor and reviewer setters and getters", async function() {
      /*const SmockRNGFactory = await smock.mock('RandomNumberConsumer');
      let smockRNG = await SmockRNGFactory.deploy([`${owner.address}`, `${addr1.address}`, `${addr2.address}`, `${addr3.address}`, `${addr4.address}`]);
      await smockRNG.addContractToWhiteList(`${courseNFT.address}`);*/
      /*await smockRNG.setVariable('_tokenIds', {
        _value : 10,
      })*/
      console.log(`${owner.address}`);
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.true;//Check project minted
  
      //set in constructor
      expect(await pathwayNFT.owner()).to.be.equal(`${owner.address}`);
      expect(await pathwayNFT.statusStrings(0)).to.be.equal("NONEXISTENT");
      expect(await pathwayNFT.statusStrings(1)).to.be.equal("PENDING");
      expect(await pathwayNFT.statusStrings(2)).to.be.equal("DENIED");
      expect(await pathwayNFT.statusStrings(3)).to.be.equal("APPROVED");

      //get nonces and check no votes cast
      let nonce = await verify.noncesParentIdChildId("firstTestProject", "firstCourseProject");
      let nonceById = await verify.thresholdNoncesById("firstCourseProject");
      expect(await pathwayNFT.status("firstCourseProject")).to.be.equal(0);
      expect(await pathwayNFT.votes("firstCourseProject")).to.be.equal(0);
      expect(await pathwayNFT.reviewerVotes("firstCourseProject", `${owner.address}`)).to.be.false;

      //construct r,s, and v arrays
      let r = Array(2);
      let s = Array(2);
      let v = Array(2);
      let sig = await verifyNFTInfo(0,nonce, `${owner.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(nonceById, 2, `${owner.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)

      //vote for approval and check that everything updates as planned
      await pathwayNFT.voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], "firstCourseProject", "firstTestProject", r, s, v, 2);
      expect(await verify.noncesParentIdChildId("firstTestProject", "firstCourseProject")).to.be.equal(1);
      expect(await verify.thresholdNoncesById("firstCourseProject")).to.be.equal(1);
      expect(await pathwayNFT.status("firstCourseProject")).to.be.equal(1);
      expect(await pathwayNFT.votes("firstCourseProject")).to.be.equal(1);
      expect(await pathwayNFT.reviewerVotes("firstCourseProject", `${owner.address}`)).to.be.true;

      //get signature for next voter
      sig = await verifyNFTInfo(0,1, `${addr1.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(1, 2, `${addr1.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)

      //testing final approval vote and call to VRF using hard-coded value since hard to get link on hardhat
      //expect(await rng.objectRequests('0xd112541cfa18fb778c806d9631e966e2804abf8d12eaa09fe867f32989722056')).to.be.equal('');
      //expect(await rng.numContributors('0xd112541cfa18fb778c806d9631e966e2804abf8d12eaa09fe867f32989722056')).to.be.equal(0);
      expect(await pathwayNFT.reviewerVotes("firstCourseProject", `${addr1.address}`)).to.be.false;
      await pathwayNFT.connect(addr1).voteForApproval([], "firstCourseProject", "firstTestProject", r, s, v, 2);
      expect(await verify.noncesParentIdChildId("firstTestProject", "firstCourseProject")).to.be.equal(2);
      expect(await verify.thresholdNoncesById("firstCourseProject")).to.be.equal(2);
      expect(await pathwayNFT.status("firstCourseProject")).to.be.equal(3);
      expect(await pathwayNFT.votes("firstCourseProject")).to.be.equal(2);
      expect(await pathwayNFT.reviewerVotes("firstCourseProject", `${addr1.address}`)).to.be.true;
      //expect(await rng.objectRequests('0xd112541cfa18fb778c806d9631e966e2804abf8d12eaa09fe867f32989722056')).to.be.equal('firstCourseProject');
      //expect(await rng.numContributors('0xd112541cfa18fb778c806d9631e966e2804abf8d12eaa09fe867f32989722056')).to.be.equal(5);
    })
  })
  
})