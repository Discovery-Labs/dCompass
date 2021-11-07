import {
  Flex,
  HStack,
  Link,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { FaGithub } from "react-icons/fa";

import GitcoinIcon from "../Icons/GitcoinIcon";
import LogoDarkIcon from "../Icons/LogoDarkIcon";

const Footer = () => {
  return (
    <Box as="footer" width="full" alignContent="center" pt="8" pb="12">
      <HStack alignItems="center" justifyContent="space-between" width="full">
        <Link
          href="https://www.notion.so/gitcoin/GitcoinDAO-be541eac15354fdc94655965aa7fbc39"
          isExternal
        >
          <HStack>
            <Text>Built with 💜 by </Text>
            <Box mr="4">
              <LogoDarkIcon />
            </Box>
            <Text ml="4">Discovery DAO &amp; </Text>
            <GitcoinIcon />
            <Text ml="4">Gitcoin DAO</Text>
          </HStack>
        </Link>

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
      </HStack>
    </Box>
  );
};

export default Footer;
