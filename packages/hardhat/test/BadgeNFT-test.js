const { expect } = require("chai");
const {ethers} = require("hardhat");
const { smock } = require('@defi-wonderland/smock');
const { BigNumber, Contract } = require("ethers");
require('dotenv').config();
const buildList = require("@uniswap/default-token-list");

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

const verifyClaimInfo = async function(objParams){
  const serverAddress =  process.env.SERVER_ADDRESS;
  const signingKey = process.env.SERVER_PRIVATE_KEY;
  let wallet = new ethers.Wallet(signingKey);
  let hashMsg;

  hashMsg = ethers.utils.solidityKeccak256(["address", "address", "uint256", "uint256", "uint256", "string"], [objParams.account, objParams.contract, objParams.chainId, objParams.nonce, objParams.payload, objParams.badgeId]);

  let messageHashBytes = ethers.utils.arrayify(hashMsg);
  let flatSig = await wallet.signMessage(messageHashBytes);

  let sig = ethers.utils.splitSignature(flatSig);

  return sig;
}

describe("BadgeNFT", function() {
 
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
    BadgeFactory = await ethers.getContractFactory("BadgeNFT");
    badgeNFT = await BadgeFactory.deploy(`${rng.address}`, `${projectNFT.address}`, `${pathwayNFT.address}`, `${verify.address}`)
    await badgeNFT.deployed();
    SponsorSFTFactory = await ethers.getContractFactory("SponsorPassSFT");
    sponsorSFT = await SponsorSFTFactory.deploy([`0xde0b6b3a7640000`, `0x29a2241af62c0000`, `0x4563918244f40000`], `${projectNFT.address}`);
    await sponsorSFT.deployed();
    AppDiamondFactory = await ethers.getContractFactory("AppDiamond");
    appDiamond = await AppDiamondFactory.deploy(`${projectNFT.address}`, `${pathwayNFT.address}`,`${verify.address}`, `${sponsorSFT.address}`,`${process.env.SERVER_ADDRESS}`);
    await appDiamond.deployed();
    AdventureNFTFactory = await ethers.getContractFactory("AdventurerNFT");
    adventureNFTImpl = await AdventureNFTFactory.deploy();
    await adventureNFTImpl.deployed();
    AdventureFactoryFactory = await ethers.getContractFactory("AdventurerBadgeFactory");
    adventurerNFTFactory = await AdventureFactoryFactory.deploy( `${adventureNFTImpl.address}`, `${projectNFT.address}`, `${pathwayNFT.address}`, `${badgeNFT.address}`, `${appDiamond.address}`);
    await adventurerNFTFactory.deployed();
    const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
    const diamondCutFacet = await DiamondCutFacet.deploy()
    await diamondCutFacet.deployed()
    await pathwayNFT.setAppDiamond(appDiamond.address);
    await badgeNFT.setAppDiamond(appDiamond.address);
    await badgeNFT.setAdventureFactory(adventurerNFTFactory.address);

    const chainIds = [1,4,42,137,80001];
    const chainAddrObj = {}
    chainIds.forEach(value => {chainAddrObj[value] = []})
    const tokens = buildList.tokens;
    tokens.map((value, index) => {
      if (chainIds.includes(value.chainId)){
          chainAddrObj[value.chainId].push(value.address)
      }
    })

    for (let i=0; i< chainIds.length; i++){
      await appDiamond.addERC20PerChain(chainIds[i], chainAddrObj[chainIds[i]]);
    }

    let chainIdTest;
    for (let i=0; i< chainIds.length; i++){
      chainIdTest = await appDiamond.getERC20Addrs(chainIds[i]);
      console.log(chainIdTest);
      expect(chainIdTest).to.be.eql(chainAddrObj[chainIds[i]])
    }
    
    await projectNFT.connect(addr2).setAppDiamond(appDiamond.address);
    await projectNFT.setSFTAddr(sponsorSFT.address);
    await projectNFT.connect(addr6).addProjectWallet("firstTestProject", `${addr5.address}`, "SILVER" , {value : `0xde0b6b3a7640000`});
    await projectNFT.connect(owner).voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], 15, "firstTestProject");
    await projectNFT.connect(addr6).addProjectContributor("firstTestProject", `${addrs[0].address}`);
    await projectNFT.connect(addr2).createToken(['0x01701220','0x01701220','0x01701220','0x01701220','0x01701220','0x01701220' ], ['0x8cb97a00a6c90a14ecf182d8363583d402f69919e38f0498edd9d92a5c02a7b4',
      '0xaaee392e31f4dc5c9aba87c950b4208b71eb628a0d76137317337faa9084beef', '0x7d836ef7074053a1e29f313f86e45e7d736c8aedb37c9d9ef9a748b6708978ef',
      '0xf4ae025d8039f4914e27df2749b9f07763e8daa85947e1b8f462620e73d71015', '0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301', '0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301'], "firstTestProject");
    
    await appDiamond.connect(addr3).addProjectERC20PerChain("firstTestProject", [42, 137], [["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f"], ["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "0x8e870d67f660d95d5be530380d0ec0bd388289e1"]]);

    let nonce = await verify.noncesParentIdChildId("firstTestProject", "firstCourseProject");
    let nonceById = await verify.thresholdNoncesById("firstCourseProject");
    await pathwayNFT.createPathway("firstCourseProject", "firstTestProject", 200, true, "0xd0A1E359811322d97991E03f863a0C30C2cF029C", true, "0xde0b6b3a7640000", {value : "0xff59ee833b30000"});
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

      await pathwayNFT.voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], "firstCourseProject", "firstTestProject", r, s, v, 2);
      sig = await verifyNFTInfo(0,1, `${addr1.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(1, 2, `${addr1.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)
      await pathwayNFT.connect(addr1).voteForApproval([], "firstCourseProject", "firstTestProject", r, s, v, 2);

      nonce = await verify.noncesParentIdChildId("firstTestProject", "firstCourseProject");
      nonceById = await verify.thresholdNoncesById("firstCourseProject");
      
      //get signature for pathway create Token
      sig = await verifyNFTInfo(0,nonce, `${addr1.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(nonceById, 2, `${addr1.address}`, `${pathwayNFT.address}`, `${verify.address}`, "firstCourseProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)

      await pathwayNFT.connect(addr1).createToken("test_URI_String", "firstCourseProject", "firstTestProject", r, s, v, 2);
})

  describe("Testing deployment", function() {
    it("testing constructor and reviewer setters and getters", async function() {
      console.log(`${owner.address}`);
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.true;//Check project minted
      expect(await pathwayNFT.pathwayMinted("firstCourseProject")).to.be.true;//Check pathway minted
  
      //set in constructor
      expect(await badgeNFT.owner()).to.be.equal(`${owner.address}`);
      expect(await badgeNFT.statusStrings(0)).to.be.equal("NONEXISTENT");
      expect(await badgeNFT.statusStrings(1)).to.be.equal("PENDING");
      expect(await badgeNFT.statusStrings(2)).to.be.equal("DENIED");
      expect(await badgeNFT.statusStrings(3)).to.be.equal("APPROVED");

      //get nonces and check no votes cast
      let nonce = await verify.noncesParentIdChildId("firstCourseProject", "firstBadgeProject");
      let nonceById = await verify.thresholdNoncesById("firstBadgeProject");
      expect(await badgeNFT.status("firstBadgeProject")).to.be.equal(0);
      expect(await badgeNFT.votes("firstBadgeProject")).to.be.equal(0);
      expect(await badgeNFT.reviewerVotes("firstBadgeProject", `${owner.address}`)).to.be.false;

      //await pathwayNFT.createPathway("firstCourseProject", "firstTestProject", false, "0xd0A1E359811322d97991E03f863a0C30C2cF029C", false, "0xff");
      await badgeNFT.createBadge("firstBadgeProject", "firstCourseProject", 200, true, "0xd0A1E359811322d97991E03f863a0C30C2cF029C", true, "0xde0b6b3a7640000", {value : "0xff59ee833b30000"});
      expect(await badgeNFT.status("firstBadgeProject")).to.be.equal(1);
      nativeAmtTest = await badgeNFT.nativeRewards("firstBadgeProject");
      expect(nativeAmtTest.toString()).to.be.equal('1000000000000000000');
      await expect(badgeNFT.addBadgeCreationReward("firstBadgeProject", "0xd0A1E359811322d97991E03f863a0C30C2cF029C", false, "0xde0b6b3a7640000")).to.be.revertedWith("ERC20 not approved");
      
      //construct r,s, and v arrays
      let r = Array(2);
      let s = Array(2);
      let v = Array(2);
      let sig = await verifyNFTInfo(0,nonce, `${owner.address}`, `${badgeNFT.address}`, `${verify.address}`, "firstBadgeProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(nonceById, 2, `${owner.address}`, `${badgeNFT.address}`, `${verify.address}`, "firstBadgeProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)

      //vote for approval and check that everything updates as planned
      await badgeNFT.voteForApproval([`${addr5.address}`, `${addr6.address}`, "0xCf642913012CaBCBF09ca4f18748a430fA01237e", "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979", "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56"], "firstBadgeProject", "firstCourseProject", r, s, v, 2);
      expect(await verify.noncesParentIdChildId("firstCourseProject", "firstBadgeProject")).to.be.equal(1);
      expect(await verify.thresholdNoncesById("firstBadgeProject")).to.be.equal(1);
      expect(await badgeNFT.status("firstBadgeProject")).to.be.equal(1);
      expect(await badgeNFT.votes("firstBadgeProject")).to.be.equal(1);
      expect(await badgeNFT.reviewerVotes("firstBadgeProject", `${owner.address}`)).to.be.true;
      let contributors = await badgeNFT.getContributors("firstBadgeProject");
      expect(contributors.length).to.be.equal(5);//make sure contributors are added correctly

      //get signature for next voter
      sig = await verifyNFTInfo(0,1, `${addr1.address}`, `${badgeNFT.address}`, `${verify.address}`, "firstBadgeProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(1, 2, `${addr1.address}`, `${badgeNFT.address}`, `${verify.address}`, "firstBadgeProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)

      expect(await badgeNFT.reviewerVotes("firstCourseProject", `${addr1.address}`)).to.be.false;
      await badgeNFT.connect(addr1).voteForApproval([], "firstBadgeProject", "firstCourseProject", r, s, v, 2);
      expect(await verify.noncesParentIdChildId("firstCourseProject", "firstBadgeProject")).to.be.equal(2);
      expect(await verify.thresholdNoncesById("firstBadgeProject")).to.be.equal(2);
      expect(await badgeNFT.status("firstBadgeProject")).to.be.equal(3);
      expect(await badgeNFT.votes("firstBadgeProject")).to.be.equal(2);
      expect(await badgeNFT.reviewerVotes("firstBadgeProject", `${addr1.address}`)).to.be.true;


      nonce = await verify.noncesParentIdChildId("firstCourseProject", "firstBadgeProject");
      nonceById = await verify.thresholdNoncesById("firstBadgeProject");
      
      //get signature for pathway create Token
      sig = await verifyNFTInfo(0,nonce, `${addr1.address}`, `${badgeNFT.address}`, `${verify.address}`, "firstBadgeProject", false);
      r[0]=sig.r;
      s[0]=sig.s;
      v[0]=sig.v;
      sig = await verifyNFTInfo(nonceById, 2, `${addr1.address}`, `${badgeNFT.address}`, `${verify.address}`, "firstBadgeProject", true);
      r[1]=sig.r;
      s[1]=sig.s;
      v[1]=sig.v;
      console.log(`${r} \n ${s} \n ${v}`)

      expect(await adventurerNFTFactory.allAddrsLength()).to.be.equal(0);
      await badgeNFT.connect(addr1).createToken("badge_URI_String", "firstBadgeProject", "firstCourseProject", r, s, v, 2);

      let tokenURI;
      for(var i = 1 ; i<=contributors.length; i++){
        tokenURI = await badgeNFT.tokenURI(i);
        console.log(tokenURI);//should match "badge_URI_String"
      }
     
      let verifyClaimParams = {};
      let badgeNonce = await badgeNFT.nonces("firstBadgeProject", addrs[2].address);
      verifyClaimParams['account'] = `${addrs[2].address}`;
      verifyClaimParams['contract'] = `${badgeNFT.address}`;
      verifyClaimParams['chainId'] = 1337;
      verifyClaimParams['nonce'] = badgeNonce;
      verifyClaimParams['payload'] = 1;
      verifyClaimParams['badgeId'] = "firstBadgeProject";

      let sigClaim = await verifyClaimInfo(verifyClaimParams);

      balance = await ethers.provider.getBalance(addrs[2].address);
      console.log(balance.toString());
      balanceBefore = await ethers.provider.getBalance(badgeNFT.address);

      expect(await badgeNFT.numUsersRewardPerBadge("firstBadgeProject")).to.be.equal(200);
      expect(await badgeNFT.currentNumUsersRewardPerBadgeNative("firstBadgeProject")).to.be.equal(0);
      expect(await badgeNFT.userRewardedForBadgeNative("firstBadgeProject", `${addrs[2].address}`)).to.be.false;

      await badgeNFT.connect(addrs[2]).claimBadgeRewards("firstBadgeProject", true, `${addr1.address}`, sigClaim.r, sigClaim.s, sigClaim.v, true, "adventurer_URI", 1);
      balance = await ethers.provider.getBalance(addrs[2].address);
      console.log(balance.toString());
      balanceAfter = await ethers.provider.getBalance(badgeNFT.address);
      console.log(`Badge Balance after is ${balanceAfter} but before was ${balanceBefore}`);
      expect(await badgeNFT.currentNumUsersRewardPerBadgeNative("firstBadgeProject")).to.be.equal(1);
      expect(await badgeNFT.userRewardedForBadgeNative("firstBadgeProject", `${addrs[2].address}`)).to.be.true;

      const nftAddrs = await badgeNFT.getAllAddrsByBadgeIDVersion("firstBadgeProject", 1);
      const nftTokens = await badgeNFT.getAllTokenIdsByBadgeIDVersion("firstBadgeProject", 1);
      const adventureId = nftTokens[0];
      expect(nftAddrs.length).to.be.equal(1);
      expect(await badgeNFT.ownerOf(adventureId)).to.be.equal(addrs[2].address);
      expect(await badgeNFT.tokenURI(adventureId)).to.be.equal("adventurer_URI");
      //test that adventurer factory worked and minted an NFT in the clone
      // const addressAdventureNFT = await adventurerNFTFactory.getNFTAddrs("firstBadgeProject");
      // console.log(addressAdventureNFT);
      // expect(await adventurerNFTFactory.allAddrsLength()).to.be.equal(1);
      // const adventureNFTInstance = adventureNFTImpl.attach(`${addressAdventureNFT}`);
      // expect(await adventureNFTInstance.ownerOf(1)).to.be.equal(`${addrs[2].address}`);


    })
  })
  
})