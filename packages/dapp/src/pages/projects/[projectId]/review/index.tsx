import { useMutation } from "@apollo/client";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useWeb3React } from "@web3-react/core";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import AddProjectContributor from "components/custom/review/AddProjectContributor";
import ProjectInfo from "components/custom/review/ProjectInfo";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import Blockies from "react-blockies";
import { BsGlobe, BsPeople, BsPerson } from "react-icons/bs";
import { SiDiscord, SiGitbook, SiGithub, SiTwitter } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import { initializeApollo } from "../../../../../lib/apolloClient";
import Card from "../../../../components/custom/Card";
import CardMedia from "../../../../components/custom/CardMedia";
import NotReviewerCard from "../../../../components/custom/NotReviewerCard";
import CenteredFrame from "../../../../components/layout/CenteredFrame";
import Container from "../../../../components/layout/Container";
import { Web3Context } from "../../../../contexts/Web3Provider";
import { splitCIDS } from "../../../../core/helpers";
import useCustomColor from "../../../../core/hooks/useCustomColor";
import { usePageMarkdownTheme } from "../../../../core/hooks/useMarkdownTheme";
// import useTokenList from "../../../../core/hooks/useTokenList";
import { Tag as TagType } from "../../../../core/types";
import {
  APPROVE_PROJECT_MUTATION,
  PROJECT_BY_ID_QUERY,
} from "../../../../graphql/projects";

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
        projectId: id,
      },
    });

    return {
      props: {
        id,
        ...data.getProjectById,
        ...(await serverSideTranslations(ctx.locale || "en", ["common"])),
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

function ReviewProjectPage({
  id,
  streamId,
  tokenUris,
  logo,
  name,
  createdBy,
  description,
  squads,
  createdAt,
  tags,
  website,
  discord,
  twitter,
  github,
  gitbook,
}: any) {
  const { t } = useTranslation("common");
  const { isReviewer, contracts } = useContext(Web3Context);
  const { chainId, account, library } = useWeb3React();
  const [approveProjectMutation] = useMutation(APPROVE_PROJECT_MUTATION, {
    refetchQueries: "all",
  });
  const [status, setStatus] = useState<string>();
  const [hasVoted, setHasVoted] = useState(false);
  const [isApprovingProject, setIsApprovingProject] = useState(false);
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [projectNFTContract, setProjectNFTContract] = useState<ProjectNFT>();

  const projectMarkdownTheme = usePageMarkdownTheme();

  const isPendingOrNonExistent =
    status === "PENDING" || status === "NONEXISTENT";

  useEffect(() => {
    async function init() {
      if (contracts) {
        setProjectNFTContract(contracts.projectNFTContract);
      }
    }
    init();
  }, [contracts, projectNFTContract]);

  useEffect(() => {
    async function init() {
      if (projectNFTContract && streamId && account) {
        const statusInt = await projectNFTContract.status(streamId);
        const isMinted = await projectNFTContract.projectMinted(streamId);
        const statusString = await projectNFTContract.statusStrings(statusInt);
        setStatus(isMinted ? "MINTED" : statusString);

        const hasVoted = await projectNFTContract.reviewerVotes(
          streamId,
          account
        );
        setHasVoted(hasVoted);
      }
    }
    init();
  }, [projectNFTContract, streamId, account]);

  const handleApproveProject = async () => {
    setIsApprovingProject(true);
    if (projectNFTContract && chainId && account && isPendingOrNonExistent) {
      try {
        const contributors = squads.flatMap(
          ({ members }: { members: string[] }) => members
        );

        const voteForApprovalTx = await projectNFTContract.voteForApproval(
          contributors,
          10,
          streamId
        );
        // get return values or events
        await voteForApprovalTx.wait(1);
      } catch (e) {
        setIsApprovingProject(false);
        console.log("Approve Failed:", e);
      }
      const statusInt = await projectNFTContract.status(streamId);
      const statusString = await projectNFTContract.statusStrings(statusInt);
      setStatus(statusString);
      if (statusString === "APPROVED") {
        const mutationInput = {
          id,
          tokenUris,
        };

        setIsApprovingProject(false);
        return approveProjectMutation({
          variables: {
            input: mutationInput,
          },
        });
      }
      setIsApprovingProject(false);
      return statusString;
    }
    setIsApprovingProject(false);
    return null;
  };
  const handleRejectProject = async () => {
    if (projectNFTContract && chainId && account && status === "PENDING") {
      try {
        const voteForRejectionTx = await projectNFTContract.voteForRejection(
          streamId
        );
        // get return values or events
        await voteForRejectionTx.wait(1);
      } catch (e) {
        console.log("Rejection Failed:", e);
      }
      const statusInt = await projectNFTContract.status(streamId);
      const statusString = await projectNFTContract.statusStrings(statusInt);
      setStatus(statusString);
      if (statusString === "DENIED") {
        // project Refund
      }
      return statusString;
    }
    return null;
  };
  const handleCreateToken = async () => {
    setIsCreatingToken(true);
    if (chainId && account) {
      const cids = tokenUris.map(
        (uri: string) => uri.split("://")[1].split("/")[0]
      );
      const { firstParts, secondParts } = splitCIDS(cids);
      const createTokenTx = await contracts.projectNFTContract.createToken(
        firstParts,
        secondParts,
        streamId
      );
      // get return values or events
      const receipt = await createTokenTx.wait(2);
      const isMinted = await contracts.projectNFTContract.projectMinted(
        streamId
      );
      setStatus("MINTED");
      console.log({ receipt, isMinted });
    }
    setIsCreatingToken(false);
    return null;
  };

  return isReviewer ? (
    <Container>
      <Flex w="full">
        <HStack>
          <Image
            alt="reviewer logo"
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
        <VStack align="left">
          <Text textStyle="small">
            {hasVoted && status == "PENDING" ? "You have already voted" : ""}
          </Text>
          {status && isPendingOrNonExistent && (
            <HStack>
              <Button
                onClick={handleApproveProject}
                leftIcon={<CheckIcon />}
                disabled={!isPendingOrNonExistent || hasVoted}
                isLoading={isApprovingProject}
                loadingText={"Approving project"}
              >
                {t("approve-project")}
              </Button>
              <Button
                onClick={handleRejectProject}
                ml="5"
                colorScheme="secondary"
                leftIcon={<CloseIcon />}
                disabled={status !== "PENDING" || hasVoted}
              >
                {t("reject-project")}
              </Button>
            </HStack>
          )}
          {status && status === "APPROVED" && (
            <HStack>
              <Button
                onClick={handleCreateToken}
                isLoading={isCreatingToken}
                loadingText={"Minting project"}
                leftIcon={<CheckIcon />}
              >
                {t("create-token")}
              </Button>
            </HStack>
          )}
          <Tag
            variant="outline"
            w="fit-content"
            colorScheme={
              status === "APPROVED" || status === "MINTED" ? "green" : "orange"
            }
            size="sm"
          >
            <TagLabel>{status}</TagLabel>
          </Tag>
        </VStack>
      </Flex>
      <Flex w="full" direction="column" pt="4">
        <VStack w="full" align="flex-start" ml="2">
          <VStack align="flex-start">
            {createdBy && <Blockies seed={createdBy} className="blockies" />}
            <Text color="text-weak" textStyle="small">
              {t("creation-date")} {new Date(createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm">
              {t("by")} {createdBy}
            </Text>
          </VStack>

          <Stack direction="row" pt="4">
            {tags.map((tag: TagType) => (
              <Badge key={tag.id} colorScheme={tag.color}>
                {tag.label}
              </Badge>
            ))}
          </Stack>

          <ReactMarkdown
            components={ChakraUIRenderer(projectMarkdownTheme)}
            skipHtml
          >
            {description}
          </ReactMarkdown>

          {projectNFTContract && streamId && (
            <>
              <HStack
                pt="4"
                w="full"
                align="start"
                justify="space-between"
                spacing={8}
              >
                <AddProjectContributor
                  contract={projectNFTContract}
                  id={streamId}
                />
                <Box layerStyle="outline-card">
                  <ProjectInfo contract={projectNFTContract} id={streamId} />
                </Box>
              </HStack>
            </>
          )}
        </VStack>

        <VStack align="flex-start">
          <Heading>Links</Heading>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={BsGlobe} />
            </InputLeftElement>
            <Input value={website} disabled />
          </InputGroup>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={SiTwitter} />
            </InputLeftElement>
            <Input value={twitter} disabled />
          </InputGroup>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={SiDiscord} />
            </InputLeftElement>
            <Input value={discord} disabled />
          </InputGroup>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={SiGithub} />
            </InputLeftElement>
            <Input value={github} disabled />
          </InputGroup>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={SiGitbook} />
            </InputLeftElement>
            <Input value={gitbook} disabled />
          </InputGroup>
        </VStack>

        <Heading as="h3" size="lg" py="4">
          {squads.length} Squad{squads.length > 1 ? "s" : ""}
        </Heading>
        <SimpleGrid columns={3} spacing={4}>
          {squads.map((squad: any) => (
            <CardMedia
              key={squad.id}
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
                  <HStack w="full" key={member}>
                    {member && <Blockies seed={member} className="blockies" />}
                    <Text ml="2" fontSize="sm">
                      {member}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </CardMedia>
          ))}
        </SimpleGrid>
      </Flex>
    </Container>
  ) : (
    <CenteredFrame>
      <Card layerStyle="solid-card" h="full" w="full" border="solid 1px red">
        <NotReviewerCard />
      </Card>
    </CenteredFrame>
  );
}

export default ReviewProjectPage;
