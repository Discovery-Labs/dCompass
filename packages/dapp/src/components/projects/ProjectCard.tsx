import { ViewIcon } from "@chakra-ui/icons";
import {
  HStack,
  Button,
  Flex,
  Text,
  Stack,
  Badge,
  Icon,
  Link,
  Heading,
  VStack,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { BsGlobe } from "react-icons/bs";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";
import ReactMarkdown from "react-markdown";

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
  const { getTextColor, getColoredText } = useCustomColor();

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

  const projectCardMarkdownTheme = {
    h1: (props) => {
      const { children } = props;
      return (
        <Heading as="h1" size="xl" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h2: (props) => {
      const { children } = props;
      return (
        <Heading as="h2" size="md" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h3: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h3" size="md" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    h4: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h4" size="md" color={getTextColor}>
          {children}
        </Heading>
      );
    },
    p: (props) => {
      const { children } = props;
      return (
        <Text w="full" fontSize="xl">
          {children}
        </Text>
      );
    },
  };

  return (
    <CardMedia src={imgSrc} h="xl">
      <Heading noOfLines={2} as="h2" size="lg" minH="75px" color={getTextColor}>
        {project.name}
      </Heading>

      <Stack direction="row">
        {project.tags.map((tag) => (
          <Badge key={tag.id} colorScheme={tag.color}>
            {tag.label}
          </Badge>
        ))}
      </Stack>

      <VStack w="full" align="flex-start">
        <ReactMarkdown
          className="card-markdown"
          components={ChakraUIRenderer(projectCardMarkdownTheme)}
          children={project.description}
          skipHtml
        />
      </VStack>

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
      <Button w="full" onClick={() => openProject()} leftIcon={<ViewIcon />}>
        {!isReviewMode ? t("view-project") : t("review-project")}
      </Button>
    </CardMedia>
  );
};

export default ProjectCard;
