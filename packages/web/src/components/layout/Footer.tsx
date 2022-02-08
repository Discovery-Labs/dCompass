import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Link,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { ReactNode } from "react";

import TwitterButton from "components/Buttons/TwitterButton";
import DiscordButton from "components/Buttons/DiscordButton";

import { Icon } from "@chakra-ui/icon";
import { FaGithub } from "react-icons/fa";

import GitcoinIcon from "../Icons/GitcoinIcon";
import LogoDarkIcon from "../Icons/LogoDarkIcon";

function Footer() {
  return (
    <Container
      as={Stack}
      maxW={"6xl"}
      py={4}
      direction={{ base: "column", md: "row" }}
      spacing={4}
      justify={{ base: "center", md: "space-between" }}
      align={{ base: "center", md: "center" }}
    >
      {/* <Link
        w="full"
        href="https://www.notion.so/gitcoin/GitcoinDAO-be541eac15354fdc94655965aa7fbc39"
        isExternal
      > */}
      <HStack w="full">
        <Text textAlign={{ base: "center", md: "start" }}>
          Built with 💜 by {/* <LogoDarkIcon /> */}
          Discovery DAO &amp; {/* <GitcoinIcon /> */}
          Gitcoin DAO
        </Text>
      </HStack>
      {/* </Link> */}
      <Stack direction={"row"} spacing={6}>
        <DiscordButton />
        <TwitterButton />
        <Link href="https://github.com/discovery-labs/dCompass" isExternal>
          <Icon
            as={FaGithub}
            w={35}
            h={35}
            color="purple.500"
            _hover={{
              color: "green.500",
            }}
          />
        </Link>
      </Stack>
    </Container>
  );
}

export default Footer;
