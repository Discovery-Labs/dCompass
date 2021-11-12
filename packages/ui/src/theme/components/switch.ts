import { DeepPartial, Theme } from "@chakra-ui/react";

const Switch: DeepPartial<Theme["components"]["Switch"]> = {
  baseStyle: {
    track: {
      bg: "stone",
      _focus: {
        boxShadow: "none",
      },
      _checked: {
        bg: "purplelight",
      },
    },
  },
};

export default Switch;
