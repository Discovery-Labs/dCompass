import ABI from "components/custom/dashboard/TestNFTContractABI";
import { Web3Context } from "contexts/Web3Provider";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

function useWalletMembershipAccess() {
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";
  const NFT_TOKEN_ID = "0";

  const { account, provider } = useContext(Web3Context);
  const [access, setAccess] = useState(false);
  const [accessNFTContract, setAccessNFTContract] = useState<ethers.Contract>();

  async function getAccessNFTContract() {
    if (account && provider) {
      const signer = provider.getSigner();

      const NFTMinterContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      setAccessNFTContract(NFTMinterContract);
    }
  }
  useEffect(() => {
    getAccessNFTContract();
  }, [account, provider]);

  async function checkWalletMembership() {
    if (accessNFTContract && account && provider) {
      const balance = await accessNFTContract.balanceOf(account, NFT_TOKEN_ID);
      return balance.toNumber() >= 1;
    }
    return false;
  }
  useEffect(() => {
    checkWalletMembership().then(setAccess);
  }, [accessNFTContract, account, provider]);

  return access;
}
export default useWalletMembershipAccess;
