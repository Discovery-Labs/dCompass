import { SimpleGrid } from "@chakra-ui/react";
import NFTCard from "components/custom/dashboard/NFTCard";
import { Web3Context } from "contexts/Web3Provider";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import ABI from "./TestNFTContractABI";

function UserNFTs() {
  const NFTIds = ["0", "1"];
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";
  const [userNFTs, setUserNFTs] = useState<Array<string>>();

  const { account, provider } = useContext(Web3Context);

  useEffect(() => {
    async function exec() {
      if (account && provider) {
        const signer = provider.getSigner();

        const BadgeNFTContract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          ABI,
          signer
        );
        const balance = await BadgeNFTContract.balanceOf(account, "0");
        console.log("balance", balance.toString());
        if (balance !== undefined) {
          return balance.toNumber() > 0;
        }
      }
      // const filteredNFTIds = NFTIds.filter(async (id) => {
      //   const balance = await bundleDropModule?.balanceOf(address, id);
      //   if (balance !== undefined) {
      //     return balance.toNumber() > 0;
      //   }
      //   return false;
      // });
      // setUserNFTs(filteredNFTIds);
    }
    exec();
  }, [account, provider]);

  return (
    <SimpleGrid columns={[2, null, 3]} spacing="40px">
      {userNFTs &&
        userNFTs.map((id) => {
          return (
            <NFTCard
              key={id}
              contractAddress={NFT_CONTRACT_ADDRESS}
              tokenId={id}
            />
          );
        })}
    </SimpleGrid>
  );
}

export default UserNFTs;
