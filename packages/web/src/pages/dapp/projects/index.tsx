import { Box } from "@chakra-ui/layout";
import React from "react";
import CardWithImage from "../../../components/Cards/CardWithImage";

function Projects() {
  return (
    <Box>
      Projects:
      <CardWithImage
        heading="TypeScript"
        avatarSrc="/ts-logo-512.svg"
        coverSrc="/ts-logo-512.svg"
        stat2="5"
        stat2Label="Staked"
        stat1="5"
        stat1Label="Signaled"
        description="Super Shadowy Coders"
        primaryAction="Stake"
        primaryActionOnClick={() => console.log("hello")}
        secondaryAction="Signal"
        secondaryActionOnClick={() => console.log("hello")}
      />
    </Box>
  );
}

export default Projects;
