import { useQuery } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import NextLink from "next/link";

import Container from "../../components/layout/Container";
import ProjectCard from "../../components/projects/ProjectCard";
import { ALL_PROJECTS_QUERY } from "../../graphql/projects";

const ProjectData = {
  id: "someid",
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

function Projects() {
  const { loading, error, data } = useQuery(ALL_PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return (
    <Container>
      <Flex w="full">
        <Heading>Projects</Heading>
        <Spacer />
        <NextLink href="/projects/create-project" passHref>
          <Button rightIcon={<AddIcon />}>Create Project</Button>
        </NextLink>
      </Flex>

      <Tabs py="2rem" w="full">
        <TabList>
          <Tab>All projects</Tab>
          <Tab>My projects</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllProjects
                ? data.getAllProjects
                    .filter(
                      ({ isFeatured }: { isFeatured: boolean }) => isFeatured
                    )
                    .map((project) => (
                      <ProjectCard key={project.name} project={project} />
                    ))
                : "No project found"}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={10}>
              <ProjectCard project={ProjectData} />
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Projects;
