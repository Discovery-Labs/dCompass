import {
  Badge,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
// import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { BsGlobe } from "react-icons/bs";
import { MdCheckCircle, MdRateReview } from "react-icons/md";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";
import { STATIC_LINKS } from "../../core/constants";
import { Project } from "../../core/types";
import CardMedia from "../custom/CardMedia";

interface Props {
  project: Project;
  isReviewMode?: boolean;
  showStatus?: boolean;
}

const ProjectCard = ({
  project,
  isReviewMode = false,
  showStatus = false,
}: Props) => {
  // const { t } = useTranslation("common");
  const router = useRouter();
  const imgSrc = `https://ipfs.io/ipfs/${project.logo}`;

  function openProject() {
    router.push(
      isReviewMode
        ? `/projects/${project.id}/review`
        : `/projects/${project.id}`
    );
  }

  return (
    <CardMedia
      src={imgSrc}
      h="xl"
      onClick={openProject}
      _hover={{ cursor: "pointer", transform: "scale(1.05)" }}
      _active={{ transform: "scale(0.95)" }}
    >
      <VStack h="full">
        {showStatus && (
          <Badge
            key={project.id}
            colorScheme={project.isFeatured ? "accent" : "orange"}
          >
            <HStack w="full">
              {project.isFeatured ? <MdCheckCircle /> : <MdRateReview />}
              <Text>{project.isFeatured ? "Approved" : "review pending"}</Text>
            </HStack>
          </Badge>
        )}
        <Stack w="full" overflow="hidden" direction="row">
          {project.tags.map((tag) => (
            <Badge key={tag.id} colorScheme={tag.color}>
              {tag.label}
            </Badge>
          ))}
        </Stack>

        <Heading w="full" as="h2" size="lg" color="text">
          {project.name}
        </Heading>

        <VStack w="full" align="flex-start">
          {/* Short Description  */}
          <Text color="text-weak" noOfLines={5}>
            {project.slogan}
          </Text>

          {/* <Box
            bgGradient={`linear(0deg, ${getOverBgColor} 10%, ${getTextColor} 60%, ${getTextColor})`}
            bgClip="text"
          >
            <ReactMarkdown
              className="card-markdown"
              components={ChakraUIRenderer(projectCardMarkdownTheme)}
              skipHtml
            >
              {project.description}
            </ReactMarkdown>
          </Box> */}
        </VStack>

        <Spacer />

        <HStack w="full" justify="space-between">
          {project.website && (
            <Link target="_blank" href={project.website}>
              <Icon boxSize={8} as={BsGlobe} />
            </Link>
          )}
          {project.twitter && (
            <Link target="_blank" href={STATIC_LINKS.twitter + project.twitter}>
              <Icon boxSize={8} as={SiTwitter} />
            </Link>
          )}
          {project.discord && (
            <Link target="_blank" href={STATIC_LINKS.discord + project.discord}>
              <Icon boxSize={8} as={SiDiscord} />
            </Link>
          )}
          {project.github && (
            <Link target="_blank" href={STATIC_LINKS.github + project.github}>
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
      </VStack>
    </CardMedia>
  );
};

export default ProjectCard;
