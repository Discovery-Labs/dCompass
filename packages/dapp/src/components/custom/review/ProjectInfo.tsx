import { Heading, Text } from "@chakra-ui/react";
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
        <>
          <Heading>Project: test1</Heading>
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

export default ProjectInfo;
