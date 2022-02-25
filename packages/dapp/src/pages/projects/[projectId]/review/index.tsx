import { useMutation } from "@apollo/client";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Tag,
  TagLabel,
  HStack,
  VStack,
  Stack,
  Badge,
  Icon,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect, useState } from "react";
import Blockies from "react-blockies";
import { BsPeople, BsPerson } from "react-icons/bs";
import ReactMarkdown from "react-markdown";

import { initializeApollo } from "../../../../../lib/apolloClient";
import Card from "../../../../components/custom/Card";
import CardMedia from "../../../../components/custom/CardMedia";
import NotReviewerCard from "../../../../components/custom/NotReviewerCard";
import SocialLinks from "../../../../components/custom/SocialLinks";
import CenteredFrame from "../../../../components/layout/CenteredFrame";
import Container from "../../../../components/layout/Container";
import { Web3Context } from "../../../../contexts/Web3Provider";
import { splitCIDS } from "../../../../core/helpers";
import useCustomColor from "../../../../core/hooks/useCustomColor";
import { usePageMarkdownTheme } from "../../../../core/hooks/useMarkdownTheme";
import useTokenList from "../../../../core/hooks/useTokenList";
import { Tag as TagType } from "../../../../core/types";
import {
  APPROVE_PROJECT_MUTATION,
  PROJECT_BY_ID_QUERY,
} from "../../../../graphql/projects";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import ProjectInfo from "components/custom/review/ProjectInfo";
import AddProjectContributor from "components/custom/review/AddProjectContributor";

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
  const [projectNFTContract, setProjectNFTContract] = useState<ProjectNFT>();
  const { getColoredText } = useCustomColor();
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
      if (projectNFTContract && id) {
        const statusInt = await projectNFTContract.status(id);
        const isMinted = await projectNFTContract.projectMinted(id);
        const statusString = await projectNFTContract.statusStrings(statusInt);
        setStatus(isMinted ? "MINTED" : statusString);
      }
    }
    init();
  }, [projectNFTContract, id]);

  const handleApproveProject = async () => {
    if (projectNFTContract && chainId && account && isPendingOrNonExistent) {
      try {
        const contributors = squads.flatMap(
          ({ members }: { members: string[] }) => members
        );

        const voteForApprovalTx = await projectNFTContract.voteForApproval(
          contributors,
          10,
          id
        );
        // get return values or events
        await voteForApprovalTx.wait(1);
      } catch (e) {
        console.log("Approve Failed:", e);
      }
      const statusInt = await projectNFTContract.status(id);
      const statusString = await projectNFTContract.statusStrings(statusInt);
      setStatus(statusString);
      if (statusString === "APPROVED") {
        const mutationInput = {
          id,
          tokenUris,
          chainId: chainId.toString(),
        };
        const signature = await library.provider.send("personal_sign", [
          JSON.stringify(mutationInput),
          account,
        ]);
        return approveProjectMutation({
          variables: {
            input: {
              ...mutationInput,
              reviewerSignature: signature.result,
            },
          },
        });
      }
      return statusString;
    }
    return null;
  };
  const handleRejectProject = async () => {
    if (projectNFTContract && chainId && account && status === "PENDING") {
      try {
        const voteForRejectionTx = await projectNFTContract.voteForRejection(
          id
        );
        // get return values or events
        await voteForRejectionTx.wait(1);
      } catch (e) {
        console.log("Rejection Failed:", e);
      }
      const statusInt = await projectNFTContract.status(id);
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
    if (chainId && account) {
      const cids = tokenUris.map(
        (uri: string) => uri.split("://")[1].split("/")[0]
      );
      const { firstParts, secondParts } = splitCIDS(cids);
      const createTokenTx = await contracts.projectNFTContract.createToken(
        firstParts,
        secondParts,
        id
      );
      // get return values or events
      const receipt = await createTokenTx.wait(2);
      const isMinted = await contracts.projectNFTContract.projectMinted(id);
      setStatus("MINTED");
      console.log({ receipt, isMinted });
    }
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
          {status && isPendingOrNonExistent && (
            <HStack>
              <Button
                onClick={handleApproveProject}
                leftIcon={<CheckIcon />}
                disabled={!isPendingOrNonExistent}
              >
                {t("approve-project")}
              </Button>
              <Button
                onClick={handleRejectProject}
                ml="5"
                colorScheme="secondary"
                leftIcon={<CloseIcon />}
                disabled={status !== "PENDING"}
              >
                {t("reject-project")}
              </Button>
            </HStack>
          )}
          {status && status === "APPROVED" && (
            <HStack>
              <Button onClick={handleCreateToken} leftIcon={<CheckIcon />}>
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
        <Flex align="center" maxW="full">
          {createdBy && <Blockies seed={createdBy} className="blockies" />}
          <VStack align="flex-start" ml="2">
            {projectNFTContract && id && (
              <>
                <AddProjectContributor contract={projectNFTContract} id={id} />
                <ProjectInfo contract={projectNFTContract} id={id} />
              </>
            )}

            <Text color={getColoredText} textStyle="small" isTruncated>
              {t("creation-date")} {new Date(createdAt).toLocaleString()}
            </Text>
            <Text fontSize="sm" isTruncated>
              {t("by")} {createdBy}
            </Text>
          </VStack>
        </Flex>
        <Stack direction="row" pt="4">
          {tags.map((tag: TagType) => (
            <Badge key={tag.id} colorScheme={tag.color}>
              {tag.label}
            </Badge>
          ))}
        </Stack>
        <SocialLinks
          website={website}
          discord={discord}
          twitter={twitter}
          github={github}
          gitbook={gitbook}
        />
        <ReactMarkdown
          components={ChakraUIRenderer(projectMarkdownTheme)}
          skipHtml
        >
          {description}
        </ReactMarkdown>
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
    </Container>
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotReviewerCard />
      </Card>
    </CenteredFrame>
  );
}

export default ReviewProjectPage;
