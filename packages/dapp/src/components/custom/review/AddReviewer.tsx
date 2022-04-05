import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type AddReviewerProps = {
  contract: ProjectNFT;
};

function AddReviewer({ contract }: AddReviewerProps) {
  const [reviewer, setReviewer] = useState("");

  const handleReviewerChange = (event: any) => setReviewer(event.target.value);
  const handleAddReviewer = async () => {
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
      <Button onClick={handleAddReviewer}>Add reviewer</Button>
    </>
  );
}

export default AddReviewer;
