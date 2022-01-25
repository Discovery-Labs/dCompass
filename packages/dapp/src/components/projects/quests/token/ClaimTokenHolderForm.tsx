import { Button, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

import { namespaces } from "../../../../core/constants";
import NETWORKS from "../../../../core/networks";

function ClaimTokenHolderForm({
  questId,
  amount,
  contractAddress,
  namespace = "eip155",
  tokenChainId = "1",
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    setIsLoading(true);
    console.log({ questId });
    // TODO: call ceramic & back-end here
    setIsLoading(false);
  };
  return (
    <VStack>
      <Text>Display token details here {contractAddress}</Text>
      <Text>
        Hold minimum: {amount} $TODO: on the{" "}
        {NETWORKS[tokenChainId as keyof typeof NETWORKS].name} network on{" "}
        {namespaces[namespace as keyof typeof namespaces]}
      </Text>
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

export default ClaimTokenHolderForm;
