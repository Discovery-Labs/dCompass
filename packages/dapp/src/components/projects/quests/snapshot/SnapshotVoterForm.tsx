import { Button, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

function SnapshotVoterForm({ proposalId, questId }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    setIsLoading(true);
    console.log({ questId });
    // TODO: call ceramic & back-end here
    setIsLoading(false);
  };
  return (
    <VStack>
      <Text>Display proposal here {proposalId}</Text>
      <Button
        isLoading={isLoading}
        loadingText="Verifiying eligibility..."
        onClick={handleSubmit}
      >
        Claim
      </Button>
    </VStack>
  );
}

export default SnapshotVoterForm;
