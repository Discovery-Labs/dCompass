import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { namespaces } from "../../../../core/constants";
import NETWORKS from "../../../../core/networks";

function ClaimNFTOwnerForm({
  contractAddress,
  questId,
  namespace = "eip155",
  collectionChainId = "1",
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
        Hold an NFT of this collection on{" "}
        {NETWORKS[collectionChainId as keyof typeof NETWORKS].name} (
        {namespaces[namespace as keyof typeof namespaces]})
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

export default ClaimNFTOwnerForm;
