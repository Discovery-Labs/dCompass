import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Spacer,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

import { Web3Context } from "../../contexts/Web3Provider";
import useCustomColor from "../../core/hooks/useCustomColor";
import ConnectButton from "../Buttons/ConnectButton";
import LanguageButton from "../Buttons/LanguageButton";
import NetworkSwitch from "../custom/NetworkSwitch";
import LogoIcon from "../Icons/LogoIcon";

import ThemeToggle from "./ThemeToggle";

const LinkItem = ({ href, _target, children, ...props }: any) => {
  const { pathname } = useRouter();
  let isActive = false;
  const { getPrimaryColor, getTextColor } = useCustomColor();

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
        color={isActive ? getPrimaryColor : getTextColor}
        _target={_target}
        _hover={{ color: getPrimaryColor, textDecoration: "none" }}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  );
};

const LinkItems = () => {
  return (
    <>
      <LinkItem href="/">Projects</LinkItem>
      <LinkItem href="/quests">Quests</LinkItem>
      <LinkItem href="/dashboard">Dashboard</LinkItem>
    </>
  );
};

const Navbar = (props: any) => {
  const { account, isReviewer } = useContext(Web3Context);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getOverBgColor } = useCustomColor();

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      top="0"
      bg={getOverBgColor}
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
        <HStack spacing={4} alignItems="center">
          <Box px="2">
            <NextLink href="/">
              <Flex _hover={{ cursor: "pointer" }} align="center" mr={5}>
                <LogoIcon size="25px" />
                <Text pl="2">dCompass</Text>
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
        <HStack alignItems="center">
          <LanguageButton />
          <ThemeToggle />
          <NetworkSwitch />
          {account && isReviewer && (
            <LinkItem href="/projects/review">
              <Tag size="lg" variant="outline">
                <TagLabel>Admin</TagLabel>
              </Tag>
            </LinkItem>
          )}
          <ConnectButton />
          <IconButton
            size="md"
            px="2"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </HStack>
      </Container>

      {isOpen ? (
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <VStack onClick={onClose} align="start" fontSize="lg" spacing="4">
                <LinkItems />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : null}
    </Box>
  );
};

export default Navbar;
