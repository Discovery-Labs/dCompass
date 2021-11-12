import { DeepPartial, Theme } from "@chakra-ui/react";

const Form: DeepPartial<Theme["components"]["Form"]> = {
  baseStyle: {
    requiredIndicator: {
      color: "pink",
    },
    helperText: {
      color: "stone",
    },
  },
};

export default Form;
