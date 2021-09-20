import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";

import CodeBlock from "../components/CodeBlock";
import CTASection from "components/CTASection";
import SomeImage from "components/SomeImage";
import SomeText from "components/SomeText";

const Home = () => {
  const { authenticate, isAuthenticated, user, logout, enableWeb3 } =
    useMoralis();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated, user]);

  const handleLogin = async () => {
    enableWeb3();
    await authenticate();
  };
  const {
    account: { getNativeBalance },
  } = useMoralisWeb3Api();

  const getNativeBalanceQuery = useMoralisWeb3ApiCall(getNativeBalance, {
    chain: "mumbai",
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
