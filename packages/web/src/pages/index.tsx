import React from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

import { useColorModeValue } from "@chakra-ui/color-mode";

import SomeImage from "components/SomeImage";
import { Circle } from "components/Circles/Circle";

const Home = () => {
  const headingColor = useColorModeValue("green.600", "green.500");
  // scheduled rooms, open spaces,..
  // VIP pass, tickets, fractionalized ownership
  // super rare crypto curration
  return (
    <Box mb={8} w="full">
      <HStack>
        <SimpleGrid
          columns={{
            sm: 1,
            md: 2,
          }}
        >
          <VStack align="left" w="full">
            <HStack align="center">
              <Heading color={headingColor}>dCompass</Heading>
            </HStack>
            <Text pt="10" fontSize="3xl">
              Explore the Web3 space and contribute to your favorite projects.
            </Text>

            <Box maxW="300px" pt="12">
              <Link href="/dapp" passHref>
                <Button
                  w="239px"
                  h="51px"
                  fontSize="xl"
                  aria-label="Launch App"
                >
                  Launch App
                </Button>
              </Link>
            </Box>
          </VStack>
          <SomeImage />
        </SimpleGrid>
      </HStack>

      <Divider mt="8" backgroundColor="purple.500" />

      <VStack mt="16" spacing="4" align="left">
        <Heading size="md" color={headingColor}>
          How it Works
        </Heading>
        <SimpleGrid
          columns={{
            sm: 1,
            md: 3,
          }}
          spacing={4}
        >
          <HStack>
            <Box>
              <Circle
                backgroundColor="none"
                textColor="purple.500"
                w="36px"
                h="36px"
                borderWidth="1px"
                borderColor="purple.500"
                text="1"
              />
            </Box>
            <Text>Browse a currated list of Web3 projects</Text>
          </HStack>

          <HStack>
            <Box>
              <Circle
                backgroundColor="none"
                textColor="purple.500"
                w="36px"
                h="36px"
                borderWidth="1px"
                borderColor="purple.500"
                text="2"
              />
            </Box>
            <Text>Learn in detail about a project and its members</Text>
          </HStack>

          <HStack>
            <Box>
              <Circle
                backgroundColor="none"
                textColor="purple.500"
                w="36px"
                h="36px"
                borderWidth="1px"
                borderColor="purple.500"
                text="3"
              />
            </Box>
            <Text>Signal and stake on your favorite projects</Text>
          </HStack>
        </SimpleGrid>
      </VStack>
      <Divider mt="16" backgroundColor="purple.500" />

      <VStack mt="16" spacing="4" align="left">
        <Heading size="md" color={headingColor}>
          FAQs
        </Heading>
        <Text color="purple.500" fontWeight="bold">
          Lorem ipsum dolor sit amet?
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </Text>
      </VStack>
      <Divider mt="16" backgroundColor="purple.500" />
    </Box>
  );
};

export default Home;
