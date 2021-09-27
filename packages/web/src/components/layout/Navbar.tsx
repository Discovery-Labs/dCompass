import { ReactNode } from "react";
import {
  Box,
  Flex,
  HStack,
  Link as UILink,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import ThemeToggle from "./ThemeToggle";
import ConnectButton from "../Buttons/ConnectButton";
import Link from "next/link";
import NavLink from "./NavLink";
const Links = [
  { label: "Home", link: "/dapp" },
  { label: "Projects", link: "/dapp/projects" },
  { label: "Quests", link: "/dapp/quests" },
  { label: "Teams", link: "/dapp/teams" },
  { label: "Dashboard", link: "/dapp/dashboard" },
];

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const activeLinkColors = {
    bg: useColorModeValue("gray.200", "green.500"),
    color: useColorModeValue("purple.500", "purple.500"),
  };
  return (
    <>
      <Box bg={useColorModeValue("violet.100", "blue.700")} px={4} rounded="xl">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link href={`/`} passHref>
              Logo
            </Link>
            <HStack
              as={"nav"}
              fontSize="18px"
              fontWeight="bold"
              fontFamily="Roboto Mono"
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(({ link, label }) => (
                <NavLink
                  key={label}
                  to={link}
                  activeProps={{
                    textDecoration: "none",
                    ...activeLinkColors,
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Stack direction="row" spacing={2}>
              <ThemeToggle />
              <ConnectButton />
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack
              as={"nav"}
              spacing={4}
              fontSize="18px"
              fontWeight="bold"
              fontFamily="Roboto Mono"
            >
              {Links.map(({ link, label }) => (
                <NavLink
                  key={label}
                  to={link}
                  activeProps={{
                    textDecoration: "none",
                    ...activeLinkColors,
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
