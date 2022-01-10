import { useQuery } from "@apollo/client";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Text,
  SimpleGrid,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import NextLink from "next/link";
import { useContext, useEffect, useState } from "react";

import Container from "../components/layout/Container";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Project, ProjectCard } from "../components/projects/ProjectCard";
import { Web3Context } from "../contexts/Web3Provider";
import { projectTagsOptions } from "../core/constants/project-tags";
import { Tag } from "../core/types";
import { ALL_PROJECTS_QUERY } from "../graphql/projects";
import { ALL_TAGS_QUERY } from "../graphql/tags";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 50,
  maxPatternLength: 12,
  minMatchCharLength: 1,
  keys: ["name", "description"],
};

// eslint-disable-next-line complexity
function Projects() {
  const {
    data: tagsData,
    loading: loadingTags,
    error: errorTags,
  } = useQuery(ALL_TAGS_QUERY);
  const { loading, error, data } = useQuery(ALL_PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [filteredProjects, setFilteredProjects] = useState<Array<Project>>([]);

  const [searchedProjects, setSearchedProjects] = useState<
    Array<Fuse.FuseResult<Project>>
  >([]);
  const [fuse, setFuse] = useState<Fuse<unknown>>();
  const [fiterTags] = useState(() =>
    projectTagsOptions && projectTagsOptions.length > 0
      ? projectTagsOptions.map((tag) => tag.label)
      : []
  );
  const [query, setQuery] = useState<string>("");

  const { account } = useContext(Web3Context);

  function filterWithTags(e: Array<string>) {
    const newFilteredProjects = data.getAllProjects.filter(
      (project: Project) => {
        return (
          project.tags &&
          project.tags.some((tag: { label: string }) => e.includes(tag.label))
        );
      }
    );
    setFilteredProjects(newFilteredProjects);
  }

  function onSearchQuery(event: React.ChangeEvent<HTMLInputElement>) {
    const theTarget = event.target as HTMLInputElement;
    const { value = "" } = theTarget;
    setQuery(value);
  }

  useEffect(() => {
    if (data?.getAllProjects) {
      setFuse(new Fuse(data.getAllProjects, fuseOptions));
    }
  }, [data, setFuse]);

  useEffect(() => {
    if (fuse !== undefined) {
      const searchedData = fuse.search(query) as unknown as Array<
        Fuse.FuseResult<Project>
      >;
      setSearchedProjects(searchedData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const SearchedProjectsCard = ({ type }: { type: string }) => {
    if (type === "me") {
      return (
        <>
          {searchedProjects
            .filter((project) => project.item.createdBy === account)
            .map((project) => (
              <ProjectCard key={project.item.name} project={project.item} />
            ))}
        </>
      );
    }

    return (
      <>
        {searchedProjects
          .filter((project) => project.item.isFeatured)
          .map((project) => (
            <ProjectCard key={project.item.name} project={project.item} />
          ))}
      </>
    );
  };

  // eslint-disable-next-line consistent-return
  const ProjectsCard = ({ type }: { type: string }) => {
    console.log({ type });
    if (type === "me") {
      return (
        <>
          {filteredProjects.length !== 0
            ? filteredProjects
              .filter((project) => project.createdBy === account)
              .map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))
            : data.getAllProjects
              .filter((project: Project) => project.createdBy === account)
              .map((project: Project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
        </>
      );
    }

    return (
      <>
        {filteredProjects.length !== 0
          ? filteredProjects
            .filter(({ isFeatured }: { isFeatured: boolean }) => isFeatured)
            .map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))
          : data.getAllProjects
            .filter(({ isFeatured }: { isFeatured: boolean }) => isFeatured)
            .map((project: Project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
      </>
    );
  };

  if (loading || loadingTags) return "Loading...";
  if (error || errorTags)
    return `Error! ${error?.message || errorTags?.message}`;
  return (
    <Container>
      <Flex w="full">
        <Text as="h1" textStyle="h1">
          Projects
        </Text>
        <Spacer />
        <NextLink href="/projects/create-project" passHref>
          <Button leftIcon={<AddIcon />}>Create Project</Button>
        </NextLink>
      </Flex>

      <HStack py="1rem" w="full">
        <Input onChange={(e) => onSearchQuery(e)} placeholder="Search..." />
        <Menu closeOnSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            aria-label="Filter"
            variant="outline"
          />
          <CheckboxGroup
            onChange={(e: Array<string>) => filterWithTags(e)}
            defaultValue={fiterTags}
          >
            <MenuList>
              {tagsData.getAllTags.map(({ id, color, label }: Tag) => (
                <MenuItem key={id}>
                  <Checkbox colorScheme={color} value={id}>
                    {label}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </CheckboxGroup>
        </Menu>
      </HStack>

      <Tabs w="full" variant="line">
        <TabList>
          <Tab>All projects</Tab>
          <Tab>My projects</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllProjects && query.length !== 0 && (
                <SearchedProjectsCard type="featured" />
              )}
              {data.getAllProjects && query.length === 0 && (
                <ProjectsCard type="featured" />
              )}
              {!data.getAllProjects ?? "No project found"}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 3]} spacing={10}>
              {data.getAllProjects && query.length !== 0 && (
                <SearchedProjectsCard type="me" />
              )}
              {data.getAllProjects && query.length === 0 && (
                <ProjectsCard type="me" />
              )}
              {!data.getAllProjects ?? "No project found"}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Projects;
