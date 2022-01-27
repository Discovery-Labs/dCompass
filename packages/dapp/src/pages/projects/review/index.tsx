import { useQuery } from "@apollo/client";
import {
  Flex,
  Heading,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext } from "react";

import Card from "../../../components/custom/Card";
import NotReviewerCard from "../../../components/custom/NotReviewerCard";
import CenteredFrame from "../../../components/layout/CenteredFrame";
import Container from "../../../components/layout/Container";
import ProjectCard from "../../../components/projects/ProjectCard";
import { Web3Context } from "../../../contexts/Web3Provider";
import { Project } from "../../../core/types";
import { ALL_PROJECTS_QUERY } from "../../../graphql/projects";

function ReviewProjects() {
  const { t } = useTranslation("common");
  const { loading, error, data } = useQuery(ALL_PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  console.log({ data });
  const { isReviewer } = useContext(Web3Context);
  const renderProjects = (projects: Project[]) =>
    projects.map((project: Project) => (
      <ProjectCard isReviewMode key={project.name} project={project} />
    ));
  if (loading)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">
          {t("project")} {t("loading")}
        </Text>
        <Progress size="xs" isIndeterminate />
      </Stack>
    );
  if (error) return `Error! ${error.message}`;
  return isReviewer ? (
    <Container>
      <Flex w="full">
        <Heading>{t("review-projects")}</Heading>
        <Spacer />
      </Flex>

      <Tabs py="2rem" w="full">
        <TabList>
          <Tab>{t("pending-projects")}</Tab>
          <Tab>{t("approved-projects")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {renderProjects(
                data.getAllProjects.filter(
                  ({ isFeatured }: { isFeatured: boolean }) => !isFeatured
                )
              )}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={10}>
              {renderProjects(
                data.getAllProjects.filter(
                  ({ isFeatured }: { isFeatured: boolean }) => isFeatured
                )
              )}
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default ReviewProjects;
