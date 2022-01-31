import { SimpleGrid } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import BadgeItem from "./BadgeItem";
import ABI from "./TestNFTContractABI";

type Props = {
  account: string;
};

function AccountBadges({ account }: Props) {
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";
  const [userNFTs, setUserNFTs] = useState<Array<string>>();
  const { library } = useWeb3React();
  // const { account } = useContext(Web3Context);

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
    <SimpleGrid w="full" columns={[1, 2, 3]} spacing="40px">
      {userNFTs &&
        userNFTs.length > 0 &&
        userNFTs.map((id) => {
          return (
            <BadgeItem
              key={id}
              contractAddress={NFT_CONTRACT_ADDRESS}
              tokenId={id}
            />
          );
        })}
    </SimpleGrid>
  );
}

export default AccountBadges;
