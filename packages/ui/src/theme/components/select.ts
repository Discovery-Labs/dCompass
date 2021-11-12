import { DeepPartial, Theme } from "@chakra-ui/react";

const Select: DeepPartial<Theme["components"]["Select"]> = {
  variants: {
    outline: {
      field: {
        borderRadius: "sm",
        borderColor: "smoke",
        borderWidth: "1px",
        color: "stone",
        _hover: {
          borderColor: "purple",
        },
        _active: {
          boxShadow: "none !important",
        },
        _focus: {
          boxShadow: "none !important",
          borderColor: "purplelight",
        },
      },
    },
  },
};

export default Select;
