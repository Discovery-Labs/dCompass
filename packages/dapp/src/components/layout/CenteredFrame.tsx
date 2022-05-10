import { VStack } from "@chakra-ui/react";
import React from "react";

interface Children {
  children: React.ReactNode;
}
const CenteredFrame = ({ children }: Children) => {
  return (
    <VStack minH={{ sm: "400px", md: "600px" }} align="center" justify="center">
      {children}
    </VStack>
  );
};

export default CenteredFrame;
