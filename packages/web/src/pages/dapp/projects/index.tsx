import { Button } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Heading, HStack, SimpleGrid } from "@chakra-ui/layout";
import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CardWithImage from "../../../components/Cards/CardWithImage";

type Project = {
  name: string;
  description: string;
  website: string;
  twitter: string;
  github: string;
  logo: string;
};

const projects: Array<Project> = [
  {
    name: "TypeScript",
    description: "Super Shadowy Coders",
    website: "https://typescript.org",
    twitter: "https://twitter.com",
    github: "https://github.com",
    logo: "/ts-logo-512.svg",
  },
  {
    name: "TypeScript",
    description: "Super Shadowy Coders",
    website: "https://typescript.org",
    twitter: "https://twitter.com",
    github: "https://github.com",
    logo: "/ts-logo-512.svg",
  },
  {
    name: "JavaScript",
    description: "Super Shadowy Coders",
    website: "https://typescript.org",
    twitter: "https://twitter.com",
    github: "https://github.com",
    logo: "/ts-logo-512.svg",
  },
  {
    name: "NextJs",
    description: "Super Shadowy Coders",
    website: "https://typescript.org",
    twitter: "https://twitter.com",
    github: "https://github.com",
    logo: "/ts-logo-512.svg",
  },
  {
    name: "TypeScript",
    description: "Super Shadowy Coders",
    website: "https://typescript.org",
    twitter: "https://twitter.com",
    github: "https://github.com",
    logo: "/ts-logo-512.svg",
  },
];

const fuseOptions = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 50,
  maxPatternLength: 12,
  minMatchCharLength: 1,
  keys: ["name", "description"],
};

function Projects() {
  const [sortedProjects, setSortedProjects] = useState<
    Array<Fuse.FuseResult<Project>>
  >([]);
  const [query, setQuery] = useState<string>("");

  const fuse = new Fuse(projects, fuseOptions);

  function onSearchQuery(event: React.ChangeEvent<HTMLInputElement>) {
    const theTarget = event.target as HTMLInputElement;
    const { value = "" } = theTarget;
    setQuery(value);
  }

  useEffect(() => {
    const data = fuse.search(query);
    setSortedProjects(data);
  }, [query]);

  return (
    <Box>
      <HStack justifyContent="space-between">
        <Heading>Projects:</Heading>
        <Box>
          <Link href="/dapp/projects/create-project" passHref>
            <Button leftIcon={<AddIcon />}>Create Project</Button>
          </Link>
        </Box>
      </HStack>

      <Flex py="2rem" justify="center">
        <InputGroup>
          <InputLeftElement p="2.5">
            <Icon color="purple.100" as={FiSearch} />
          </InputLeftElement>
          <Input onChange={onSearchQuery} placeholder="Search..." />
        </InputGroup>
        <Box pl="2">
          <Select placeholder="Order">
            <option value="option1">Alphabetical</option>
            <option value="option2">Highest Signal</option>
            <option value="option3">Highest Stake</option>
          </Select>
        </Box>
      </Flex>

      <SimpleGrid columns={3} spacing={10} justifyItems="center">
        {sortedProjects.length !== 0
          ? sortedProjects.map((project, i) => {
              return (
                <CardWithImage
                  key={i}
                  heading={project.item.name}
                  avatarSrc={project.item.logo}
                  coverSrc={project.item.logo}
                  stat2="5"
                  stat2Label="Staked"
                  stat1="5"
                  stat1Label="Signaled"
                  description={project.item.description}
                  primaryAction="Stake"
                  primaryActionOnClick={() => console.log("hello")}
                  secondaryAction="Signal"
                  secondaryActionOnClick={() => console.log("hello")}
                />
              );
            })
          : projects.map((project, i) => {
              return (
                <CardWithImage
                  key={i}
                  heading={project.name}
                  avatarSrc={project.logo}
                  coverSrc={project.logo}
                  stat2="5"
                  stat2Label="Staked"
                  stat1="5"
                  stat1Label="Signaled"
                  description={project.description}
                  primaryAction="Stake"
                  primaryActionOnClick={() => console.log("hello")}
                  secondaryAction="Signal"
                  secondaryActionOnClick={() => console.log("hello")}
                />
              );
            })}
      </SimpleGrid>
    </Box>
  );
}

export default Projects;
