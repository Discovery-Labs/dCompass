import { useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Tag,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";

import { Web3Context } from "../../../contexts/Web3Provider";
import { APPROVE_PATHWAY_MUTATION } from "../../../graphql/pathways";
import Card from "components/custom/Card";

type Pathway = {
  id: string;
  image: string;
  title: string;
  description: string;
  projectId: string;
  difficulty: string;
  isPending: boolean;
  createdBy: string;
};

function PathwayCard({
  pathway,
  projectContributors,
}: {
  pathway: Pathway;
  projectContributors: string[];
}) {
  const [approvePathwayMutation] = useMutation(APPROVE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });

  const { account, provider } = useContext(Web3Context);
  const router = useRouter();
  const isContributor = account && projectContributors.includes(account);
  function openPathway() {
    return router.push(
      `/projects/${pathway.projectId.split("://")[1]}/pathways/${pathway.id.split("://")[1]
      }`
    );
  }

  const handleApprovePathway = async () => {
    const signatureInput = {
      id: pathway.id,
      projectId: pathway.projectId,
    };
    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify(signatureInput),
      account,
    ]);
    return approvePathwayMutation({
      variables: {
        input: {
          id: pathway.id,
          pathwayApproverSignature: signature.result,
        },
      },
    });
  };

  return (
    <Card>
      <Flex w="full">
        <Avatar
          mr="0.5rem"
          boxSize="4rem"
          src={`https://ipfs.io/ipfs/${pathway.image}`}
        />
        <Spacer />
        <Flex align="end" direction="column">
          <Tag>{pathway.difficulty}</Tag>
        </Flex>
      </Flex>
      <Heading fontSize="2xl">{pathway.title}</Heading>
      <Text noOfLines={4}>{pathway.description}</Text>
      <Spacer />
      <Flex w="full" justify="space-between">
        <Button variant="outline" fontSize="md" onClick={() => openPathway()}>
          Quests
        </Button>
        {pathway.isPending && isContributor && (
          <Button fontSize="md" onClick={handleApprovePathway}>
            Approve
          </Button>
        )}
        {!pathway.isPending && (
          <Button fontSize="md" onClick={() => console.log("Claim Pathway")}>
            Claim
          </Button>
        )}
      </Flex>
    </Card>
  );
}

export default PathwayCard;
