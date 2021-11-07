import { Button } from "@chakra-ui/button";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import React from "react";
import Link from "next/link";

import CardWithImage from "../../../components/Cards/CardWithImage";
import { AddIcon } from "@chakra-ui/icons";

function Projects() {
  return (
    <Box>
      <HStack justifyContent="space-between">
        <Heading>Projects:</Heading>
        <Box>
          <Link href="/dapp/projects/create-project" passHref>
            <Button leftIcon={<AddIcon />}>Create Project</Button>
          </Link>
        </Box>
      </HStack>

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
