import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" align="center">
      <Text>
        {new Date().getFullYear()} -{" "}
        <Link href="https://moonshotcollective.space/" isExternal>
          Moonshot Collective
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
