import { Text, VStack } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useEffect, useState } from "react";

type ProjectNFTInfoProps = {
  contract: ProjectNFT;
};

type ProjectNFTInfo = {
  multiSigThreshold: string;
  numReviewers: string;
  appDiamond: string;
  SFTAddr: string;
  minForApproved: string;
};

function ProjectNFTInfo({ contract }: ProjectNFTInfoProps) {
  const [projectNFTInfo, setProjectNFTInfo] = useState<ProjectNFTInfo>();

  useEffect(() => {
    async function init() {
      const multiSigThreshold = await contract.multiSigThreshold();
      const numReviewers = await contract.numReviewers();
      const appDiamond = await contract.getAppDiamond();
      const SFTAddr = await contract.getSFTAddr();
      const minForApproved = (
        (numReviewers.toNumber() * multiSigThreshold.toNumber()) /
        100
      ).toFixed(1);
      setProjectNFTInfo({
        multiSigThreshold: multiSigThreshold.toString(),
        numReviewers: numReviewers.toString(),
        appDiamond,
        SFTAddr,
        minForApproved,
      });
    }
    init();
  }, [contract]);

  return (
    <>
      {projectNFTInfo && (
        <VStack w="full" align="start" spacing={2}>
          <Text fontSize="sm">
            Multisig Threshold: {projectNFTInfo.multiSigThreshold}
          </Text>
          <Text fontSize="sm">
            Total reviewers: {projectNFTInfo.numReviewers}
          </Text>
          <Text fontSize="sm">
            Contract App Diamond: {projectNFTInfo.appDiamond}
          </Text>
          <Text fontSize="sm">
            Contract Sponsor SFT: {projectNFTInfo.SFTAddr}
          </Text>
          <Text fontSize="sm">
            Minimum votes for approval: {projectNFTInfo.minForApproved}
          </Text>
        </VStack>
      )}
    </>
  );
}

export default ProjectNFTInfo;
