import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

import ABI from "components/custom/dashboard/TestNFTContractABI";
import { Web3Context } from "contexts/Web3Provider";

function useWalletMembershipAccess() {
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";
  const NFT_TOKEN_ID = "0";

  const { account } = useContext(Web3Context);
  const { library } = useWeb3React();
  const [access, setAccess] = useState(false);
  const [accessNFTContract, setAccessNFTContract] = useState<ethers.Contract>();

  useEffect(() => {
    async function getAccessNFTContract() {
      if (account && library) {
        const signer = library.getSigner();

        const NFTMinterContract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          ABI,
          signer
        );
        setAccessNFTContract(NFTMinterContract);
      }
    }
    getAccessNFTContract();
  }, [account, library]);

  useEffect(() => {
    async function checkWalletMembership() {
      if (accessNFTContract && account && library) {
        const balance = await accessNFTContract.balanceOf(
          account,
          NFT_TOKEN_ID
        );
        return balance.toNumber() >= 1;
      }
      return false;
    }
    checkWalletMembership().then(setAccess);
  }, [accessNFTContract, account, library]);

  return access;
}
export default useWalletMembershipAccess;
