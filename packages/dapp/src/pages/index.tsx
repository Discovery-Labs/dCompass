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

        <Tilt glareEnable glareMaxOpacity={0.15} scale={1.05}>
          <Image
            w="600px"
            borderRadius="sm"
            m="4"
            src="https://images.unsplash.com/photo-1594897030264-ab7d87efc473"
          />
        </Tilt>
        <Flex maxW="300px" pt="12">
          <Button
            size="lg"
            colorScheme="aqua"
            onClick={() => goTo("/projects")}
            aria-label="Launch App"
          >
            Launch App
          </Button>
          <Button
            size="lg"
            variant="outline"
            ml="1.5rem"
            onClick={() => goTo("/about")}
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
