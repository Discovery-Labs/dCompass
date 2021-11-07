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
import LogoDarkIcon from "../components/Icons/LogoDarkIcon";

const Home = () => {
  const headingColor = useColorModeValue("green.600", "green.500");
  const subHeadingColor = useColorModeValue("green.500", "purple.500");

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
            {/* <HStack align="center">
              <LogoDarkIcon size="30px" />
              <Heading color={headingColor}>dCompass</Heading>
            </HStack> */}
            <Text color={subHeadingColor} fontWeight="bold">
              {" "}
              by Discovery DAO &amp; Gitcoin DAO
            </Text>
            <Text pt="10" fontSize="3xl">
              A gamified and community driven Web3 learning platform.
            </Text>
            <Box maxW="300px" pt="12">
              {/* <Link href="/dapp" passHref> */}
              <Button
                w="full"
                h="51px"
                fontSize="xl"
                disabled
                aria-label="Launch App"
              >
                Spin your compass
              </Button>
              {/* </Link> */}
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
            <Text>Learn how to use their features &amp; protocols</Text>
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
            <Text>
              Complete quests &amp; start contributing to your favorite projects
            </Text>
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
