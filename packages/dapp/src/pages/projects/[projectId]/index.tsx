import { useQuery } from "@apollo/client";
import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Image,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  HStack,
  VStack,
  Icon,
  Link,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { Key, useContext } from "react";

import { initializeApollo } from "../../../../lib/apolloClient";
import Container from "../../../components/layout/Container";
import BadgeCard from "../../../components/projects/badges/BadgeCard";
import QuestCard from "../../../components/QuestCard";
import { Web3Context } from "../../../contexts/Web3Provider";
import { GET_ALL_BADGES_BY_PROJECT_ID_QUERY } from "../../../graphql/badges";
import { PROJECT_BY_ID_QUERY } from "../../../graphql/projects";
import IconWithState from "components/custom/IconWithState";
import useCustomColor from "core/hooks/useCustomColor";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";

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

const allQuests = [QuestData, QuestData, QuestData];

function ProjectPage({
  id,
  name,
  createdBy,
  description,
  squads,
  logo,
  createdAt,
}: any) {
  const { account } = useContext(Web3Context);
  const { getColoredText } = useCustomColor();
  const { data, loading, error } = useQuery(
    GET_ALL_BADGES_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: id,
      },
    }
  );
  const isOwner = createdBy === account;
  if (loading) return "Loading...";
  if (error) return `Loading error! ${error.message}`;

  console.log("squads", squads);

  return (
    <Container>
      <Flex w="full">
        <Text textStyle="h1">{name}</Text>
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
        <Text color={getColoredText} textStyle="small">
          by {createdBy}
        </Text>
        <Text pt="8">{description}</Text>
        <HStack pt="8">
          <Link target="_blank" href="https://google.com">
            <Icon as={SiDiscord} />
          </Link>
          <Link target="_blank" href="https://google.com">
            <Icon as={SiGitbook} />
          </Link>
          <Link target="_blank" href="https://google.com">
            <Icon as={SiGithub} />
          </Link>
          <Link target="_blank" href="https://google.com">
            <Icon as={SiTwitter} />
          </Link>
        </HStack>
        <Text py="8">
          {squads.length} Squad{squads.length > 1 ? "s" : ""}
        </Text>
        {squads.length > 0 &&
          squads.map((squad: { name: string; image: string; members: any }) => (
            <VStack
              layerStyle="no-border-card"
              align="start"
              key={`squad ${name}`}
            >
              <HStack align="start" justify="center" alignItems="center">
                <Image
                  boxSize="50px"
                  objectFit="cover"
                  alt="Squad Image"
                  src={`https://gateway.pinata.cloud/ipfs/${squad.image}`}
                />
                <Text textStyle="h2">{squad.name}</Text>
              </HStack>
              <Text>Members</Text>
              <Text textStyle="small">
                {squad.members > 0 &&
                  squad.members.map((member: string) => <Text>{member}</Text>)}
              </Text>
            </VStack>
          ))}

        <Text pt="8" color={getColoredText} textStyle="small">
          Creation date: {new Date(createdAt).toLocaleString()}
        </Text>
      </Flex>

      <Tabs py="2rem" w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>All badges</Tab>
            <Tab>Pending badges</Tab>
            <Tab>My badges</Tab>
          </TabList>
          {isOwner && (
            <NextLink
              href={`/projects/${id.split("://")[1]}/badges/add-badge/`}
              passHref
            >
              <Button leftIcon={<EditIcon />}>Add badge</Button>
            </NextLink>
          )}
        </HStack>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllBadgesByProjectId
                .filter((badge: any) => !badge.isPending)
                .map((badge: any) => (
                  <BadgeCard
                    key={badge.title}
                    badge={badge}
                    projectContributors={squads.flatMap(
                      (squad: any) => squad.members
                    )}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2, 2, 3]} spacing={10}>
              {data.getAllBadgesByProjectId
                .filter((badge: any) => badge.isPending)
                .map((badge: any) => (
                  <BadgeCard
                    key={badge.title}
                    badge={badge}
                    projectContributors={squads.flatMap(
                      (squad: any) => squad.members
                    )}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
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
