import { Button, Input, Text } from "@chakra-ui/react";
import { ProjectNFT } from "@discovery-dao/hardhat/typechain-types/ProjectNFT";
import { useState, useEffect } from "react";

type CheckIfReviewerProps = {
  contract: ProjectNFT;
};

function CheckIfReviewer({ contract }: CheckIfReviewerProps) {
  const [reviewer, setReviewer] = useState("");
  const [isReviewer, setIsReviewer] = useState(false);

  const handleCheckChange = (event: any) => setReviewer(event.target.value);

  const handleCheckIfReviewer = async () => {
    if (reviewer !== "") {
      try {
        const is = await contract.reviewers(reviewer);
        setIsReviewer(is);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    handleCheckIfReviewer();
  }, [reviewer]);

  return (
    <>
      <Text>Check reviewer</Text>
      <Input
        value={reviewer}
        onChange={handleCheckChange}
        placeholder="Reviewer Address"
      />
      <Button onClick={handleCheckIfReviewer}>Check</Button>
      {isReviewer && reviewer !== "" && (
        <Text color="green">Status: Is a reviewer</Text>
      )}
      {!isReviewer && reviewer !== "" && (
        <Text color="red">Status: Is not a reviewer</Text>
      )}
    </>
  );
}

export default CheckIfReviewer;
