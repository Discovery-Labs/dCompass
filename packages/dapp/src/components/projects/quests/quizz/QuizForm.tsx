import { Button, VStack } from "@chakra-ui/react";
import { useState } from "react";

import RadioButtons from "../../../custom/quiz/RadioButtons";

function QuizForm({ questions, questId }: any) {
  const [questionAnswers, setQuestionAnswer] =
    useState<Array<Record<string, string>>>();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    setIsLoading(true);
    console.log({ quizValues: questionAnswers, questId });
    // TODO: call ceramic & back-end here
    setIsLoading(false);
  };
  return (
    <VStack>
      {questions.map((question: any) => (
        <RadioButtons
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
