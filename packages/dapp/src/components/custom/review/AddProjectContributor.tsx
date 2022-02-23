import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type AddProjectContributorProps = {
  contract: ProjectNFT;
};

function AddProjectContributor({ contract }: AddProjectContributorProps) {
  const [reviewer, setReviewer] = useState("");

  const handleReviewerChange = (event: any) => setReviewer(event.target.value);
  const handleAddProjectContributor = async () => {
    if (reviewer !== "") {
      try {
        await contract.addReviewer(reviewer);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Text>Add Reviewer</Text>
      <Input
        value={reviewer}
        onChange={handleReviewerChange}
        placeholder="add reviewer"
      />
      <Button onClick={handleAddProjectContributor}>Add reviewer</Button>
    </>
  );
}

export default AddProjectContributor;
