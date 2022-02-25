import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type AddProjectContributorProps = {
  contract: ProjectNFT;
  id: string;
};

function AddProjectContributor({ contract, id }: AddProjectContributorProps) {
  const [contributor, setContributor] = useState("");

  const handleContributorChange = (event: any) =>
    setContributor(event.target.value);
  const handleAddProjectContributor = async () => {
    if (contributor !== "") {
      try {
        await contract.addProjectContributor(id, contributor);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Add Contributor</Text>
      <Input
        value={contributor}
        onChange={handleContributorChange}
        placeholder="add Contributor"
      />
      <Button onClick={handleAddProjectContributor}>Add Contributor</Button>
    </>
  );
}

export default AddProjectContributor;
