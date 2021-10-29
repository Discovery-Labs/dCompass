import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { AiFillSetting } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import LogoutButton from "./LogoutButton";

function ConnectButton() {
  return (
    <HStack w="full">
      <Button>Connect</Button>
      <Menu>
        <MenuButton
          as={Button}
          rounded="full"
          variant="link"
          cursor="pointer"
          minW={0}
        >
          {/* <Avatar
            w="40px"
            h="40px"
            src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
          /> */}
        </MenuButton>
        <MenuList rounded="3xl">
          <MenuItem>
            <Link href="/profile" passHref>
              <Button leftIcon={<BsFillPersonLinesFill />} w="full">
                Profile
              </Button>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/settings" passHref>
              <Button leftIcon={<AiFillSetting />} w="full">
                Settings
              </Button>
            </Link>
          </MenuItem>
          <MenuDivider />
          <MenuItem w="full">
            <LogoutButton w="full" />
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}

export default ConnectButton;
