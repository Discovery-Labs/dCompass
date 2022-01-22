import { SimpleGrid } from "@chakra-ui/react";
import NFTCard from "components/custom/dashboard/NFTCard";
import { Web3Context } from "contexts/Web3Provider";
import { ethers } from "ethers";
import { resolveConfig } from "prettier";
import React, { useContext, useEffect, useState } from "react";
import ABI from "./TestNFTContractABI";

function UserNFTs() {
  const NFTIds = ["1", "0"];
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";
  const [userNFTs, setUserNFTs] = useState<Array<string>>();

  const { account, provider } = useContext(Web3Context);

  useEffect(() => {
    async function getUserNFTIds() {
      if (account && provider) {
        const signer = provider.getSigner();

        const BadgeNFTContract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          ABI,
          signer
        );

        const filteredNFTIds: Array<string> = [];
        NFTIds.forEach((id) => {
          BadgeNFTContract.balanceOf(account, id).then((bal) => {
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
  }, [account, provider]);

  useEffect(() => {
    async function getUserNFTIds() {
      if (account && provider) {
        const words = [
          "spray",
          "limit",
          "elite",
          "exuberant",
          "destruction",
          "present",
        ];

        const result = words.filter((word) => word.length > 6);

        console.log(result);
      }
    }
    getUserNFTIds();
  }, [account, provider]);

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
