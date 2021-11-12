import { DeepPartial, Theme, keyframes } from "@chakra-ui/react";

const rainbow = keyframes`
  0% { box-shadow: 0 0px 20px 0px aqua }
  33% { box-shadow: 0 0px 20px 0px pink }
  66% { box-shadow: 0 0px 20px 0px purple }
  100% { box-shadow: 0 0px 20px 0px aqua }
`;

const Menu: DeepPartial<Theme["components"]["Menu"]> = {
  baseStyle: {
    list: {
      bg: "space",
      borderRadius: "sm",
      borderColor: "space",
      borderWidth: "1px",
      color: "stone",
      animation: `${rainbow} infinite 4s ease-in-out`,
    },
    item: {
      _focus: {
        bg: "aqualight",
        color: "space",
      },
      _active: {
        bg: "aqua",
        color: "space",
      },
      _expanded: {
        bg: "aqualight",
        color: "space",
      },
    },
  },
};

export default Menu;
