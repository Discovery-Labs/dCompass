import { DeepPartial, Theme } from "@chakra-ui/react";

const Textarea: DeepPartial<Theme["components"]["Textarea"]> = {
  variants: {
    outline: {
      borderRadius: "sm",
      color: "stone",
      borderColor: "smoke",
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
};

export default Textarea;
