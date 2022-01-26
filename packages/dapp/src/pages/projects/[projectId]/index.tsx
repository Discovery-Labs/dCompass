import { useQuery } from "@apollo/client";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Progress,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";
import { BsPeople, BsPerson } from "react-icons/bs";
import { MdPersonAddAlt1 } from "react-icons/md";
import ReactMarkdown from "react-markdown";

import { initializeApollo } from "../../../../lib/apolloClient";
import Address from "../../../components/custom/Address";
import CardMedia from "../../../components/custom/CardMedia";
import ProfileForm from "../../../components/custom/profile/ProfileForm";
import SocialLinks from "../../../components/custom/SocialLinks";
import BreadcrumbItems from "../../../components/layout/BreadcrumbItems";
import QuestCard from "../../../components/projects/quests/QuestCard";
import { streamUrlToId } from "../../../core/helpers";
import { Tag } from "../../../core/types";
import { GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY } from "../../../graphql/pathways";
import { PROJECT_BY_ID_QUERY } from "../../../graphql/projects";
import Container from "components/layout/Container";
import PathwayCard from "components/projects/pathways/PathwayCard";
import { Web3Context } from "contexts/Web3Provider";
import useCustomColor from "core/hooks/useCustomColor";

type Props = {
  projectId: string | null;
  locale: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string; locale: string }
> = async (ctx) => {
  const locale = ctx.locale || "en";
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
      props: {
        id,
        ...data.getProjectById,
        ...(await serverSideTranslations(locale, ["common"])),
      },
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation("common");
  const { getTextColor, getColoredText } = useCustomColor();
  const { account, isReviewer } = useContext(Web3Context);
  const { data, loading, error } = useQuery(
    GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: id,
      },
    }
  );
  const isOwner = createdBy === account;
  if (loading)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">
          {t("project")} {t("loading")}
        </Text>
        <Progress size="xs" isIndeterminate />
      </Stack>
    );
  if (error) return `Loading error! ${error.message}`;

  const projectMarkdownTheme = {
    h1: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h1" size="xl" color={getColoredText}>
          {children}
        </Heading>
      );
    },
    h2: (props) => {
      const { children } = props;
      return (
        <Heading py="2" as="h2" size="lg" color={getColoredText}>
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
    <Container>
      <BreadcrumbItems
        breadCrumbs={[
          {
            label: "Projects",
            href: "/",
          },
          {
            label: name,
            href: `/projects/${streamUrlToId(id)}`,
            isCurrentPage: true,
          },
        ]}
      />
      <Flex w="full">
        <VStack w="full">
          <Image
            rounded="full"
            src={`https://ipfs.io/ipfs/${logo}`}
            objectFit="cover"
            w={200}
            h={200}
          />
          <Stack direction="row">
            {tags.map((tag: Tag) => (
              <Badge key={tag.id} fontSize="lg" colorScheme={tag.color}>
                {tag.label}
              </Badge>
            ))}
          </Stack>
          <VStack textAlign="center" w="full">
            <Heading as="h1" size="3xl" pl="4" color={getTextColor}>
              {name}
            </Heading>
          </VStack>
        </VStack>
        <Spacer />
        <VStack align="flex-end">
          <Button leftIcon={<MdPersonAddAlt1 />} onClick={onOpen}>
            Apply
          </Button>
          <Modal onClose={onClose} isOpen={isOpen} size="4xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Apply to {name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <ProfileForm
                  submitButtonLabel="Submit application"
                  projectId={streamUrlToId(id)}
                  projectName={name}
                  onCloseForm={onClose}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
          {isOwner && (
            <NextLink
              href={`/projects/${streamUrlToId(id)}/edit-project/`}
              passHref
            >
              <Button variant="outline" leftIcon={<EditIcon />}>
                Edit Project
              </Button>
            </NextLink>
          )}
        </VStack>
      </Flex>

      <Flex w="full" direction="column" py="4">
        <HStack justifyContent="space-between">
          <Flex align="center" maxW="full">
            {createdBy && <Blockies seed={createdBy} className="blockies" />}
            <VStack align="flex-start" ml="2">
              <Text color={getColoredText} textStyle="small" isTruncated>
                {t("creation-date")} {new Date(createdAt).toLocaleString()}
              </Text>
              <Text fontSize="sm" isTruncated>
                {t("by")} {createdBy}
              </Text>
            </VStack>
          </Flex>
          <SocialLinks
            website={website}
            discord={discord}
            twitter={twitter}
            github={github}
            gitbook={gitbook}
          />
        </HStack>
      </Flex>

      <Tabs w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>{t("about")}</Tab>
            <Tab>{t("pathways")}</Tab>
            <Tab>{t("guilds")}</Tab>
            <Tab>{t("bounties")}</Tab>
            <Tab>{t("events")}</Tab>
          </TabList>
        </HStack>

        <TabPanels>
          <TabPanel px="0">
            <VStack w="full" align="flex-start">
              <ReactMarkdown
                components={ChakraUIRenderer(projectMarkdownTheme)}
                children={description}
                skipHtml
              />
            </VStack>
          </TabPanel>
          <TabPanel px="0">
            <Tabs w="full" variant="line">
              <HStack justifyContent="space-between">
                <TabList>
                  <Tab>{t("all-pathways")}</Tab>
                  {isReviewer && <Tab>{t("pending-pathways")}</Tab>}
                  <Tab>{t("my-pathways")}</Tab>
                </TabList>
                {isOwner && (
                  <NextLink
                    href={`/projects/${id.split("://")[1]
                      }/pathways/add-pathway/`}
                    passHref
                  >
                    <Button variant="outline" leftIcon={<AddIcon />}>
                      {t("add-pathway")}
                    </Button>
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
          </TabPanel>
          <TabPanel px="0">
            <SimpleGrid columns={3} spacing={4}>
              {squads.map((squad: any) => (
                <CardMedia
                  h="fit-content"
                  src={`https://ipfs.io/ipfs/${squad.image}`}
                >
                  <Heading as="h3" size="lg" color={getTextColor}>
                    {squad.name}
                  </Heading>
                  <HStack>
                    <Icon as={squad.members.length > 1 ? BsPeople : BsPerson} />
                    <Heading
                      as="h4"
                      size="md"
                      textTransform="uppercase"
                      color={getTextColor}
                    >
                      {squad.members.length} {t("member")}
                      {squad.members.length > 1 ? "s" : ""}
                    </Heading>
                  </HStack>
                  <VStack align="center" maxW="full">
                    {squad.members.map(
                      (member: string) =>
                        member && (
                          <HStack w="full">
                            <Address
                              address={member}
                              value={member}
                              type="external"
                              fontSize="18px"
                              size="short"
                            />
                          </HStack>
                        )
                    )}
                  </VStack>
                </CardMedia>
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
