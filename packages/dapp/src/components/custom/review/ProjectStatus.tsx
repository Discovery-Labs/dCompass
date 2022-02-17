import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type ProjectStatusProps = {
  contract: ProjectNFT;
};

function ProjectStatus({ contract }: ProjectStatusProps) {
  const [projectId, setProjectId] = useState("");
  const [projectStatus, setProjectStatus] = useState("");

  const onProjectId = (event: any) => setProjectId(event.target.value);
  const handleProjectStatus = async () => {
    if (projectId !== "") {
      try {
        const status = await contract.status(projectId);
        switch (status) {
          case 0:
            setProjectStatus("NONEXISTENT");
            break;
          case 1:
            setProjectStatus("PENDING");
            break;
          case 2:
            setProjectStatus("DENIED");
            break;
          case 3:
            setProjectStatus("APPROVED");
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Check project status</Text>
      <Input
        value={projectId}
        onChange={onProjectId}
        placeholder="project Id"
      />
      <Button onClick={handleProjectStatus}>Check</Button>
      <Text>Status: {projectStatus}</Text>
    </>
  );
}

export default ProjectStatus;
