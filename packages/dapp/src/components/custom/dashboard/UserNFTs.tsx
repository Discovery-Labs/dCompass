import { SimpleGrid } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

import NFTCard from "components/custom/dashboard/NFTCard";
import { Web3Context } from "contexts/Web3Provider";

import ABI from "./TestNFTContractABI";

function UserNFTs() {
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";
  const [userNFTs, setUserNFTs] = useState<Array<string>>();
  const { library } = useWeb3React();
  const { account } = useContext(Web3Context);

  useEffect(() => {
    const NFTIds = ["1", "0"];
    async function getUserNFTIds() {
      if (account && library) {
        const signer = library.getSigner();

        const BadgeNFTContract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          ABI,
          signer
        );

        const filteredNFTIds: Array<string> = [];
        NFTIds.forEach((id) => {
          BadgeNFTContract.balanceOf(account, id).then((bal: any) => {
            if (bal !== undefined && bal.toNumber() > 0) {
              filteredNFTIds.push(id);
            }
          });
        });
        setUserNFTs(filteredNFTIds);
        console.log("filteredNFTIds", filteredNFTIds);
      }
    }
    getUserNFTIds();
  }, [account, library]);

  return (
    <SimpleGrid columns={[2, null, 3]} spacing="40px">
      {userNFTs &&
        userNFTs.length > 0 &&
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
