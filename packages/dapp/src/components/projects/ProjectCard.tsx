import { Avatar, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import CardMedia from "../custom/CardMedia";

type Project = {
  id: string;
  logo: string;
  name: string;
  avatar: string;
  owner: string;
  description: string;
  website: string;
  whitepaper: string;
  social: {
    github: string;
  };
  signals: number;
  created: string;
};

function ProjectCard({
  project,
  isReviewMode = false,
}: {
  project: Project;
  isReviewMode?: boolean;
}) {
  const router = useRouter();

  function openProject() {
    router.push(
      isReviewMode ? `/projects/review/${project.id}` : "/project/example"
    );
  }
  const imgSrc = `https://ipfs.io/ipfs/${project.logo}`;
  return (
    <CardMedia src={imgSrc}>
      <Heading fontSize="2xl">{project.name}</Heading>
      <Flex align="center">
        <Avatar mr="0.5rem" boxSize="1.5em" src={project.avatar} />
        <Text fontSize="sm">{project.owner}</Text>
      </Flex>
      <Text noOfLines={4}>{project.description}</Text>
      <Spacer />
      <Flex direction="column" fontSize="xs">
        <Text>{project.signals} Signals</Text>
        <Text>Created on {project.created}</Text>
      </Flex>
      <Button w="100%" fontSize="md" onClick={() => openProject()}>
        {!isReviewMode ? "View project" : "Review project"}
      </Button>
    </CardMedia>
  );
}

export default ProjectCard;
