import { Text, VStack } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useEffect, useState } from "react";

type ProjectInfoProps = {
  contract: ProjectNFT;
  id: string;
};

type ProjectNFTInfo = {
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

function ProjectInfo({ contract, id }: ProjectInfoProps) {
  const [projectNFTInfo, setProjectNFTInfo] = useState<ProjectNFTInfo>();

  useEffect(() => {
    async function init() {
      const approvedVotes = await contract.votes(id);
      const rejectedVotes = await contract.votesReject(id);
      const allContributors = await contract.getContributors(id);
      const isProjectMinted = await contract.projectMinted(id);
      const projectThresholds = await contract.projectThresholds(id);
      const sponsorLevel = await contract.sponsorLevel(id);
      const projectWallets = await contract.projectWallets(id);
      const stakePerProject = await contract.stakePerProject(id);

      setProjectNFTInfo({
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
        <VStack align="start">
          <Text textStyle="small">
            All contributors: {projectNFTInfo.allContributors}
          </Text>
          <Text textStyle="small">
            Contributors: {projectNFTInfo.contributorsLength}
          </Text>
          <Text textStyle="small">
            Approved Votes: {projectNFTInfo.approvedVotes}
          </Text>
          <Text textStyle="small">
            Rejected Votes: {projectNFTInfo.rejectedVotes}
          </Text>
          <Text textStyle="small">
            Is project minted: {projectNFTInfo.isProjectMinted}
          </Text>
          <Text textStyle="small">
            Project threshold: {projectNFTInfo.projectThresholds}
          </Text>
          <Text textStyle="small">
            Sponsor level: {projectNFTInfo.sponsorLevel}
          </Text>
          <Text textStyle="small">
            Project wallets: {projectNFTInfo.projectWallets}
          </Text>
          <Text textStyle="small">
            Stake Per Project: {projectNFTInfo.stakePerProject}
          </Text>
        </VStack>
      )}
    </>
  );
}

export default ProjectInfo;
