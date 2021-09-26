import { Button } from "@chakra-ui/button";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import { MoralisChainId } from "../../types";
import BalancesButton from "./BalancesButton";
import LogoutButton from "./LogoutButton";

function ConnectButton() {
  const {
    authenticate,
    isAuthenticated,
    user,
    logout,
    enableWeb3,
    Moralis,
    web3,
  } = useMoralis();
  const [address, setAddress] = useState("");
  const [chainId, setChainId] = useState<MoralisChainId>(undefined);

  useEffect(() => {
    if (isAuthenticated && user) {
      setAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    Moralis.Web3.onChainChanged((newChainId) => {
      console.log("chain changed to: ", newChainId);
      setChainId(newChainId as MoralisChainId);
    });
    Moralis.Web3.onAccountsChanged((accounts) => {
      console.log("account changed to: ", accounts[0]);
      setAddress(accounts[0]);
    });
  }, [Moralis.Web3]);

  const handleLogin = async () => {
    enableWeb3();
    await authenticate();
  };
  const {
    account: { getNativeBalance },
  } = useMoralisWeb3Api();

  const getNativeBalanceQuery = useMoralisWeb3ApiCall(getNativeBalance, {
    chain: chainId,
    address,
  });

  if (!isAuthenticated) {
    return (
      <Button onClick={handleLogin} type="button">
        Authenticate
      </Button>
    );
  }
  return (
    <Box w="full">
      <BalancesButton chainId={chainId} address={address} />
      <LogoutButton onClick={logout} ml="5" />
    </Box>
  );
}

export default ConnectButton;
