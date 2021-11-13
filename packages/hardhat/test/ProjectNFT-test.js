const { expect } = require("chai");
const { smock } = require('@defi-wonderland/smock');
const { BigNumber, Contract } = require("ethers");

describe("ProjectNFT", function() {
    
    it("tokenId is 10 and threshold 40", async function() {
      const ProjectFactory = await smock.mock('ProjectNFT');
    projectNFT = await ProjectFactory.deploy("0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631", ["0xA072f8Bd3847E21C8EdaAf38D7425631a2A63631", "0x2c0B08C414A8EE088596832cf64eFcA283D46703", "0x16eBE01dCae1338f8d1802C63712C5279e768d29", "0x3E31155a1c17c9F85e74828447aec412090a4622", "0x4678854dB7421fF1B3C5ACAe6c5C11e73f4F5702", "0xDAFf97a69408Cdb4AeFE331eA029a55e189ef60b"], 10);
      await projectNFT.setVariable('_tokenIds', {
        _value : 10,
      })
      await projectNFT.setVariable('multiSigThreshold', 40);
      //expect(await projectNFT.getCurrentId()).to.be.equal(10);
      expect(await projectNFT.multiSigThreshold()).to.be.equal(40);
      expect(await projectNFT.multiSigThreshold).to.have.been.called(1);
  })
})

/*
describe("DAOMart", function() {
  it("Should create and execute market sales", async function() {
    const Market = await ethers.getContractFactory("DAOMart")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")
  
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })
    
    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})

    const marketItems = await market.fetchMarketItems()
    const formattedMarketItems = await Promise.all(marketItems.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      return {
        price: i.price.toString(),
        tokenId: i.price.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
    }))
    console.log('items: ', formattedMarketItems)
  })
})*/