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
import ConnectButton from "../Buttons/ConnectButton";
import LanguageButton from "../Buttons/LanguageButton";
import NetworkSwitch from "../custom/NetworkSwitch";
import MenuDropdown from "../custom/MenuDropdown";
import LogoIcon from "../Icons/LogoIcon";

import ThemeToggle from "./ThemeToggle";
import DrawerConnectButton from "components/Buttons/DrawerConnectButton";

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
        color={isActive ? "text" : "text-weak"}
        _target={_target}
        _hover={{ color: "text", textDecoration: "none" }}
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
      {/* <LinkItem href="/quests">Quests</LinkItem> */}
      <LinkItem href="/profile">Profile</LinkItem>
    </>
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
      bg="bg-medium"
      style={{ backdropFilter: "blur(10px)" }}
      zIndex="sticky"
      {...props}
    >
      <Container display="flex" p="2" maxW="7xl">
        <HStack spacing={4} alignItems="center">
          <NextLink href="/">
            <Flex _hover={{ cursor: "pointer" }} align="center" mr={5} ml={2}>
              <LogoIcon size="25px" />
              <Text pl="2">dCompass</Text>
            </Flex>
          </NextLink>
          <HStack
            as="nav"
            spacing={4}
            display={["none", "none", "none", "flex"]}
          >
            <LinkItems />
            <MenuDropdown />
          </HStack>
        </HStack>
        <Spacer />
        <HStack alignItems="center">
          <HStack display={["none", "none", "none", "flex"]}>
            {account && isReviewer && (
              <LinkItem href="/projects/review">
                <Tag size="lg" variant="outline">
                  <TagLabel>Admin</TagLabel>
                </Tag>
              </LinkItem>
            )}
            <LanguageButton />
            <ThemeToggle />
            <NetworkSwitch />
          </HStack>
          <ConnectButton />
          <IconButton
            size="md"
            px="2"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={["flex", "flex", "flex", "none"]}
            onClick={isOpen ? onClose : onOpen}
          />
        </HStack>
      </Container>

      {isOpen ? (
        <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <VStack onClick={onClose} align="start" fontSize="lg" spacing="4">
                <LinkItems />
                <ThemeToggle />
                <NetworkSwitch />
                <DrawerConnectButton />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : null}
    </Box>
  );
};

export default Navbar;
