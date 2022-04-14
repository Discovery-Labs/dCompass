import { Divider, VStack, useCheckboxGroup, Text } from "@chakra-ui/react";

import CheckboxCard from "./CheckboxCard";

const CheckboxButtons = ({ quiz, setQuestionAnswer }: any) => {
  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue: [],
    onChange: (nextValue: string[]) => {
      console.log("answers", nextValue);
      setQuestionAnswer((currentState: any) => {
        if (
          currentState &&
          currentState
            .map((qa: any) => qa.question)
            .some((qa: any) => qa.includes(quiz.question))
        ) {
          return [
            ...currentState.filter((q: any) => q.question !== quiz.question),
            {
              question: quiz.question,
              answer: nextValue,
            },
          ];
        }
        return currentState
          ? [...currentState, { question: quiz.question, answer: nextValue }]
          : [{ question: quiz.question, answer: nextValue }];
      });
    },
  });

  return (
    <VStack py="6">
      <Text>{quiz.question}</Text>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {quiz.choices.map((choice: string) => {
          const checkbox = getCheckboxProps({ value: choice });
          return (
            <CheckboxCard key={choice} {...checkbox}>
              {choice}
            </CheckboxCard>
          );
        })}
      </div>
      <Divider orientation="horizontal" />
    </VStack>
  );
};

export default CheckboxButtons;
