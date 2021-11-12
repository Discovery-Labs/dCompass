import { DeepPartial, Theme } from "@chakra-ui/react";

const Modal: DeepPartial<Theme["components"]["Modal"]> = {
  baseStyle: {
    header: {
      color: "white",
    },
    body: {
      color: "stone",
    },
    dialog: {
      bg: "space",
      borderColor: "spacelight",
      borderWidth: "1px",
      borderRadius: "sm",
    },
    closeButton: {
      color: "pinklight",
      _focus: {
        color: "pink",
        boxShadow: "none",
      },
    },
    dialogContainer: {
      alignItems: "center",
    },
  },
  defaultProps: {
    size: "md",
  },
};

export default Modal;
