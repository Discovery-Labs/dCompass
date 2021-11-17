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

import Card from "../../components/custom/Card";
import NotReviewerCard from "../../components/custom/NotReviewerCard";
import CenteredFrame from "../../components/layout/CenteredFrame";
import Container from "../../components/layout/Container";
import ProjectCard from "../../components/projects/ProjectCard";
import { Web3Context } from "../../contexts/Web3Provider";

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

const allProjects = [ProjectData, ProjectData, ProjectData];

function ReviewProjects() {
  const { isReviewer } = useContext(Web3Context);
  return isReviewer ? (
    <Container>
      <Flex w="full">
        <Heading>Review Projects</Heading>
        <Spacer />
      </Flex>

      <Tabs py="2rem" w="full">
        <TabList>
          <Tab>Pending projects</Tab>
          <Tab>Approved projects</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {allProjects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
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
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotReviewerCard />
      </Card>
    </CenteredFrame>
  );
}

export default ReviewProjects;
