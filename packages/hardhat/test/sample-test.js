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
})