import React from "react";
import { Box, Flex, HStack, Stack, Heading, Button } from "@chakra-ui/react";
import ThemeToggle from "./ThemeToggle";
import NextLink from "next/link";
import LogoDarkIcon from "../Icons/LogoDarkIcon";
import TwitterButton from "../Buttons/TwitterButton";
import DiscordButton from "../Buttons/DiscordButton";

import useCustomColor from "hooks/useCustomColor";

export default function Navbar() {
  const { getPrimaryColor, getBgColor, getColoredText } = useCustomColor();
  const APP_URL = "https://dcompass-staging.herokuapp.com/";
  return (
    <Box>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <Flex _hover={{ cursor: "pointer" }} align="center" mr={5}>
            <NextLink href="/">
              <>
                <LogoDarkIcon size="35px" />
                <Box
                  display={{
                    base: "none",
                    sm: "block",
                  }}
                >
                  <Heading pl="4">dCompass</Heading>
                </Box>
              </>
            </NextLink>
          </Flex>
        </HStack>
        <Flex alignItems={"center"}>
          <Stack direction="row" spacing={3}>
            <DiscordButton />
            <TwitterButton />
            <ThemeToggle />
            <Box pl="8">
              <Box
                layerStyle="gradient-border"
                _hover={{
                  transform: "scale(1.05)",
                }}
                transition="all 0.3"
                transitionTimingFunction={"spring(1 100 10 10)"}
              >
                <Button
                  _hover={{ bgColor: getBgColor }}
                  bgColor={getBgColor}
                  variant="ghost"
                  onClick={() => window.open(APP_URL)}
                >
                  Enter App
                </Button>
              </Box>
            </Box>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
