import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type AddProjectWalletProps = {
  contract: ProjectNFT;
};

function AddProjectWallet({ contract }: AddProjectWalletProps) {
  const [projectId, setProjectId] = useState("");
  const [projectWallet, setProjectWallet] = useState("");
  const level = "SILVER";

  const onProjectId = (event: any) => setProjectId(event.target.value);
  const onProjectWallet = (event: any) => setProjectWallet(event.target.value);
  const handleAddProjectWallet = async () => {
    if (projectId !== "" && projectWallet !== "") {
      try {
        await contract.addProjectWallet(projectId, projectWallet, level, {
          value: `0xde0b6b3a7640000`,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Add Project Wallet</Text>
      <Input
        value={projectId}
        onChange={onProjectId}
        placeholder="project Id"
      />
      <Input
        value={projectWallet}
        onChange={onProjectWallet}
        placeholder="project Wallet"
      />
      <Button onClick={handleAddProjectWallet}>Submit</Button>
    </>
  );
}

export default AddProjectWallet;
