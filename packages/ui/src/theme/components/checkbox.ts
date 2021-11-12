import { DeepPartial, Theme } from "@chakra-ui/react";

const Checkbox: DeepPartial<Theme["components"]["Checkbox"]> = {
  baseStyle: {
    control: {
      color: "white",
      _focus: { boxShadow: "none" },
      _checked: {
        bg: "aqualight",
        borderColor: "aqualight",
        color: "space",

        _hover: {
          bg: "aqua",
          borderColor: "aqua",
        },
      },
    },
  },
};

export default Checkbox;
