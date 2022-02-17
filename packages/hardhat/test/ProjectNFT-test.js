const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();
const { smock } = require("@defi-wonderland/smock");
const { BigNumber, Contract } = require("ethers");
const buildList = require("@uniswap/default-token-list");

describe("ProjectNFT", function () {
  let ProjectFactory;
  let projectNFT;
  let owner;
  let addr1, addr2, addr3, addr4, addr5, addr6;
  let addrs;
  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrs] =
      await ethers.getSigners();
    ProjectFactory = await ethers.getContractFactory("ProjectNFT");
    projectNFT = await ProjectFactory.deploy(
      `${owner.address}`,
      [
        `${owner.address}`,
        `${addr1.address}`,
        `${addr2.address}`,
        `${addr3.address}`,
        `${addr4.address}`,
      ],
      10
    );
    await projectNFT.deployed();
    VerifyFactory = await ethers.getContractFactory("Verify");
    verify = await VerifyFactory.deploy(`${process.env.SERVER_ADDRESS}`, [
      `${owner.address}`,
      `${addr1.address}`,
      `${addr2.address}`,
      `${addr3.address}`,
      `${addr4.address}`,
    ]);
    await verify.deployed();
    RandomNumberConsumerFactory = await ethers.getContractFactory(
      "RandomNumberConsumer"
    );
    rng = await RandomNumberConsumerFactory.deploy([
      `${owner.address}`,
      `${addr1.address}`,
      `${addr2.address}`,
      `${addr3.address}`,
      `${addr4.address}`,
    ]);
    await rng.deployed();
    PathwayFactory = await ethers.getContractFactory("PathwayNFT");
    pathwayNFT = await PathwayFactory.deploy(
      `${rng.address}`,
      `${projectNFT.address}`,
      `${verify.address}`
    );
    await pathwayNFT.deployed();
    SponsorSFTFactory = await ethers.getContractFactory("SponsorPassSFT");
    sponsorSFT = await SponsorSFTFactory.deploy(
      [`0xde0b6b3a7640000`, `0x29a2241af62c0000`, `0x4563918244f40000`],
      `${projectNFT.address}`
    );
    await sponsorSFT.deployed();
    AppDiamondFactory = await ethers.getContractFactory("AppDiamond");
    appDiamond = await AppDiamondFactory.deploy(
      `${projectNFT.address}`,
      `${pathwayNFT.address}`,
      `${verify.address}`,
      `${sponsorSFT.address}`,
      `${process.env.SERVER_ADDRESS}`
    );
    await appDiamond.deployed();
    const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
    const diamondCutFacet = await DiamondCutFacet.deploy();
    await diamondCutFacet.deployed();
  });

  describe("Testing deployment and voting", function () {
    it("testing constructor and reviewer setters and getters", async function () {
      //set in constructor
      expect(await projectNFT.multiSigThreshold()).to.be.equal(10);
      expect(await projectNFT.numReviewers()).to.be.equal(5);
      expect(await projectNFT.owner()).to.be.equal(`${owner.address}`);
      expect(await projectNFT.statusStrings(0)).to.be.equal("NONEXISTENT");
      expect(await projectNFT.statusStrings(1)).to.be.equal("PENDING");
      expect(await projectNFT.statusStrings(2)).to.be.equal("DENIED");
      expect(await projectNFT.statusStrings(3)).to.be.equal("APPROVED");

      //reviewers can change Threshold, and add reviewers
      await projectNFT.setThreshold(40);
      expect(await projectNFT.multiSigThreshold()).to.be.equal(40);
      await projectNFT.connect(addr1).setThreshold(30);
      expect(await projectNFT.multiSigThreshold()).to.be.equal(30);
      await projectNFT.connect(addr3).addReviewer(`${addr5.address}`);
      expect(await projectNFT.numReviewers()).to.be.equal(6);
      await projectNFT.connect(addr5).setStatusString(2, "DEPRECATED");
      expect(await projectNFT.statusStrings(2)).to.be.equal("DEPRECATED");

      //check all reviewers
      expect(
        await projectNFT.reviewers("0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631")
      ).to.be.false;
      expect(await projectNFT.reviewers(`${addr1.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${addr2.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${addr3.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${addr4.address}`)).to.be.true;
      expect(await projectNFT.reviewers(`${owner.address}`)).to.be.true;

      //check setters and getters
      await projectNFT.connect(addr2).setAppDiamond(appDiamond.address);
      expect(await projectNFT.getAppDiamond()).to.be.equal(
        `${appDiamond.address}`
      );
      await projectNFT.connect(addr4).setSFTAddr(sponsorSFT.address);
      expect(await projectNFT.getSFTAddr()).to.be.equal(
        `${sponsorSFT.address}`
      );
      //not a reviewer
      await expect(
        sponsorSFT.connect(addrs[0]).setStakeAmounts(1, `0xde0b6b3a7640000`)
      ).to.be.revertedWith("not approved app reviewer");
      //id does not exist
      await expect(
        sponsorSFT.connect(addr3).setStakeAmounts(5, `0xde0b6b3a7640000`)
      ).to.be.revertedWith("invalid _tokenId");

      const chainIdString = process.env.CHAIN_IDS.split(" ");
      let chainIds = Array();
      chainIdString.map((value) => {
        chainIds.push(Number(value));
      });
      const chainAddrObj = {};
      chainIds.forEach((value) => {
        chainAddrObj[value] = [];
      });
      const tokens = buildList.tokens;
      tokens.map((value, index) => {
        if (chainIds.includes(value.chainId)) {
          chainAddrObj[value.chainId].push(value.address);
        }
      });
      for (let i = 0; i < chainIds.length; i++) {
        await appDiamond.addERC20PerChain(
          chainIds[i],
          chainAddrObj[chainIds[i]]
        );
      }

      for (let j = 0; j < chainIds.length; j++) {
        expect(await appDiamond.getERC20Addrs(chainIds[j])).to.be.eql(
          chainAddrObj[chainIds[j]]
        );
      }
    });

    it("When threshold is 10 should approve right away", async function () {
      await projectNFT.connect(addr2).setAppDiamond(appDiamond.address);
      await projectNFT.setSFTAddr(sponsorSFT.address);
      await projectNFT
        .connect(addr6)
        .addProjectWallet("firstTestProject", `${addr5.address}`, "SILVER", {
          value: `0xde0b6b3a7640000`,
        });
      let balance = await ethers.provider.getBalance(addr6.address);
      console.log(balance.toString());
      await projectNFT.voteForApproval(
        [
          `${addr5.address}`,
          `${addr6.address}`,
          "0xCf642913012CaBCBF09ca4f18748a430fA01237e",
          "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979",
          "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56",
        ],
        15,
        "firstTestProject"
      );
      expect(await projectNFT.status("firstTestProject")).to.be.equal(3); //approve Enum value
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${owner.address}`)
      ).to.be.true; //person who voted is marked true
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${addr1.address}`)
      ).to.be.false; //reviewer who didn't vote is still false
      expect(await projectNFT.votes("firstTestProject")).to.be.equal(1); //1 vote needed for approval
      let contributors = await projectNFT.getContributors("firstTestProject");
      expect(contributors.length).to.be.equal(5); //make sure contributors are added correctly
      await projectNFT
        .connect(addr6)
        .addProjectContributor("firstTestProject", `${addrs[0].address}`);
      contributors = await projectNFT.getContributors("firstTestProject");
      expect(contributors.length).to.be.equal(6); //make sure contributors can be added before mint
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.false; //not minted yet
      expect(
        await projectNFT.projectThresholds("firstTestProject")
      ).to.be.equal(15); //threshold for project set to 15

      await projectNFT
        .connect(addr2)
        .createToken(
          [
            "0x01701220",
            "0x01701220",
            "0x01701220",
            "0x01701220",
            "0x01701220",
            "0x01701220",
          ],
          [
            "0x8cb97a00a6c90a14ecf182d8363583d402f69919e38f0498edd9d92a5c02a7b4",
            "0xaaee392e31f4dc5c9aba87c950b4208b71eb628a0d76137317337faa9084beef",
            "0x7d836ef7074053a1e29f313f86e45e7d736c8aedb37c9d9ef9a748b6708978ef",
            "0xf4ae025d8039f4914e27df2749b9f07763e8daa85947e1b8f462620e73d71015",
            "0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301",
            "0xc15bae8993b2c85b9f3c48a9f13ff30c886db784a23dccc026a688df93a19301",
          ],
          "firstTestProject"
        );
      let tokenURI;
      for (var i = 1; i <= contributors.length; i++) {
        tokenURI = await projectNFT.tokenURI(i);
        console.log(tokenURI); //should match ipfs://f + first array[i] + second array[i]
      }
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.true; //Project minted

      //checking mint balances
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.true; //Project minted
      balance = await ethers.provider.getBalance(addr5.address);
      console.log(balance.toString());
      expect(await appDiamond.projApproved("firstTestProject")).to.be.true; //now minted

      //check project refund fails when app wallet or project doesn't exist
      await expect(
        projectNFT
          .connect(addr1)
          .projectRefund("firstTestProject", {
            value: "0x6F05B59D3B200000".toLowerCase(),
          })
      ).to.be.revertedWith("wrong sender"); //not App wallet
      await expect(
        projectNFT
          .connect(owner)
          .projectRefund("secondTestProject", {
            value: "0x6F05B59D3B200000".toLowerCase(),
          })
      ).to.be.revertedWith("incorrect status"); //project does not exist

      expect(await projectNFT.sponsorLevel("firstTestProject")).to.be.equal(1); //silver sponsor level
      expect(await projectNFT.projectWallets("firstTestProject")).to.be.equal(
        `${addr5.address}`
      ); //addr5 is project wallet address
      expect(await sponsorSFT.balanceOf(`${addr5.address}`, 1)).to.be.equal(1); //SFT minted now
      expect(await sponsorSFT.balanceOf(`${addr4.address}`, 1)).to.be.equal(0); //addr4 not project wallet
      await sponsorSFT
        .connect(addr5)
        .safeTransferFrom(`${addr5.address}`, `${addr4.address}`, 1, 1, "0x"); //transfer of sft and project wallet to addr4
      expect(await projectNFT.projectWallets("firstTestProject")).to.be.equal(
        `${addr4.address}`
      ); //addr4 is project wallet address
      expect(await sponsorSFT.balanceOf(`${addr5.address}`, 1)).to.be.equal(0); //addr5 transferred SFT to addr4
      expect(await sponsorSFT.balanceOf(`${addr4.address}`, 1)).to.be.equal(1); //addr4 now has 1 SFT

      //need 4 Eth for DIAMOND level only passed 2 Eth
      await expect(
        projectNFT
          .connect(addr4)
          .updateSponsorLevel("firstTestProject", "DIAMOND", {
            value: "0x1BC16D674EC80000".toLowerCase(),
          })
      ).to.be.revertedWith("insufficent funds for new level");
      let stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("1000000000000000000");
      //now should work for GOLD level
      await projectNFT
        .connect(addr4)
        .updateSponsorLevel("firstTestProject", "GOLD", {
          value: "0x1BC16D674EC80000".toLowerCase(),
        });
      expect(await projectNFT.sponsorLevel("firstTestProject")).to.be.equal(2); //gold sponsor level
      stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("3000000000000000000");
      //send 3 Eth, so 1 Eth refunded and 2 eth stored for upgrade
      await projectNFT
        .connect(addr4)
        .updateSponsorLevel("firstTestProject", "DIAMOND", {
          value: "0x29A2241AF62C0000".toLowerCase(),
        });
      expect(await projectNFT.sponsorLevel("firstTestProject")).to.be.equal(3); //diamond sponsor level
      stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("5000000000000000000");

      //changing staking amounts with non-reviewer
      await expect(
        sponsorSFT
          .connect(addrs[0])
          .setStakeAmounts(3, "0x3782DACE9D900000".toLowerCase())
      ).to.be.revertedWith("not approved app reviewer");
      //changing diamond stake amount from 5 eth to 4 Eth
      await sponsorSFT
        .connect(addr3)
        .setStakeAmounts(3, "0x3782DACE9D900000".toLowerCase());
      const diamondStake = await sponsorSFT.stakeAmounts(3);
      expect(diamondStake.toString()).to.be.equal("4000000000000000000");

      //will not get refund automatically even though diamond price changed lower unless refund is put there by app wallet since status is Approved
      balance = await ethers.provider.getBalance(addr4.address);
      console.log(balance.toString());
      await projectNFT
        .connect(addr4)
        .updateSponsorLevel("firstTestProject", "DIAMOND");
      stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("4000000000000000000");
      balance = await ethers.provider.getBalance(addr4.address);
      console.log(balance.toString());
    });

    it("This should reject and send money to the project Wallet", async function () {
      await projectNFT.connect(addr1).setThreshold(30);
      expect(await projectNFT.multiSigThreshold()).to.be.equal(30);
      await projectNFT.connect(addr2).setAppDiamond(appDiamond.address);
      await projectNFT.setSFTAddr(sponsorSFT.address);
      let balance = await ethers.provider.getBalance(addr6.address);
      console.log(`owner balance : ${balance.toString()}`);
      balance = await ethers.provider.getBalance(projectNFT.address);
      console.log(`nft contract balance : ${balance.toString()}`);
      await projectNFT
        .connect(addr6)
        .addProjectWallet("firstTestProject", `${owner.address}`, "DIAMOND", {
          value: `0x4563918244f40000`,
        });
      balance = await ethers.provider.getBalance(addr6.address);
      console.log(`address 6 balance : ${balance.toString()}`);
      balance = await ethers.provider.getBalance(projectNFT.address);
      console.log(`nft contract balance : ${balance.toString()}`);
      await projectNFT.voteForApproval(
        [
          `${addr5.address}`,
          `${addr6.address}`,
          "0xCf642913012CaBCBF09ca4f18748a430fA01237e",
          "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979",
          "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56",
        ],
        25,
        "firstTestProject"
      );
      expect(await projectNFT.status("firstTestProject")).to.be.equal(1); //Pending Enum value
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${owner.address}`)
      ).to.be.true; //person who voted is marked true
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${addr1.address}`)
      ).to.be.false; //reviewer who didn't vote is still false
      expect(await projectNFT.votes("firstTestProject")).to.be.equal(1); //1 vote cast for approval
      expect(await projectNFT.votesReject("firstTestProject")).to.be.equal(0); //0 votes cast so far votesReject
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.false; //not minted yet
      expect(
        await projectNFT.projectThresholds("firstTestProject")
      ).to.be.equal(25); //threshold for project set to 25

      //first rejection vote
      await projectNFT.connect(addr1).voteForRejection("firstTestProject");
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${addr1.address}`)
      ).to.be.true; //reviewer who rejected is now true
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${addr2.address}`)
      ).to.be.false; //reviewer who hasn't voted yet is false
      expect(await projectNFT.votes("firstTestProject")).to.be.equal(1); //1 vote cast for approval
      expect(await projectNFT.votesReject("firstTestProject")).to.be.equal(1); //1 votes cast for rejection
      expect(await projectNFT.status("firstTestProject")).to.be.equal(1); //still pending Enum value

      //project refund added since still pending
      await expect(
        projectNFT
          .connect(addr1)
          .projectRefund("firstTestProject", {
            value: "0x6F05B59D3B200000".toLowerCase(),
          })
      ).to.be.revertedWith("wrong sender"); //not App wallet
      await projectNFT
        .connect(owner)
        .projectRefund("firstTestProject", {
          value: "0x6F05B59D3B200000".toLowerCase(),
        });
      projectBalance = await projectNFT.refundPerProject("firstTestProject");
      console.log(`project refund amount is ${projectBalance.toString()}`);
      balance = await ethers.provider.getBalance(owner.address);
      console.log(`app wallet balance : ${balance.toString()}`);
      await projectNFT.updateSponsorLevel("firstTestProject", "DIAMOND");
      projectBalance = await projectNFT.refundPerProject("firstTestProject");
      console.log(`project refund amount is ${projectBalance.toString()}`);

      //changing diamond stake amount from 5 eth to 4 Eth
      await sponsorSFT
        .connect(addr3)
        .setStakeAmounts(3, "0x3782DACE9D900000".toLowerCase());
      const diamondStake = await sponsorSFT.stakeAmounts(3);
      expect(diamondStake.toString()).to.be.equal("4000000000000000000");

      //will get refund automatically since diamond price changed lower and status is Pending
      balance = await ethers.provider.getBalance(owner.address);
      console.log(`owner balance before refund : ${balance.toString()}`);
      await projectNFT
        .connect(owner)
        .updateSponsorLevel("firstTestProject", "DIAMOND");
      stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("4000000000000000000");
      balance = await ethers.provider.getBalance(owner.address);
      console.log(
        ` owner balance after diamond refund : ${balance.toString()}`
      );

      //will get refund automatically since project went down to Silver
      await projectNFT
        .connect(owner)
        .updateSponsorLevel("firstTestProject", "SILVER");
      expect(await projectNFT.sponsorLevel("firstTestProject")).to.be.equal(1); //silver sponsor level
      stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("1000000000000000000");
      balance = await ethers.provider.getBalance(owner.address);
      console.log(
        ` owner balance after silver refund :  ${balance.toString()}`
      );

      //will get rejected unless sending enough value to update level to Gold
      await expect(
        projectNFT
          .connect(owner)
          .updateSponsorLevel("firstTestProject", "GOLD", {
            value: "0xDE0B6B3A7640000".toLowerCase(),
          })
      ).to.be.revertedWith("insufficent funds for new level");

      //should be better not that sending 6 ETH (of which only 2 eth will go to contract and rest will be refunded)
      await projectNFT
        .connect(owner)
        .updateSponsorLevel("firstTestProject", "GOLD", {
          value: "0x53444835EC580000".toLowerCase(),
        });
      expect(await projectNFT.sponsorLevel("firstTestProject")).to.be.equal(2); //gold sponsor level
      stakeTest = await projectNFT.stakePerProject("firstTestProject");
      expect(stakeTest.toString()).to.be.equal("3000000000000000000");
      balance = await ethers.provider.getBalance(owner.address);
      console.log(
        ` owner balance after silver refund :  ${balance.toString()}`
      );

      //second rejection vote
      balance = await ethers.provider.getBalance(owner.address);
      console.log(`app wallet balance : ${balance.toString()}`);
      await projectNFT.connect(addr2).voteForRejection("firstTestProject");
      expect(
        await projectNFT.reviewerVotes("firstTestProject", `${addr2.address}`)
      ).to.be.true; //reviewer who rejected is now true
      expect(await projectNFT.votes("firstTestProject")).to.be.equal(1); //1 vote cast for approval
      expect(await projectNFT.votesReject("firstTestProject")).to.be.equal(2); //2 votes cast for rejection
      expect(await projectNFT.status("firstTestProject")).to.be.equal(2); // Denied Enum value
      await expect(
        projectNFT
          .connect(owner)
          .projectRefund("firstTestProject", {
            value: "0x6F05B59D3B200000".toLowerCase(),
          })
      ).to.be.revertedWith("incorrect status"); //project has denied status

      balance = await ethers.provider.getBalance(owner.address);
      console.log(`project wallet balance : ${balance.toString()}`);
      balance = await ethers.provider.getBalance(projectNFT.address);
      console.log(`nft contract balance : ${balance.toString()}`);
      expect(await projectNFT.projectMinted("firstTestProject")).to.be.false; //Project still not minted
    });
  });
});
