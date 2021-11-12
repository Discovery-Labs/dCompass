import { DeepPartial, Theme } from "@chakra-ui/react";

const Input: DeepPartial<Theme["components"]["Input"]> = {
  variants: {
    outline: {
      field: {
        borderRadius: "sm",
        color: "stone",
        borderColor: "smoke",
        _hover: {
          borderColor: "purple",
        },
        _active: {
          boxShadow: "none",
        },
        _focus: {
          boxShadow: "none",
          borderColor: "purplelight",
        },
      },
    },
  },
};

export default Input;
