import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

function GithubContributorQuestForm({ githubOrgId, questId }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    setIsLoading(true);
    console.log({ questId, githubOrgId });
    // TODO: call ceramic & back-end here
    setIsLoading(false);
  };
  return (
    <VStack>
      <Text>Display github org details here {githubOrgId}</Text>
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

export default GithubContributorQuestForm;
