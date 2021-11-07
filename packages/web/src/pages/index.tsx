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
  Image,
} from "@chakra-ui/react";

import { useColorModeValue } from "@chakra-ui/color-mode";

import { Circle } from "components/Circles/Circle";

const Home = () => {
  const headingColor = useColorModeValue("green.600", "green.500");
  const subHeadingColor = useColorModeValue("green.500", "purple.500");

  return (
    <Box mb={8} w="full">
      <HStack>
        <SimpleGrid
          columns={{
            base: 1,
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
            <HStack py="12" justifyContent="space-evenly">
              {/* <Link href="/dapp" passHref> */}
              <Button
                h="51px"
                p="5"
                fontSize={{
                  base: "xl",
                  xs: "md",
                }}
                aria-label="Launch App"
              >
                Join Alpha
              </Button>
              <Button
                h="51px"
                p="5"
                fontSize={{
                  base: "xl",
                  xs: "md",
                }}
                aria-label="Launch App"
              >
                Contribute
              </Button>
              {/* </Link> */}
            </HStack>
          </VStack>
          <Image
            rounded="3xl"
            boxShadow="dark-lg"
            alt="skill-tree"
            src="/dCompass-skill-tree.png"
          />
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
          When will dCompass be available ?
        </Text>
        <Text>We will release the alpha version on the 13th of December.</Text>
        <Text color="purple.500" fontWeight="bold">
          What is the tech stack ?
        </Text>
        <Text>
          We are using Next.js &amp; TypeScript for our front-end. We choose
          Ceramic for our main data store in conjunction with Filecoin &amp;
          IPFS for file storage.
        </Text>
        <Text color="purple.500" fontWeight="bold">
          Which blockhain will dCompass run on ?
        </Text>
        <Text>
          The dApp will be available on the Ethereum mainnet and Polygon for the
          alpha version but we are planning to support chains like Solana,
          Avalanche as well as chains running on Substrate &amp; Tendermint in
          the future.
        </Text>
        <Text color="purple.500" fontWeight="bold">
          Is dCompass open source ?
        </Text>
        <Text>
          Yes, it is! We are looking for super shadowy coders &amp; talented
          Anons!
        </Text>
      </VStack>
      <Divider mt="16" backgroundColor="purple.500" />
    </Box>
  );
};

export default Home;
