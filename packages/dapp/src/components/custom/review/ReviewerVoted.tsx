import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState } from "react";

type ReviewerVotedProps = {
  contract: ProjectNFT;
};

function ReviewerVoted({ contract }: ReviewerVotedProps) {
  const [reviewer, setReviewer] = useState("");
  const PROJECT_ID = "test1";

  const handleReviewerChange = (event: any) => setReviewer(event.target.value);
  const handleReviewerVoted = async () => {
    if (reviewer !== "") {
      try {
        await contract.reviewerVotes(PROJECT_ID, reviewer);
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
      <Button onClick={handleReviewerVoted}>Add reviewer</Button>
    </>
  );
}

export default ReviewerVoted;
