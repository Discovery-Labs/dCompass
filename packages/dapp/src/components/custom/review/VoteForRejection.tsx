import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type VoteForRejectionProps = {
  contract: ProjectNFT;
};

function VoteForRejection({ contract }: VoteForRejectionProps) {
  const [projectId, setProjectId] = useState("");

  const onProjectId = (event: any) => setProjectId(event.target.value);
  const handleVoteForRejection = async () => {
    if (projectId !== "") {
      try {
        await contract.voteForRejection(projectId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Vote for rejection</Text>
      <Input
        value={projectId}
        onChange={onProjectId}
        placeholder="project Id"
      />
      <Button onClick={handleVoteForRejection}>Vote for rejection</Button>
    </>
  );
}

export default VoteForRejection;
