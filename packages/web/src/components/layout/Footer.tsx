import { Box, Flex, Link, Text } from "@chakra-ui/react";

import QDIcon from "../Icons/LogoIcon";

const Footer = () => {
  return (
    <Box as="footer" width="full" alignContent="center" pt="8" pb="12">
      <Flex alignItems="center" justifyContent="center">
        <QDIcon />
        <Text ml="4">
          <Link
            href="https://showcase.ethglobal.com/hackfs2021/discovery"
            isExternal
          >
            dCompass 2021
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
