import { DeepPartial, Theme } from "@chakra-ui/react";

const Link: DeepPartial<Theme["components"]["Link"]> = {
  baseStyle: {
    color: "white",
    _hover: {
      color: "aqua",
      textDecoration: "none",
    },
    _focus: {
      boxShadow: "none",
    },
  },
};

export default Link;
