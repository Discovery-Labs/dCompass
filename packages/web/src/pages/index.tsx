import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";

import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { toast, Toaster } from "react-hot-toast";

import CodeBlock from "../components/CodeBlock";
import CTASection from "components/CTASection";
import SomeImage from "components/SomeImage";
import SomeText from "components/SomeText";
import { MoralisChainId } from "../types";

const Home = () => {
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

  const handleSuperStream = async () => {
    if (!isAuthenticated) {
      return toast("Login to start streaming");
    }
    const sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(web3?.givenProvider),
    });
    await sf.initialize();
    const superUser = sf.user({
      address: address,
      token: "0x745861aed1eee363b4aaa5f1994be40b1e05ff90",
    });
    await superUser.flow({
      recipient: "0x7E13623dd5D070967c8568066bE81a3E5bF75226",
      flowRate: "385802469135802",
    });

    const details = await superUser.details();
    console.log(details);
    toast("Stream started");
    // Stop the stream
    await superUser.flow({
      recipient: "0x7E13623dd5D070967c8568066bE81a3E5bF75226",
      flowRate: "0",
    });
    toast("Stream stopped");
  };

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
      <div>
        <Button onClick={() => handleLogin()} type="button">
          Authenticate
        </Button>
      </div>
    );
  }
  return (
    <Box mb={8} w="full">
      <Toaster />
      <div>
        <Button onClick={handleSuperStream} type="button">
          Start Streaming
        </Button>
      </div>
      <div>
        <Button onClick={() => logout()} type="button">
          Logout
        </Button>
      </div>
      <div>
        <h1>Welcome {user && user.get("username")}</h1>
        <h1>Address {address}</h1>
        <Button onClick={() => getNativeBalanceQuery.fetch()} type="button">
          Get Balance
        </Button>
        <CodeBlock>{JSON.stringify(getNativeBalanceQuery, null, 2)}</CodeBlock>
      </div>
      <SomeText />
      <SomeImage />
      <CTASection />
    </Box>
  );
};

export default Home;
