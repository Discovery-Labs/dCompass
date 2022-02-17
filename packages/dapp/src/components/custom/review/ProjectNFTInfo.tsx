import { Text } from "@chakra-ui/react";
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
};

function ProjectNFTInfo({ contract }: ProjectNFTInfoProps) {
  const [projectNFTInfo, setProjectNFTInfo] = useState<ProjectNFTInfo>();

  useEffect(() => {
    async function init() {
      const multiSigThreshold = await contract.multiSigThreshold();
      const numReviewers = await contract.numReviewers();
      const appDiamond = await contract.getAppDiamond();
      const SFTAddr = await contract.getSFTAddr();
      setProjectNFTInfo({
        multiSigThreshold: multiSigThreshold.toString(),
        numReviewers: numReviewers.toString(),
        appDiamond,
        SFTAddr,
      });
    }
    init();
  }, [contract]);

  return (
    <>
      {projectNFTInfo && (
        <>
          <Text>Multisig Threshold: {projectNFTInfo.multiSigThreshold}</Text>
          <Text>Total reviewers: {projectNFTInfo.numReviewers}</Text>
          <Text>Contract App Diamond: {projectNFTInfo.appDiamond}</Text>
          <Text>Contract Sponsor SFT: {projectNFTInfo.SFTAddr}</Text>
        </>
      )}
    </>
  );
}

export default ProjectNFTInfo;
