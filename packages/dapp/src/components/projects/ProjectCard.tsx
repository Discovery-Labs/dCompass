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
  Box,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { BsGlobe } from "react-icons/bs";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";
import ReactMarkdown from "react-markdown";

import useCustomColor from "../../core/hooks/useCustomColor";
import { useCardMarkdownTheme } from "../../core/hooks/useMarkdownTheme";
import { Project } from "../../core/types";
import CardMedia from "../custom/CardMedia";

const ProjectCard = ({
  project,
  isReviewMode = false,
}: {
  project: Project;
  isReviewMode?: boolean;
}) => {
  const { t } = useTranslation("common");
  const { getTextColor, getOverBgColor } = useCustomColor();
  const projectCardMarkdownTheme = useCardMarkdownTheme();

  const router = useRouter();

  console.log({ pId: project.id });

  function openProject() {
    router.push(
      isReviewMode
        ? `/projects/${project.id}/review`
        : `/projects/${project.id}`
    );
  }
  const imgSrc = `https://ipfs.io/ipfs/${project.logo}`;

  return (
    <CardMedia src={imgSrc} h="xl">
      <VStack>
        <Stack w="full" overflow="hidden" direction="row">
          {project.tags.map((tag) => (
            <Badge key={tag.id} colorScheme={tag.color}>
              {tag.label}
            </Badge>
          ))}
        </Stack>

        <Heading w="full" as="h2" size="lg" color={getTextColor} isTruncated>
          {project.name}
        </Heading>

        <VStack w="full" align="flex-start">
          <Box
            bgGradient={`linear(0deg, ${getOverBgColor} 10%, ${getTextColor} 60%, ${getTextColor})`}
            bgClip="text"
          >
            {/* Short Description  */}
            <Text color="text-weak">
              Irure minim eiusmod labore sint ad proident minim consequat in
              minim velit exercitation dolor.
            </Text>
            {/* <ReactMarkdown
            className="card-markdown"
            components={ChakraUIRenderer(projectCardMarkdownTheme)}
            skipHtml
          >
            {project.description}
          </ReactMarkdown> */}
          </Box>
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
          <Button
            w="full"
            onClick={() => openProject()}
            leftIcon={<ViewIcon />}
          >
            {!isReviewMode ? t("view-project") : t("review-project")}
          </Button>
        </Flex>
      </VStack>
    </CardMedia>
  );
};

export default ProjectCard;
