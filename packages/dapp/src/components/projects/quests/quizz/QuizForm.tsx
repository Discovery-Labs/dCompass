import { ApolloError, useMutation } from "@apollo/client";
import { Button, useToast, VStack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useContext, useState } from "react";
import { Web3Context } from "../../../../contexts/Web3Context";
import { SUBMIT_QUEST_ANSWERS_MUTATION } from "../../../../graphql/quests";

import CheckboxButtons from "../../../custom/quiz/CheckboxButtons";

function QuizForm({ questions, questId, pathwayId, successCallback }: any) {
  const toast = useToast();
  const { self, contracts, account } = useContext(Web3Context);
  const { chainId, library } = useWeb3React();

  const [questionAnswers, setQuestionAnswer] =
    useState<Array<Record<string, string>>>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitQuestAnswersMutation] = useMutation(
    SUBMIT_QUEST_ANSWERS_MUTATION
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: call ceramic & back-end here
    let isValid = false;
    try {
      const signatureInput = {
        id: questId,
        pathwayId,
      };
      const signature = await library.provider.send("personal_sign", [
        JSON.stringify(signatureInput),
        account,
      ]);
      const { data } = await submitQuestAnswersMutation({
        variables: {
          input: {
            questId,
            did: self.id,
            questionAnswers,
            questAdventurerSignature: signature.result,
            chainId,
          },
        },
      });
      isValid =
        data.submitQuestAnswers.expandedServerSignatures &&
        data.submitQuestAnswers.isSuccess;
      setIsLoading(false);
      if (isValid) {
        const questStreamId = data.submitQuestAnswers.streamId;
        const [, tokenAddressOrSymbol] =
          data.submitQuestAnswers.rewardCurrency.split(":");
        const isNativeToken = tokenAddressOrSymbol ? false : true;
        toast({
          title: "Well done!",
          description: `You did submit the correct answers!`,
          status: "success",
          position: "top-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
        // const [metadataVerify] =
        //   data.submitQuestAnswers.expandedServerSignatures;
        // await contracts.BadgeNFT.claimBadgeRewards(
        //   questStreamId,
        //   isNativeToken,
        //   isNativeToken ? account : tokenAddressOrSymbol,
        //   metadataVerify.r,
        //   metadataVerify.s,
        //   metadataVerify.v,
        //   true
        // );
        return successCallback();
      }
      return toast({
        title: "Incorrect answers",
        description: `You didn't submit the correct answers!`,
        status: "error",
        position: "top-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
    } catch (error) {
      isValid = false;
      toast({
        title: "Error!",
        description: (error as ApolloError).message,
        status: "error",
        position: "top-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
      return setIsLoading(false);
    }
  };
  return (
    <VStack>
      {questions.map((question: any) => (
        <CheckboxButtons
          key={question.question}
          quiz={question}
          setQuestionAnswer={setQuestionAnswer}
        />
      ))}
      <Button
        isLoading={isLoading}
        loadingText="Submitting answers..."
        onClick={handleSubmit}
      >
        Submit answers
      </Button>
    </VStack>
  );
}

export default QuizForm;
