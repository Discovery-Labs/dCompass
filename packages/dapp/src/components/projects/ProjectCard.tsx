import {
  HStack,
  Button,
  Flex,
  Spacer,
  Text,
  Stack,
  Badge,
  Tooltip,
  Icon,
  Link,
  Heading,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Blockies from "react-blockies";
import { BsGlobe } from "react-icons/bs";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";

import useCustomColor from "../../core/hooks/useCustomColor";
import { Project, Tag } from "../../core/types";
import CardMedia from "../custom/CardMedia";

const ProjectCard = ({
  project,
  isReviewMode = false,
}: {
  project: Project;
  isReviewMode?: boolean;
}) => {
  const { t } = useTranslation("common");
  const { getTextColor } = useCustomColor();

  const router = useRouter();
  console.log({ project, isReviewMode, id: project.id.split("://")[1] });

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
      <Heading as="h2" size="lg" color={getTextColor}>
        {project.name}
      </Heading>

      <Stack direction="row">
        {project.tags.map((tag) => (
          <Badge key={tag.id} colorScheme={tag.color}>
            {tag.label}
          </Badge>
        ))}
      </Stack>
      <Tooltip label={project.description} hasArrow placement="top">
        <Heading noOfLines={3} as="h4" fontSize="md" color={getTextColor}>
          {project.description}
        </Heading>
      </Tooltip>

      <Spacer />
      <HStack spacing={7}>
        {project.website && (
          <Link target="_blank" href={project.website}>
            <Icon boxSize={8} as={BsGlobe} />
          </Link>
        )}
        {project.twitter && (
          <Link target="_blank" href={project.twitter}>
            <Icon boxSize={8} as={SiTwitter} />
          </Link>
        )}
        {project.discord && (
          <Link target="_blank" href={project.discord}>
            <Icon boxSize={8} as={SiDiscord} />
          </Link>
        )}
        {project.github && (
          <Link target="_blank" href={project.github}>
            <Icon boxSize={8} as={SiGithub} />
          </Link>
        )}
        {project.gitbook && (
          <Link target="_blank" href={project.gitbook}>
            <Icon boxSize={8} as={SiGitbook} />
          </Link>
        )}
      </HStack>
      <Flex w="full" direction="column" fontSize="xs">
        {project.squads && (
          <HStack justifyContent="space-between">
            <Text fontSize="xs" textTransform="uppercase">
              {project.squads.length} SQUAD
              {project.squads.length > 1 ? "s" : ""}
            </Text>
            <Text fontSize="xs" textTransform="uppercase">
              {project.squads.flatMap((squad) => squad.members).length} MEMBER
              {project.squads.flatMap((squad) => squad.members).length > 1
                ? "S"
                : ""}
            </Text>
          </HStack>
        )}
      </Flex>
      <Button w="full" onClick={() => openProject()}>
        {!isReviewMode ? t("view-project") : t("review-project")}
      </Button>
    </CardMedia>
  );
};

export default ProjectCard;
