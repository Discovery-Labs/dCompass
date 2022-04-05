import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type SetThresholdProps = {
  contract: ProjectNFT;
};

function SetThreshold({ contract }: SetThresholdProps) {
  const [threshold, setThreshold] = useState("");

  const handleThresholdChange = (event: any) =>
    setThreshold(event.target.value);
  const handleSetThreshold = async () => {
    if (threshold !== "") {
      try {
        await contract.setThreshold(threshold);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Set Threshold</Text>
      <Input
        value={threshold}
        onChange={handleThresholdChange}
        placeholder="set Threshold"
      />
      <Button onClick={handleSetThreshold}>Set Threshold</Button>
    </>
  );
}

export default SetThreshold;
