import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

import { Web3Context } from "../../contexts/Web3Provider";
import ConnectButton from "../Buttons/ConnectButton";
import LogoIcon from "../Icons/LogoIcon";

const LinkItem = ({ href, _target, children, ...props }: any) => {
  const { pathname } = useRouter();
  let isActive = false;

  if (href !== "/") {
    const [, path] = href.split("/");
    isActive = pathname.includes(path);
  } else if (href === pathname) {
    isActive = true;
  }

  return (
    <NextLink href={href} passHref>
      <Link
        p={2}
        color={isActive ? "primary.300" : "neutralLigher"}
        _target={_target}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  );
};

const Navbar = (props: any) => {
  const { account, isReviewer } = useContext(Web3Context);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      top="0"
      bg="neutralDarker"
      style={{ backdropFilter: "blur(10px)" }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p="2"
        maxW="7xl"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <IconButton
          size="md"
          px="2"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={4} alignItems="center">
          <Box px="2">
            <NextLink href="/">
              <Flex _hover={{ cursor: "pointer" }} align="center" mr={5}>
                <LogoIcon size="25px" />
                <Heading fontSize="lg" pl="2">
                  dCompass
                </Heading>
              </Flex>
            </NextLink>
          </Box>
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <LinkItem href="/">Projects</LinkItem>
            <LinkItem href="/quests">Quests</LinkItem>
            <LinkItem href="/dashboard">Dashboard</LinkItem>
          </HStack>
        </HStack>
        <Spacer />
        <Flex alignItems="center">
          {account && isReviewer && (
            <LinkItem href="/projects/review">
              <Tag variant="outline" colorScheme="green">
                <TagLabel>Reviews</TagLabel>
              </Tag>
            </LinkItem>
          )}
          <ConnectButton />
        </Flex>
      </Container>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            <LinkItem href="/">Projects</LinkItem>
            <LinkItem href="/quests">Quests</LinkItem>
            <LinkItem href="/dashboard">Dashboard</LinkItem>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
