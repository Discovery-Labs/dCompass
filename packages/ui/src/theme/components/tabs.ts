import { DeepPartial, Theme } from "@chakra-ui/react";

const Tabs: DeepPartial<Theme["components"]["Tabs"]> = {
  baseStyle: {
    tab: {
      _focus: {
        zIndex: 1,
        boxShadow: "none",
      },
    },
  },
  variants: {
    unstyled: {
      tab: {
        _selected: {
          color: "aqualight",
          fontWeight: "bold",
          borderBottomWidth: "2px",
          borderBottomColor: "aqualight",
        },
      },
    },
  },
  defaultProps: {
    variant: "unstyled",
  },
};

export default Tabs;
