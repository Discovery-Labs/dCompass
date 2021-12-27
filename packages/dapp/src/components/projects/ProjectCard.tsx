import { HStack, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Blockies from "react-blockies";

import CardMedia from "../custom/CardMedia";

export type TagItem = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  logo: string;
  name: string;
  avatar: string;
  createdBy: string;
  description: string;
  tags: Array<TagItem>;
  isFeatured: boolean;
  website: string;
  whitepaper: string;
  createdAt: string;
  squads: {
    name: string;
    image: string;
    members: string[];
  }[];
  social: {
    github: string;
  };
  signals: number;
  created: string;
};

export const ProjectCard = ({
  project,
  isReviewMode = false,
}: {
  project: Project;
  isReviewMode?: boolean;
}) => {
  const router = useRouter();

  function openProject() {
    router.push(
      isReviewMode
        ? `/projects/${project.id.split("://")[1]}/review`
        : `/projects/${project.id.split("://")[1]}`
    );
  }
  const imgSrc = `https://ipfs.io/ipfs/${project.logo}`;
  return (
    <CardMedia src={imgSrc}>
      <Text as="h2" textStyle="h2">
        {project.name}
      </Text>
      <Flex align="center" maxW="full">
        {project.createdBy && (
          <Blockies seed={project.createdBy} className="blockies" />
        )}
        <Text ml="2" fontSize="sm" isTruncated>
          {project.createdBy}
        </Text>
      </Flex>
      <Text noOfLines={4}>{project.description}</Text>
      <Spacer />
      <Flex w="full" direction="column" fontSize="xs">
        {project.squads && (
          <HStack justifyContent="space-between">
            <Text fontSize="xs">
              {project.squads.length} SQUAD
              {project.squads.length > 1 ? "s" : ""}
            </Text>
            <Text fontSize="xs">
              {project.squads.flatMap((squad) => squad.members).length} MEMBER
              {project.squads.flatMap((squad) => squad.members).length > 1
                ? "s"
                : ""}
            </Text>
          </HStack>
        )}
        {/* <Text>CREATED: {new Date(project.createdAt).toLocaleString()}</Text> */}
      </Flex>
      <Button w="full" onClick={() => openProject()}>
        {!isReviewMode ? "View project" : "Review project"}
      </Button>
    </CardMedia>
  );
};
