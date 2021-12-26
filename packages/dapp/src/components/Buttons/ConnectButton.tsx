import { Button, HStack } from "@chakra-ui/react";
import { useContext } from "react";

import { Web3Context } from "../../contexts/Web3Provider";
import Address from "../custom/Address";

function ConnectButton({ w }: { w?: string }) {
  const { account, connectWeb3, logout } = useContext(Web3Context);

  return (
    <HStack w="full">
      {account ? (
        <>
          <Address
            address={account}
            value={account}
            logout={logout}
            fontSize="18px"
            size="short"
          />
          <Button onClick={logout}>Logout</Button>
          {/* <MenuOptions /> */}
        </>
      ) : (
        <Button onClick={connectWeb3} w={w}>
          Connect
        </Button>
      )}
    </HStack>
  );
}

export default ConnectButton;
