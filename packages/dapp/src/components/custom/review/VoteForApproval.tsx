import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type VoteForApprovalProps = {
  contract: ProjectNFT;
};

function VoteForApproval({ contract }: VoteForApprovalProps) {
  const [threshold, setThreshold] = useState("");
  const [projectId, setProjectId] = useState("");

  const contributors = [
    "0xD39C3Cdb811f6544067ECFeDEf40855578cA0C52",
    "0xCf642913012CaBCBF09ca4f18748a430fA01237e",
    "0x4E7a45148C65248183AE1CE6C33fFAE5825C1979",
    "0x4553d50bEAf37ea51430C7E192ec4283d9B5BD56",
  ];

  const handleThresholdChange = (event: any) =>
    setThreshold(event.target.value);
  const onProjectId = (event: any) => setProjectId(event.target.value);
  const handleVoteForApproval = async () => {
    if (threshold !== "" && projectId !== "") {
      try {
        await contract.voteForApproval(contributors, threshold, projectId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Vote for approval</Text>
      <Input
        value={threshold}
        onChange={handleThresholdChange}
        placeholder="set Threshold"
      />
      <Input
        value={projectId}
        onChange={onProjectId}
        placeholder="project Id"
      />
      <Button onClick={handleVoteForApproval}>Vote for approval</Button>
    </>
  );
}

export default VoteForApproval;
