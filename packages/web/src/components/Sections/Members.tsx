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
import useSWR from "swr";

const fetcher = (args: RequestInfo) => fetch(args).then((res) => res.json());

function Hero() {
  const { data, error } = useSWR("/api/members", fetcher);
  if (error)
    return (
      <Section>
        <VStack my="8" spacing="4" align="left">
          <Text>Failed to load</Text>
        </VStack>
      </Section>
    );
  if (!data)
    return (
      <Section>
        <VStack my="8" spacing="4" align="left">
          <Text>Loading...</Text>
        </VStack>
      </Section>
    );
  // console.log("data", data);

  return (
    <Section>
      <VStack my="8" spacing="4" align="left">
        <Heading pb="8" w="max-content" layerStyle="gradient-text">
          Who
        </Heading>
        <SimpleGrid columns={4} spacing={10}>
          {data.members.map((member: any) => (
            <VStack key={member.name}>
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
          ))}
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
