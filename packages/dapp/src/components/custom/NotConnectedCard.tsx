import { Text, Heading, VStack, Box, Button } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";

import { Web3Context } from "../../contexts/Web3Provider";

function NotConnectedCard() {
  const { t } = useTranslation("common");
  const { connectWeb3 } = useContext(Web3Context);
  const [isConnecting, setIsConnecting] = useState(false);
  const handleConnect = async () => {
    setIsConnecting(true);
    await connectWeb3();
    return setIsConnecting(false);
  };
  return (
    <VStack align="left" w="100%" spacing="0.5rem">
      <Heading fontSize="1.5rem">{t("wallet-not-connected")}</Heading>
      <Text pb="2rem">{t("wallet-not-connected-desc")}</Text>

      <Box justifyContent="center">
        <Button
          onClick={handleConnect}
          w="100%"
          isLoading={isConnecting}
          loadingText="Connecting..."
        >
          {t("connect")}
        </Button>
      </Box>
    </VStack>
  );
}

export default NotConnectedCard;
