import { ApolloError, useMutation } from "@apollo/client";
import { Button, useToast, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Web3Context } from "../../../../contexts/Web3Context";
import { SUBMIT_QUEST_ANSWERS_MUTATION } from "../../../../graphql/quests";

import CheckboxButtons from "../../../custom/quiz/CheckboxButtons";

function QuizForm({ questions, questId, successCallback }: any) {
  const toast = useToast();
  const { self } = useContext(Web3Context);
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
      const submitQuestAnswers = await submitQuestAnswersMutation({
        variables: {
          input: {
            questId,
            did: self.id,
            questionAnswers,
          },
        },
      });
      isValid = submitQuestAnswers.data.submitQuestAnswers;
      isValid
        ? toast({
            title: "Well done!",
            description: `You did submit the correct answers!`,
            status: "success",
            position: "top-right",
            duration: 6000,
            isClosable: true,
            variant: "subtle",
          })
        : toast({
            title: "Incorrect answers",
            description: `You didn't submit the correct answers!`,
            status: "error",
            position: "top-right",
            duration: 6000,
            isClosable: true,
            variant: "subtle",
          });
      setIsLoading(false);
      return isValid ? successCallback() : isValid;
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
