import {
  Avatar,
  Heading,
  Link,
  SimpleGrid,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import Section from "components/layout/Section";
import React from "react";

function Hero() {
  const APP_URL = "https://dcompass-staging.herokuapp.com/";
  const DISCORD_URL = "https://discord.gg/MkfqU2bPhT";

  return (
    <Section>
      <VStack my="8" spacing="4" align="left">
        <Heading pb="8" w="max-content" layerStyle="gradient-text">
          Who
        </Heading>
        <SimpleGrid columns={4} spacing={10}>
          <VStack>
            <Link
              href="https://dcompass.discovery-dao.xyz/"
              target="_blank"
              textAlign="center"
            >
              <Avatar
                size="2xl"
                src="https://images.unsplash.com/photo-1627534414302-778011a206fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=747&q=80"
              />
              <Text pt="8">Sashi Moto</Text>
            </Link>
          </VStack>
          <VStack>
            <Link
              href="https://dcompass.discovery-dao.xyz/"
              target="_blank"
              textAlign="center"
            >
              <Avatar
                size="2xl"
                src="https://images.unsplash.com/photo-1627534414302-778011a206fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=747&q=80"
              />
              <Text pt="8">Toshi Nakato</Text>
            </Link>
          </VStack>
          <VStack>
            <Link
              href="https://dcompass.discovery-dao.xyz/"
              target="_blank"
              textAlign="center"
            >
              <Avatar
                size="2xl"
                src="https://images.unsplash.com/photo-1627534414302-778011a206fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=747&q=80"
              />
              <Text pt="8">Sato Kyoto</Text>
            </Link>
          </VStack>
          <VStack>
            <Link
              href="https://dcompass.discovery-dao.xyz/"
              target="_blank"
              textAlign="center"
            >
              <Avatar
                size="2xl"
                src="https://images.unsplash.com/photo-1627534414302-778011a206fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=747&q=80"
              />
              <Text pt="8">Shitoma Kato</Text>
            </Link>
          </VStack>
        </SimpleGrid>
        <VStack pt="8">
          <Text>
            Are you a builder who wants to work on the future of web3 learning
          </Text>
          <Button onClick={() => window.open("https://discord.gg/MkfqU2bPhT")}>
            Get Involved
          </Button>
        </VStack>
      </VStack>
    </Section>
  );
}

export default Hero;
