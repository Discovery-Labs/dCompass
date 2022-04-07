import { useQuery } from "@apollo/client";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Container from "components/layout/Container";
import PathwayCard from "components/projects/pathways/PathwayCard";
import { Web3Context } from "contexts/Web3Provider";
import useCustomColor from "core/hooks/useCustomColor";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextLink from "next/link";
import { useContext } from "react";
import Blockies from "react-blockies";
import { MdPersonAddAlt1 } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { initializeApollo } from "../../../../lib/apolloClient";
import CardMedia from "../../../components/custom/CardMedia";
import MembersAddress from "../../../components/custom/MembersAddress";
import ProfileForm from "../../../components/custom/profile/ProfileForm";
import SocialLinks from "../../../components/custom/SocialLinks";
import BreadcrumbItems from "../../../components/layout/BreadcrumbItems";
import { usePageMarkdownTheme } from "../../../core/hooks/useMarkdownTheme";
import { Pathway, Tag } from "../../../core/types";
import { GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY } from "../../../graphql/pathways";
import { PROJECT_BY_ID_QUERY } from "../../../graphql/projects";

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

  console.log({ inServSideP: id });
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
        projectId: id,
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

function ProjectPage({
  id,
  name,
  createdBy,
  description,
  slogan,
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
  const {
    isOpen: isOpenSquad,
    onOpen: onOpenSquad,
    onClose: onCloseSquad,
  } = useDisclosure();
  const projectMarkdownTheme = usePageMarkdownTheme();

  const { t } = useTranslation("common");
  const { accentColorScheme } = useCustomColor();
  const { account, isReviewer } = useContext(Web3Context);
  console.log({ isReviewer });
  const { data, loading, error } = useQuery(
    GET_ALL_PATHWAYS_BY_PROJECT_ID_QUERY,
    {
      variables: {
        projectId: id,
      },
    }
  );
  const isOwner = createdBy === account;
  const isProjectContributor = squads
    .flatMap(({ members }: { members: string[] }) => members)
    .includes(account);
  const canEdit = isProjectContributor || isOwner;
  const canReviewPathways = isProjectContributor || isOwner || isReviewer;

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

  const renderPathways = (pathways: Pathway[]) => {
    return pathways.map((pathway) => (
      <PathwayCard
        key={pathway.title}
        pathway={pathway}
        projectContributors={squads.flatMap(
          ({ members }: { members: string[] }) => members
        )}
      />
    ));
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
            href: `/projects/${id}`,
            isCurrentPage: true,
          },
        ]}
      />
      <Flex w="full" pt="8">
        <HStack w="full" align="start" spacing="8">
          <Image
            alt="logo image"
            rounded="full"
            src={`https://ipfs.io/ipfs/${logo}`}
            objectFit="cover"
            w={200}
            h={200}
          />
          <VStack w="full" h="full" align="start" justify="center">
            <Stack direction="row">
              {tags.map((tag: Tag) => (
                <Badge key={tag.id} fontSize="lg" colorScheme={tag.color}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
            <Heading as="h1" size="3xl" pl="4" color="text">
              {name}
            </Heading>

            {/* Short description */}
            <Text color="text-weak">{slogan}</Text>
          </VStack>
        </HStack>
        <Spacer />
        <HStack align="flex-start">
          <Button
            colorScheme={accentColorScheme}
            leftIcon={<MdPersonAddAlt1 />}
            onClick={onOpen}
          >
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
                  projectId={id}
                  projectName={name}
                  onCloseForm={onClose}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
          {canEdit && (
            <NextLink href={`/projects/${id}/edit-project/`} passHref>
              <Button variant="outline" leftIcon={<EditIcon />}>
                Edit Project
              </Button>
            </NextLink>
          )}
        </HStack>
      </Flex>

      <HStack w="full" align="start">
        <Flex direction="column" py="4">
          <SocialLinks
            website={website}
            discord={discord}
            twitter={twitter}
            github={github}
            gitbook={gitbook}
          />
        </Flex>
      </HStack>

      <Tabs w="full">
        <HStack justifyContent="space-between">
          <TabList>
            <Tab>{t("pathways")}</Tab>
            <Tab>{t("guilds")}</Tab>
            <Tab>{t("about")}</Tab>
          </TabList>
        </HStack>

        <TabPanels>
          {/* Pathways */}
          <TabPanel px="0">
            <Tabs w="full" variant="unstyled">
              <HStack justifyContent="space-between">
                <TabList>
                  <Tab>{t("all-pathways")}</Tab>
                  {canReviewPathways && <Tab>{t("pending-pathways")}</Tab>}
                  <Tab>{t("my-pathways")}</Tab>
                </TabList>
                {
                  <NextLink
                    href={`/projects/${id}/pathways/add-pathway/`}
                    passHref
                  >
                    <Button variant="outline" leftIcon={<AddIcon />}>
                      {t("add-pathway")}
                    </Button>
                  </NextLink>
                }
              </HStack>

              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={[1, 1, 2, 3]} spacing={10}>
                    {renderPathways(data.getAllPathwaysByProjectId.pathways)}
                  </SimpleGrid>
                </TabPanel>
                {canReviewPathways && (
                  <TabPanel>
                    <SimpleGrid columns={[1, 1, 2, 3]} spacing={10}>
                      {renderPathways(
                        data.getAllPathwaysByProjectId.pendingPathways
                      )}
                    </SimpleGrid>
                  </TabPanel>
                )}
                <TabPanel>
                  <SimpleGrid columns={[1, 1, 2, 3]} spacing={10} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>

          {/* Guilds */}
          <TabPanel px="0">
            <SimpleGrid columns={3} spacing={4}>
              {squads.map((squad: any) => (
                <CardMedia
                  key={squad.id}
                  h="fit-content"
                  src={`https://ipfs.io/ipfs/${squad.image}`}
                >
                  <Heading as="h3" size="lg" color="text">
                    {squad.name}
                  </Heading>
                  <MembersAddress
                    squad={squad}
                    isOpen={isOpenSquad}
                    onOpen={onOpenSquad}
                    onClose={onCloseSquad}
                  />
                </CardMedia>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* About */}
          <TabPanel px="0">
            <VStack w="full" align="flex-start">
              <ReactMarkdown
                components={ChakraUIRenderer(projectMarkdownTheme)}
                skipHtml
              >
                {description}
              </ReactMarkdown>
              <Flex align="center" maxW="full">
                {createdBy && (
                  <Blockies seed={createdBy} className="blockies" />
                )}
                <VStack align="flex-start" ml="2">
                  <Text color="text-weak" textStyle="small" isTruncated>
                    {t("creation-date")} {new Date(createdAt).toLocaleString()}
                  </Text>
                  <Text fontSize="sm" isTruncated>
                    {t("by")}{" "}
                    <NextLink href={`/badges/${createdBy}/`} passHref>
                      <Link>{createdBy}</Link>
                    </NextLink>
                  </Text>
                </VStack>
              </Flex>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default ProjectPage;
