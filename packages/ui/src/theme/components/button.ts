import { DeepPartial, Theme } from "@chakra-ui/react";

const Button: DeepPartial<Theme["components"]["Button"]> = {
  baseStyle: {
    color: "space",
    borderRadius: "sm",
    _focus: {
      boxShadow: "none",
    },
  },
  variants: {
    solid: {
      bg: "purplelight",
      _hover: {
        bg: "purple",
      },
      _active: {
        bg: "purpledark",
      },
    },
    outline: {
      borderColor: "purplelight",
      borderWidth: "1px",
      color: "purplelight",
      _hover: {
        borderColor: "purple",
        color: "purple",
        bg: "",
      },
      _active: {
        borderColor: "purpledark",
        color: "purpledark",
        bg: "",
      },
    },
    ghost: {
      _hover: {
        color: "purple",
        bg: "",
      },
      _active: {
        color: "purpledark",
        bg: "",
      },
    },
  },
};

export default Button;
