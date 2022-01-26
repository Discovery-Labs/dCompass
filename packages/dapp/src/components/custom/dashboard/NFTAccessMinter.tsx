import { Box, Button, Center, Flex, Text, VStack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import NFTCard from "components/custom/dashboard/NFTCard";
import CenteredFrame from "components/layout/CenteredFrame";
import { Web3Context } from "contexts/Web3Provider";

import ABI from "./TestNFTContractABI";

function NFTAccessMinter() {
  const { account } = useContext(Web3Context);
  const { library } = useWeb3React();

  const router = useRouter();
  // const [cantMintText, setCantMintText] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [totalSupply, setTotalSupply] = useState("?");
  const [minterContract, setMinterContract] = useState<ethers.Contract>();
  const tokenId = "0";
  const NFT_CONTRACT_ADDRESS = "0xCb9Ce2fa1EBef370CC060aD65294075EDdC7f8Ea";

  useEffect(() => {
    async function getMinterContract() {
      if (account && library) {
        const signer = library.getSigner();

        const NFTMinterContract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          ABI,
          signer
        );
        setMinterContract(NFTMinterContract);
      }
    }
    getMinterContract();
  }, [account, library]);

  useEffect(() => {
    async function getTotalSupply() {
      if (minterContract !== undefined) {
        const resTotalSupply = await minterContract.totalSupply(tokenId);
        const stringTotalSupply = resTotalSupply?.toString() || "?";
        setTotalSupply(stringTotalSupply);
        // console.log(`totalSupply`, totalSupply);
      }
    }
    getTotalSupply();
  }, [minterContract]);

  const mintNFT = () => {
    if (minterContract !== undefined) {
      setIsClaiming(true);
      // minterContract?.canClaim(tokenId, 1, account).then((canMint: boolean) => {
      //   if (!canMint) {
      //     setCantMintText("You cannot mint");
      //   }
      // });

      minterContract
        ?.claim(tokenId, 1, [])
        .then(() => {
          router.push("./");
          console.log(
            `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${minterContract.address}/${tokenId}`
          );
        })
        .catch((err: any) => {
          console.error("failed to claim", err);
        })
        .finally(() => {
          // Stop loading state.
          setIsClaiming(false);
        });
    }
  };

  return (
    <CenteredFrame>
      <Center py="8">
        <Flex align="center" direction="column">
          <Text>You are not a member yet</Text>
          <Text as="h1" textStyle="h1">
            Mint your pass on rinkeby
          </Text>
        </Flex>
      </Center>
      {/* <SimpleGrid pt="8" columns={[1, null, 3]} spacing="40px"></SimpleGrid> */}
      <Box w="sm" layerStyle="solid-card">
        <VStack>
          <NFTCard contractAddress={NFT_CONTRACT_ADDRESS} tokenId={tokenId} />
          <Box>
            <Text>- Receive exclusive airdrops</Text>
            <Text>- Gain access to Alpha</Text>
            <Text>- Be involved in future beta testing</Text>
          </Box>
          <Box pt="8" w="full">
            <Button w="full" isLoading={isClaiming} onClick={() => mintNFT()}>
              Mint
            </Button>
          </Box>
          {/* <Text fontSize="sm" color="red.400">
            {cantMintText}
          </Text> */}
          <Text>Total Supply {totalSupply} / 30</Text>
        </VStack>
      </Box>
    </CenteredFrame>
  );
}

export default NFTAccessMinter;
