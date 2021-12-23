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
  Box,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";

import { initializeApollo } from "../../../../../lib/apolloClient";
import Card from "../../../../components/custom/Card";
import NotReviewerCard from "../../../../components/custom/NotReviewerCard";
import CenteredFrame from "../../../../components/layout/CenteredFrame";
import Container from "../../../../components/layout/Container";
import { Web3Context } from "../../../../contexts/Web3Provider";
import { splitCIDS } from "../../../../core/helpers";
import {
  APPROVE_PROJECT_MUTATION,
  PROJECT_BY_ID_QUERY,
} from "../../../../graphql/projects";
import IconWithState from "components/custom/IconWithState";

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

function ReviewProjectPage({
  id,
  tokenUris,
  name,
  createdBy,
  description,
  squads,
  createdAt,
}: any) {
  const { isReviewer, contracts, provider } = useContext(Web3Context);
  const { chainId, account } = useWeb3React();
  const [approveProjectMutation] = useMutation(APPROVE_PROJECT_MUTATION, {
    refetchQueries: "all",
  });
  const [status, setStatus] = useState<string>();

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
        <Heading>{name}</Heading>
        <Spacer />
        <VStack align="left">
          {status && (status === "PENDING" || status === "NONEXISTENT") && (
            <HStack>
              <Button onClick={handleApproveProject} leftIcon={<CheckIcon />}>
                Approve Project
              </Button>
              <Button ml="5" colorScheme="pink" leftIcon={<CloseIcon />}>
                Reject Project
              </Button>
            </HStack>
          )}
          {status && status === "APPROVED" && (
            <HStack>
              <Button onClick={handleCreateToken} leftIcon={<CheckIcon />}>
                Create Token
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
        <Text fontSize="sm">by {createdBy}</Text>
        <Text pt="8">{description}</Text>
        <Text pt="8" fontSize="xs">
          {squads.length} Squad{squads.length > 1 ? "s" : ""}
        </Text>
        {squads.map((squad: any) => {
          return (
            <Box>
              <Text>{squad.name}</Text>
              members:{" "}
              {squad.members.map((member: string) => (
                <Text py="2" fontSize="xs">
                  {member}
                </Text>
              ))}
            </Box>
          );
        })}
        <Text>Created at: {new Date(createdAt).toLocaleString()}</Text>
        <Flex pt="12" w="full" justify="space-around">
          <IconWithState icon="discord" active />
          <IconWithState icon="gitbook" />
          <IconWithState icon="github" />
          <IconWithState icon="twitter" />
        </Flex>
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
