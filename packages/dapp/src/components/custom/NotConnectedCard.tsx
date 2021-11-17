import { Text, Heading, VStack, Box } from "@chakra-ui/react";

import ConnectButton from "../Buttons/ConnectButton";

function NotConnectedCard() {
  return (
    <VStack align="left" w="100%" spacing="0.5rem">
      <Heading fontSize="1.5rem">Wallet not connected</Heading>
      <Text pb="2rem" fontSize="1rem">
        Please connect a wallet to continue.
      </Text>
      <Box justifyContent="center">
        <ConnectButton w="100%" />
      </Box>
    </VStack>
  );
}

export default NotConnectedCard;
