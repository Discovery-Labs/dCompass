import { Box, Button, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Web3Provider } from "@ethersproject/providers";

import { useMoralis } from "react-moralis";
import SuperfluidSDK from "@superfluid-finance/js-sdk";

import WelcomeText from "components/static/WelcomeText";
import ProjectModal from "./projects/ProjectModal";

function Dapp() {
  const { isAuthenticated, user, web3 } = useMoralis();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated, user]);

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

  return (
    <Box mb={8} w="full">
      <WelcomeText
        username={user ? user.get("username") : "Anon"}
        address={address}
      />
      {isAuthenticated && (
        <VStack>
          <Toaster />
          <div>
            <Button onClick={handleSuperStream} type="button">
              Start Streaming
            </Button>

            <ProjectModal />
          </div>
        </VStack>
      )}
    </Box>
  );
}

export default Dapp;
