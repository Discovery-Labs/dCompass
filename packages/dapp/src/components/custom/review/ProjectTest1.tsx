import { Heading, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useEffect, useState } from "react";

type ProjectTest1Props = {
  contract: ProjectNFT;
};

type ProjectNFTInfo = {
  projectStatus: string;
  votesNeeded: string;
  allContributors: string;
  isProjectMinted: boolean;
};

function ProjectTest1({ contract }: ProjectTest1Props) {
  const [projectNFTInfo, setProjectNFTInfo] = useState<ProjectNFTInfo>();
  const PROJECT_ID = "test1";

  useEffect(() => {
    async function init() {
      const projectStatus = await contract.status(PROJECT_ID);
      let pStatus = "";
      switch (projectStatus) {
        case 0:
          pStatus = "NONEXISTENT";
          break;
        case 1:
          pStatus = "PENDING";
          break;
        case 2:
          pStatus = "DENIED";
          break;
        case 3:
          pStatus = "APPROVED";
          break;
        default:
          break;
      }
      const votesNeeded = await contract.votes(PROJECT_ID);
      const allContributors = await contract.getContributors(PROJECT_ID);
      const isProjectMinted = await contract.projectMinted(PROJECT_ID);

      setProjectNFTInfo({
        projectStatus: pStatus,
        votesNeeded: votesNeeded.toString(),
        allContributors: allContributors.toString(),
        isProjectMinted,
      });
    }
    init();
  }, [contract]);

  return (
    <>
      {projectNFTInfo && (
        <>
          <Heading>Project: test1</Heading>
          <Text>Project status: {projectNFTInfo.projectStatus}</Text>
          <Text>Votes needed: {projectNFTInfo.votesNeeded}</Text>
          <Text>All contributors: {projectNFTInfo.allContributors}</Text>
          <Text>Is project minted: {projectNFTInfo.isProjectMinted}</Text>
        </>
      )}
    </>
  );
}

export default ProjectTest1;
