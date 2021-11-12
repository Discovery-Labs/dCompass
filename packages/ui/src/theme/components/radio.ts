/* eslint-disable @typescript-eslint/dot-notation */
import { DeepPartial, Theme } from "@chakra-ui/react";

import Checkbox from "./checkbox";

type BaseStyle = {
  control: {
    color: string;
    _focus: { boxShadow: string };
    _checked: {
      bg: string;
      borderColor: string;
      color: string;

      _hover: {
        bg: string;
        borderColor: string;
      };
    };
  };
};

const baseStyle = Checkbox?.baseStyle as BaseStyle;

const Radio: DeepPartial<Theme["components"]["Radio"]> = {
  baseStyle: {
    control: {
      _focus: {
        ...baseStyle.control["_focus"],
      },
      _checked: {
        ...baseStyle.control["_checked"],
      },
    },
    label: {
      color: "stone",
    },
  },
};

export default Radio;
