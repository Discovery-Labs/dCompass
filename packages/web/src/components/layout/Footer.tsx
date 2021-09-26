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

const Footer = () => {
  return (
    <Box as="footer" width="full" alignContent="center" pt="8" pb="12">
      <HStack alignItems="center" justifyContent="space-between" width="full">
        <Flex alignItems="center" justifyContent="center">
          <GitcoinIcon />
          <Text ml="4">
            <Link href="https://moonshotcollective.space/" isExternal>
              Built with 💜 by the Gitcoin community | Moonshot Collective
            </Link>
          </Text>
        </Flex>
        <Link href="https://github.com/moonshotcollective" isExternal>
          <Icon
            as={FaGithub}
            w={35}
            h={35}
            color="purple.500"
            _hover={{
              color: "yellow.500",
            }}
          />
        </Link>
      </HStack>
    </Box>
  );
};

export default Footer;
