import {
  Box,
  Button,
  Flex,
  Circle,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Tilt from "react-parallax-tilt";
import Container from "../components/layout/Container";

import ProjectCard from "../components/projects/ProjectCard";

const ProjectData = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  avatar: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  owner: "huxwell.eth",
  name: "Project Alpha",
  description:
    "This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.",
  website: "https://www.google.com",
  whitepaper: "https://www.google.com",
  social: {
    github: "https://github.com",
  },
  signals: 24,
  created: "2021-09-13",
};

const Home = () => {
  const router = useRouter();

  function goTo(destination: string) {
    router.push(destination);
  }
  return (
    <Container>
      <VStack w="full" bgImage="/images/nightcity1.png" p="8">
        <HStack align="center">
          <Heading fontSize="7xl">dCompass</Heading>
        </HStack>
        <Text color="aqua.300" fontWeight="bold">
          by Discovery DAO
        </Text>
        <Box
          as="span"
          bgGradient="linear(to-l, aqua.200, pink.300)"
          bgClip="text"
          fontSize="3xl"
          pt="8"
          textAlign="center"
        >
          Explore the Web3 space and contribute to your favorite projects.
        </Box>

        <SimpleGrid p="8" columns={[1, 2, 3]} spacing={10}>
          <Tilt glareEnable glareMaxOpacity={0.15} scale={1.05}>
            <ProjectCard project={ProjectData} />
          </Tilt>
          <Tilt glareEnable glareMaxOpacity={0.15} scale={1.05}>
            <ProjectCard project={ProjectData} />
          </Tilt>
          <Tilt glareEnable glareMaxOpacity={0.15} scale={1.05}>
            <ProjectCard project={ProjectData} />
          </Tilt>
        </SimpleGrid>

        <Flex maxW="300px">
          <Button
            size="lg"
            onClick={() => goTo("/projects")}
            aria-label="Launch App"
          >
            Launch App
          </Button>
          <Button
            size="lg"
            variant="outline"
            ml="1.5rem"
            onClick={() =>
              window.open(
                "https://gov.gitcoin.co/t/proposal-integrate-dcompass-within-dgitcoin-to-build-dquests-dknowledge/8836",
                "_blank"
              )
            }
            aria-label="Learn More"
          >
            Learn More
          </Button>
        </Flex>
      </VStack>

      <VStack textAlign="center" pt="32" spacing="4">
        <Heading>How it Works</Heading>
        <SimpleGrid
          columns={{
            sm: 1,
            md: 3,
          }}
          spacing={8}
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

      <VStack textAlign="center" pt="32" spacing="4">
        <Heading size="lg">FAQs</Heading>
        <Text color="purple.300" fontWeight="bold">
          Lorem ipsum dolor sit amet?
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </Text>
        <Text color="purple.300" fontWeight="bold">
          Lorem ipsum dolor sit amet?
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </Text>
        <Text color="purple.300" fontWeight="bold">
          Lorem ipsum dolor sit amet?
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </Text>
      </VStack>
    </Container>
  );
};

export default Home;
