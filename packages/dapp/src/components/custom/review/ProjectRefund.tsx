import { Button, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";

type ProjectRefundProps = {
  contract: ProjectNFT;
};

function ProjectRefund({ contract }: ProjectRefundProps) {
  const PROJECT_ID = "test1";

  const handleProjectRefund = async () => {
    try {
      await contract.projectRefund(PROJECT_ID, {
        value: "0x6F05B59D3B200000".toLowerCase(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Text>Refund</Text>
      <Button onClick={handleProjectRefund}>Refund test1</Button>
    </>
  );
}

export default ProjectRefund;
