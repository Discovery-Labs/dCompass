import { Button, Flex, Image } from "@chakra-ui/react";
import Tilt from "react-parallax-tilt";

import CenteredFrame from "../components/layout/CenteredFrame";

import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  function goTo(destination: string) {
    router.push(destination);
  }
  return (
    <Flex direction="column">
      <CenteredFrame>
        <Tilt glareEnable glareMaxOpacity={0.15} scale={1.05}>
          <Image
            w="800px"
            borderRadius="sm"
            src="https://images.unsplash.com/photo-1594897030264-ab7d87efc473"
          />
        </Tilt>
        <Flex pt="8" justify="space-around">
          <Button colorScheme="purple" onClick={() => goTo("/create-project")}>
            Create your project
          </Button>
          <Button colorScheme="aqua" onClick={() => goTo("/project/example")}>
            Learn about a project
          </Button>
        </Flex>
      </CenteredFrame>
    </Flex>
  );
};

export default Home;
