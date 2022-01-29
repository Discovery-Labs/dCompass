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
  Link,
  Flex,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  AspectRatio,
} from "@chakra-ui/react";

import useCustomColor from "hooks/useCustomColor";

import { Circle } from "components/Circles/Circle";
import Navbar from "components/layout/Navbar";
import Footer from "components/layout/Footer";
import FAQ from "components/Sections/FAQ";

import Section from "components/layout/Section";
const Home = () => {
  const { getPrimaryColor } = useCustomColor();
  const APP_URL = "https://dcompass-staging.herokuapp.com/";
  const DISCORD_URL = "https://discord.gg/MkfqU2bPhT";

  return (
    <Box mb={8} w="full">
      <Section bgImage="url(/images/hero-bg.png)" bgSize="cover">
        <Navbar />
        <HStack py={["8", "16", "32"]}>
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
                <Heading pt="10" fontSize="6xl" maxW={500}>
                  A gamified and community driven
                  <Box layerStyle="gradient-text">Web3 learning platform.</Box>
                </Heading>
                <HStack py="12" justifyContent="start" spacing="8">
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

      <Section>
        <VStack mt="16" spacing="4" align="left">
          <Heading pb="8" layerStyle="gradient-text">
            Watch the video
          </Heading>
          <AspectRatio ratio={16 / 9}>
            <iframe
              title="naruto"
              src="https://www.youtube.com/embed/UGJA6eahQBg"
              allowFullScreen
            />
          </AspectRatio>
        </VStack>
      </Section>

      <Section>
        <VStack mt="16" spacing="4" align="left">
          <Heading pb="8" layerStyle="gradient-text">
            How it Works
          </Heading>
          <SimpleGrid
            columns={{
              sm: 1,
              md: 3,
            }}
            spacing={8}
          >
            <VStack layerStyle="outline-hover2">
              <Box pb="4">
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
            </VStack>
            <VStack layerStyle="outline-hover2">
              <Box pb="4">
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
            </VStack>
            <VStack layerStyle="outline-hover2">
              <Box pb="4">
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
                Complete quests &amp; start contributing to your favorite
                projects
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Section>

      <Section bgImage="url(/images/dots.png)" bgSize="contain">
        <VStack mt="16" spacing="4" align="left">
          <Heading pb="8" layerStyle="gradient-text">
            Discover the future of the web
          </Heading>
          <SimpleGrid
            columns={{
              sm: 1,
              md: 2,
            }}
            spacing={8}
          >
            <VStack layerStyle="solid-hover2" opacity={0.8}>
              <Image
                boxSize="150px"
                alt="icon"
                src="./images/icon-features04.png"
              />
              <Text pt="8" textStyle="h2" fontWeight="bold">
                CLIMB THE LEADERBOARD
              </Text>
              <Text>Earn XPs and increase your ranking!</Text>
            </VStack>
            <VStack layerStyle="solid-hover2" opacity={0.8}>
              <Image
                boxSize="150px"
                alt="icon"
                src="./images/icon-features03.png"
              />
              <Text pt="8" textStyle="h2" fontWeight="bold">
                EARN NFTS
              </Text>
              <Text>Mint Quest & Badge NFTs with a random rarity</Text>
            </VStack>
            <VStack layerStyle="solid-hover2" opacity={0.8}>
              <Image
                boxSize="150px"
                alt="icon"
                src="./images/icon-features02.png"
              />
              <Text pt="8" textStyle="h2" fontWeight="bold">
                SKILL TREE
              </Text>
              <Text>
                Showcase your accomplishments in Web3 through your dynamic
                profile.
              </Text>
            </VStack>
            <VStack layerStyle="solid-hover2" opacity={0.8}>
              <Image
                boxSize="150px"
                alt="icon"
                src="./images/icon-features01.png"
              />
              <Text pt="8" textStyle="h2" fontWeight="bold">
                EARN
              </Text>
              <Text>
                Get rewarded by validating your learnings and actions. Get hired
                in Web3.
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Section>

      <Section>
        <VStack mt="16" spacing="4" align="left">
          <Heading pb="8" layerStyle="gradient-text">
            Our mission
          </Heading>
          <Text>
            dCompass’ primary mission will be to onboard, guide and educate
            users about the Gitcoin ecosystem, sustainable open source software
            & trustworthy Web3 protocols and tools, decentralization &
            governance, DeFi & NFTs.
          </Text>
          <Text>
            We believe there are 3 main problems that need to be solved:
          </Text>
          <UnorderedList>
            <ListItem>
              Aggregating ever-growing but scattered information
            </ListItem>
            <ListItem>
              Retaining users and community members/contributors
            </ListItem>
            <ListItem>
              DAO project management, contributor management, and intuitive
              onboarding
            </ListItem>
          </UnorderedList>
        </VStack>
      </Section>

      <Section>
        <VStack mt="16" spacing="4" align="left">
          <Heading pb="8" layerStyle="gradient-text">
            Our story
          </Heading>
          <Text>
            We started small with an simple idea. Help people join the future.
            With passion and hard work we brought this idea to light by reaching
            the finals in the HackFS Hackathon. Our next step is to build the
            best platform to onboard people and achieve our mission.
          </Text>
          <Text>
            We believe there are 3 main problems that need to be solved:
          </Text>
        </VStack>
      </Section>

      <FAQ />

      <Section>
        <Flex w="full" justify="center">
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
        </Flex>
      </Section>

      <Section>
        <Footer />
      </Section>
    </Box>
  );
};

export default Home;
