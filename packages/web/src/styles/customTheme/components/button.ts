import { DeepPartial, Theme } from "@chakra-ui/react";

const Button: DeepPartial<Theme["components"]["Button"]> = {
  variants: {
    solid: {
      bg: "purple.500",
      color: "violet.50",
      borderRadius: "full",
      _hover: {
        boxShadow: "lg",
        fontWeight: "bold",
        background: "yellow.500",
        color: "purple.500",
      },
    },
  },
};

export default Button;
