import { Text, Heading, VStack, Box } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import ConnectButton from "../Buttons/ConnectButton";

function NotConnectedCard() {
  const { t } = useTranslation("common");

  return (
    <VStack align="left" w="100%" spacing="0.5rem">
      <Heading fontSize="1.5rem">{t("wallet-not-connected")}</Heading>
      <Text pb="2rem">{t("wallet-not-connected-desc")}</Text>
      <Box justifyContent="center">
        <ConnectButton w="100%" />
      </Box>
    </VStack>
  );
}

export default NotConnectedCard;
