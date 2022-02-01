import { extendTheme } from "@chakra-ui/react";
import { customTheme } from "@discovery-dao/ui";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const theme = extendTheme({
  ...customTheme,
  components: {
    ...customTheme.components,
    Steps: Steps,
  },
});

export default theme;
