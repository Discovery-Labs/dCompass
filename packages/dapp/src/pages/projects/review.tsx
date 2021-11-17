import { useQuery } from "@apollo/client";
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
import { useContext } from "react";

import Card from "../../components/custom/Card";
import NotReviewerCard from "../../components/custom/NotReviewerCard";
import CenteredFrame from "../../components/layout/CenteredFrame";
import Container from "../../components/layout/Container";
import ProjectCard from "../../components/projects/ProjectCard";
import { Web3Context } from "../../contexts/Web3Provider";
import { ALL_PROJECTS_QUERY } from "../../graphql/projects";

function ReviewProjects() {
  const { loading, error, data } = useQuery(ALL_PROJECTS_QUERY);
  const { isReviewer } = useContext(Web3Context);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
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
              {data.getAllProjects
                .filter(
                  ({ isFeatured }: { isFeatured: boolean }) => !isFeatured
                )
                .map((project: any) => (
                  // TODO: use GraphQL codegen to get the types out of the box
                  <ProjectCard key={project.name} project={project} />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={10}>
              {data.getAllProjects
                .filter(({ isFeatured }: { isFeatured: boolean }) => isFeatured)
                .map((project: any) => (
                  <ProjectCard key={project.name} project={project} />
                ))}
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
