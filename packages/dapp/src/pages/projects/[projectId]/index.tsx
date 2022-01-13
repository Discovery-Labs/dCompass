import { useQuery } from "@apollo/client";
import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";
import { BsGlobe, BsPeople, BsPerson } from "react-icons/bs";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";

import { initializeApollo } from "../../../../lib/apolloClient";
import CardMedia from "../../../components/custom/CardMedia";
import QuestCard from "../../../components/projects/quests/QuestCard";
import { Tag } from "../../../core/types";
import { GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY } from "../../../graphql/pathways";
import { PROJECT_BY_ID_QUERY } from "../../../graphql/projects";
import Container from "components/layout/Container";
import PathwayCard from "components/projects/pathways/PathwayCard";
import { Web3Context } from "contexts/Web3Provider";
import useCustomColor from "core/hooks/useCustomColor";

type Props = {
  projectId: string | null;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string }
> = async (ctx) => {
  const id = ctx.params?.projectId ?? null;
  if (id === null) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: PROJECT_BY_ID_QUERY,
      variables: {
        projectId: `ceramic://${id}`,
      },
    });
    return {
      props: { id, ...data.getProjectById },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

const QuestData = {
  logo: "https://siasky.net/AAB-yQ5MuGLqpb5fT9w0gd54RbDfRS9sZDb2aMx9NeJ8QA",
  completed: "completed",
  project: "alpha",
  owner: "huxwell.eth",
  name: "Project Alpha",
  description:
    "This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.This is an awesome project.",
  website: "https://www.google.com",
  network: "ethereum",
  reward: "200 xp",
};

function ProjectPage({
  id,
  name,
  createdBy,
  description,
  squads,
  logo,
  tags,
  createdAt,
  website,
  discord,
  twitter,
  github,
  gitbook,
}: any) {
  const { account, isReviewer } = useContext(Web3Context);
  const { getColoredText } = useCustomColor();
  const { data, loading, error } = useQuery(
    GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: id,
      },
    }
  );
  const isOwner = createdBy === account;
  if (loading) return "Loading...";
  if (error) return `Loading error! ${error.message}`;

  return (
    <Container>
      <Flex w="full">
        <HStack>
          <Image
            rounded="full"
            src={`https://ipfs.io/ipfs/${logo}`}
            objectFit="cover"
            w={150}
            h={150}
          />
          <Heading as="h1" size="4xl" pl="4">
            {name}
          </Heading>
        </HStack>
        <Spacer />
        {isOwner && (
          <NextLink
            href={`/projects/${id.split("://")[1]}/edit-project/`}
            passHref
          >
            <Button leftIcon={<EditIcon />}>Edit Project</Button>
          </NextLink>
        )}
      </Flex>

      <Flex w="full" direction="column" pt="4">
        <Flex align="center" maxW="full">
          {createdBy && <Blockies seed={createdBy} className="blockies" />}
          <VStack align="flex-start" ml="2">
            <Text color={getColoredText} textStyle="small" isTruncated>
              Creation date: {new Date(createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm" isTruncated>
              by {createdBy}
            </Text>
          </VStack>
        </Flex>
        <Stack direction="row" pt="4">
          {tags.map((tag: Tag) => (
            <Badge key={tag.id} colorScheme={tag.color}>
              {tag.label}
            </Badge>
          ))}
        </Stack>
        <HStack pt="8" spacing={8}>
          {website && (
            <Link target="_blank" href={website}>
              <Icon boxSize={8} as={BsGlobe} />
            </Link>
          )}
          {twitter && (
            <Link target="_blank" href={twitter}>
              <Icon boxSize={8} as={SiTwitter} />
            </Link>
          )}
          {discord && (
            <Link target="_blank" href={discord}>
              <Icon boxSize={8} as={SiDiscord} />
            </Link>
          )}
          {github && (
            <Link target="_blank" href={github}>
              <Icon boxSize={8} as={SiGithub} />
            </Link>
          )}
          {gitbook && (
            <Link target="_blank" href={gitbook}>
              <Icon boxSize={8} as={SiGitbook} />
            </Link>
          )}
        </HStack>
        <Text pt="8">{description}</Text>
        <Heading as="h3" size="lg" py="4">
          {squads.length} Squad{squads.length > 1 ? "s" : ""}
        </Heading>
        <SimpleGrid columns={3} spacing={4}>
          {squads.map((squad: any) => (
            <CardMedia
              h="fit-content"
              src={`https://ipfs.io/ipfs/${squad.image}`}
            >
              <Heading as="h3" size="lg">
                {squad.name}
              </Heading>
              <HStack>
                <Icon as={squad.members.length > 1 ? BsPeople : BsPerson} />
                <Heading as="h4" size="md" textTransform="uppercase">
                  {squad.members.length} MEMBER
                  {squad.members.length > 1 ? "s" : ""}
                </Heading>
              </HStack>
              <VStack align="center" maxW="full">
                {squad.members.map((member: string) => (
                  <HStack w="full">
                    {member && <Blockies seed={member} className="blockies" />}
                    <Text ml="2" fontSize="sm" isTruncated>
                      {member}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </CardMedia>
          ))}
        </SimpleGrid>
      </Flex>

      <Tabs py="2rem" w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>All pathways</Tab>
            {isReviewer && <Tab>Pending pathways</Tab>}
            <Tab>My pathways</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/${id.split("://")[1]}/pathways/add-pathway/`}
              passHref
            >
              <Button leftIcon={<EditIcon />}>Add pathway</Button>
            </NextLink>
          )}
        </HStack>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllPathwaysByProjectId
                .filter((pathway: any) => !pathway.isPending)
                .map((pathway: any) => (
                  <PathwayCard
                    key={pathway.title}
                    pathway={pathway}
                    projectContributors={squads.flatMap(
                      (squad: any) => squad.members
                    )}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          {isReviewer && (
            <TabPanel>
              <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
                {data.getAllPathwaysByProjectId
                  .filter((pathway: any) => pathway.isPending)
                  .map((pathway: any) => (
                    <PathwayCard
                      key={pathway.title}
                      pathway={pathway}
                      projectContributors={squads.flatMap(
                        (squad: any) => squad.members
                      )}
                    />
                  ))}
              </SimpleGrid>
            </TabPanel>
          )}
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              <QuestCard key={QuestData.name} quest={QuestData} />
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default ProjectPage;
