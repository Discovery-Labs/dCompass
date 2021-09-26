import { Box, Flex } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/layout";
import React from "react";

import ConnectButton from "../Buttons/ConnectButton";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Box marginLeft="auto">
        <Stack direction="row" spacing={4}>
          <ThemeToggle />
          <ConnectButton />
        </Stack>
      </Box>
    </Flex>
  );
};

export default Header;
