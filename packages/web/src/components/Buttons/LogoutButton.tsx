import { Button, ButtonProps } from "@chakra-ui/react";
import { HiOutlineLogout } from "react-icons/hi";
import React from "react";

function LogoutButton(props: ButtonProps) {
  return (
    <Button
      type="button"
      rightIcon={<HiOutlineLogout />}
      colorScheme="red"
      variant="outline"
      rounded="full"
      {...props}
    >
      LOGOUT
    </Button>
  );
}

export default LogoutButton;
