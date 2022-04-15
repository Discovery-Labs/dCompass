import { Button, HStack, IconButton } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { IoMdExit } from "react-icons/io";

import { Web3Context } from "../../contexts/Web3Provider";
import Address from "../custom/Address";

function DrawerConnectButton({ w }: { w?: string }) {
  const { account, connectWeb3, logout } = useContext(Web3Context);
  const { t } = useTranslation("common");

  return (
    <HStack w="full">
      {account ? (
        <HStack>
          <Address
            address={account}
            value={account}
            logout={logout}
            fontSize="18px"
            size="short"
          />
          <IconButton aria-label="exit" icon={<IoMdExit />} onClick={logout} />
        </HStack>
      ) : (
        <Button onClick={connectWeb3} w={w}>
          {t("connect")}
        </Button>
      )}
    </HStack>
  );
}

export default DrawerConnectButton;
