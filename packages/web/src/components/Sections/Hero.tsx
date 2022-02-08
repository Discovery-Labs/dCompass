import { Box, Button, Flex, Heading, HStack, VStack } from "@chakra-ui/react";
import Navbar from "components/layout/Navbar";
import Section from "components/layout/Section";
import React from "react";
import useThemeImage from "hooks/useThemeImage";

function Hero() {
  const APP_URL = "https://dcompass-staging.herokuapp.com/";
  const DISCORD_URL = "https://discord.gg/MkfqU2bPhT";
  const { getBgHero } = useThemeImage();
  return (
    <Section bgImage={getBgHero} bgSize="cover">
      <Navbar />
      <HStack py={["0", "8", "32"]}>
        {/* <SimpleGrid
            columns={{
              base: 1,
              sm: 1,
              md: 2,
            }}
          > */}
        <VStack align="left" w="full">
          <Flex>
            <Box flex="1">
              <Heading
                textAlign={["center", "start"]}
                pt="10"
                fontSize={["4xl", "5xl"]}
                maxW={500}
              >
                A gamified and community driven
                <Box layerStyle="gradient-text">Web3 learning platform.</Box>
              </Heading>
              <HStack
                py={["4", "12"]}
                justifyContent={["center", "start"]}
                spacing="8"
              >
                <Button
                  p="5"
                  aria-label="Launch App"
                  onClick={() => window.open(APP_URL)}
                  layerStyle="gradient-bg"
                  _hover={{
                    transform: "scale(1.05)",
                  }}
                  transition="all 0.3"
                  transitionTimingFunction={"spring(1 100 10 10)"}
                >
                  Enter App
                </Button>

                <Button
                  variant="outline"
                  p="5"
                  aria-label="Learn More"
                  onClick={() => window.open(DISCORD_URL)}
                  _hover={{
                    transform: "scale(1.05)",
                  }}
                  transition="all 0.3"
                  transitionTimingFunction={"spring(1 100 10 10)"}
                >
                  Learn more
                </Button>
              </HStack>
            </Box>
          </Flex>
        </VStack>
        {/* <Image
              rounded="3xl"
              boxShadow="dark-lg"
              alt="skill-tree"
              src="/dCompass-skill-tree.png"
            />
          </SimpleGrid> */}
      </HStack>
    </Section>
  );
}

export default Hero;
