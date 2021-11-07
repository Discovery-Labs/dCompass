import { Box, Button, Flex } from "@chakra-ui/react";
import { Stack } from "@chakra-ui/layout";
import React from "react";
import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Box marginLeft="auto">
        <Stack direction="row" spacing={6}>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <Link href="/dapp/projects/" passHref>
            <Button w="sm">Projects</Button>
          </Link>
          <ThemeToggle />
        </Stack>
      </Box>
    </Flex>
  );
};

export default Header;
