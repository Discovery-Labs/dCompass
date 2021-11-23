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
import { useContext } from "react";

import Container from "../../components/layout/Container";
import ProjectCard from "../../components/projects/ProjectCard";
import { Web3Context } from "../../contexts/Web3Provider";
import { ALL_PROJECTS_QUERY } from "../../graphql/projects";

type ProjectData = {
  id: string;
  logo: string;
  avatar: string;
  owner: string;
  name: string;
  description: string;
  website: string;
  whitepaper: string;
  social: {
    github: string;
  };
  signals: number;
  created: string;
};

function Projects() {
  const { loading, error, data } = useQuery(ALL_PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const { account } = useContext(Web3Context);
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
                    .map((project: any) => (
                      <ProjectCard key={project.name} project={project} />
                    ))
                : "No project found"}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={10}>
              {data.getAllProjects
                ? data.getAllProjects
                    .filter(
                      ({ createdBy }: { createdBy: string }) =>
                        createdBy === account
                    )
                    .map((project: any) => (
                      <ProjectCard key={project.name} project={project} />
                    ))
                : "No project found"}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Projects;
