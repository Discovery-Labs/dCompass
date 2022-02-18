import { Heading, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useEffect, useState } from "react";

type ProjectTest1Props = {
  contract: ProjectNFT;
};

type ProjectNFTInfo = {
  projectStatus: string;
  approvedVotes: string;
  rejectedVotes: string;
  contributorsLength: number;
  allContributors: string;
  isProjectMinted: string;
  projectThresholds: string;
  sponsorLevel: string;
  projectWallets: string;
  stakePerProject: string;
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
      const approvedVotes = await contract.votes(PROJECT_ID);
      const rejectedVotes = await contract.votesReject(PROJECT_ID);
      const allContributors = await contract.getContributors(PROJECT_ID);
      const isProjectMinted = await contract.projectMinted(PROJECT_ID);
      const projectThresholds = await contract.projectThresholds(PROJECT_ID);
      const sponsorLevel = await contract.sponsorLevel(PROJECT_ID);
      const projectWallets = await contract.projectWallets(PROJECT_ID);
      const stakePerProject = await contract.stakePerProject(PROJECT_ID);

      setProjectNFTInfo({
        projectStatus: pStatus,
        approvedVotes: approvedVotes.toString(),
        rejectedVotes: rejectedVotes.toString(),
        contributorsLength: allContributors.length,
        allContributors: allContributors.toString(),
        isProjectMinted: isProjectMinted ? "Minted" : "Not Minted",
        projectThresholds: projectThresholds.toString(),
        sponsorLevel: sponsorLevel.toString(),
        projectWallets: projectWallets,
        stakePerProject: stakePerProject.toString(),
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
          <Text>Approved Votes: {projectNFTInfo.approvedVotes}</Text>
          <Text>Rejected Votes: {projectNFTInfo.rejectedVotes}</Text>
          <Text>Contributors: {projectNFTInfo.contributorsLength}</Text>
          <Text>All contributors: {projectNFTInfo.allContributors}</Text>
          <Text>Is project minted: {projectNFTInfo.isProjectMinted}</Text>
          <Text>Project threshold: {projectNFTInfo.projectThresholds}</Text>
          <Text>Sponsor level: {projectNFTInfo.sponsorLevel}</Text>
          <Text>Project wallets: {projectNFTInfo.projectWallets}</Text>
          <Text>Stake Per Project: {projectNFTInfo.stakePerProject}</Text>
        </>
      )}
    </>
  );
}

export default ProjectTest1;
