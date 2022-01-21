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
  Link,
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
import useTokenList from "../../../../core/hooks/useTokenList";
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
  const { defaultMainnetDAIToken } = useTokenList();
  const { isReviewer, contracts, provider } = useContext(Web3Context);
  const { chainId, account } = useWeb3React();
  const [approveProjectMutation] = useMutation(APPROVE_PROJECT_MUTATION, {
    refetchQueries: "all",
  });
  const [status, setStatus] = useState<string>();
  const { getColoredText } = useCustomColor();

  useEffect(() => {
    async function init() {
      if (contracts && id) {
        const statusInt = await contracts.projectNFTContract.status(id);
        const isMinted = await contracts.projectNFTContract.projectMinted(id);
        const statusString = await contracts.projectNFTContract.statusStrings(
          statusInt
        );
        setStatus(isMinted ? "MINTED" : statusString);
      }
    }
    init();
  }, [contracts, id]);

  const handleApproveProject = async () => {
    if (chainId && account) {
      const contributors = squads.flatMap(
        ({ members }: { members: string[] }) => members
      );
      const voteForApprovalTx =
        await contracts.projectNFTContract.voteForApproval(
          contributors,
          [defaultMainnetDAIToken.address],
          10,
          id
        );
      // get return values or events
      const receipt = await voteForApprovalTx.wait(2);
      const statusInt = await contracts.projectNFTContract.status(id);
      const statusString = await contracts.projectNFTContract.statusStrings(
        statusInt
      );
      setStatus(statusString);
      if (statusString === "APPROVED") {
        const mutationInput = {
          id,
          tokenUris,
          chainId: chainId.toString(),
        };
        const signature = await provider.provider.send("personal_sign", [
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
      console.log({ receipt, statusString });
    }
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
          {status && (status === "PENDING" || status === "NONEXISTENT") && (
            <HStack>
              <Button onClick={handleApproveProject} leftIcon={<CheckIcon />}>
                {t("approve-project")}
              </Button>
              <Button ml="5" colorScheme="secondary" leftIcon={<CloseIcon />}>
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
        {/* <Text pt="8">{description}</Text> */}
        <ReactMarkdown
          components={ChakraUIRenderer()}
          children={description}
          skipHtml
        />
        ;
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
