import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Section = (props: BoxProps & LayoutProps) => {
  const { children } = props;
  return (
    <Box {...props}>
      <Box margin="0 auto" maxWidth={1100} transition="0.5s ease-out">
        <Box padding="8">{children}</Box>
      </Box>
    </Box>
  );
};

export default Section;
