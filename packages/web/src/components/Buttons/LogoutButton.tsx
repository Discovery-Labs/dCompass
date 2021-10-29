import { Button, ButtonProps } from "@chakra-ui/react";
import { HiOutlineLogout } from "react-icons/hi";
import React from "react";

function LogoutButton(props: ButtonProps) {
  return (
    <Button
      // type="button"
      rightIcon={<HiOutlineLogout />}
      variant="outline"
      color="red.500"
      borderColor="red.500"
      _hover={{
        boxShadow: "lg",
        fontWeight: "bold",
        background: "red.100",
      }}
      _active={{
        bg: "red.200",
      }}
      rounded="full"
      {...props}
    >
      LOGOUT
    </Button>
  );
}

export default LogoutButton;
