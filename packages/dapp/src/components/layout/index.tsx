import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

import GitcoinFooter from "./GitcoinFooter";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Box pt="12" margin="0 auto" maxWidth="7xl" transition="0.5s ease-out">
        <Box margin="8">
          <Box as="main" marginY={22}>
            {children}
          </Box>
          <GitcoinFooter />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
