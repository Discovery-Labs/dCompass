import { Divider, VStack, useRadioGroup, Text } from "@chakra-ui/react";

import RadioCard from "./RadioCard";

const RadioButtons = ({ quiz, setQuestionAnswer }: any) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "option",
    defaultValue: "default",
    onChange: (nextValue: string) => {
      setQuestionAnswer((currentState: any) => {
        return currentState
          ? [...currentState, { question: quiz.question, answer: nextValue }]
          : [{ question: quiz.question, answer: nextValue }];
      });
    },
  });
  const group = getRootProps();

  return (
    <VStack {...group} py="6">
      <Text>{quiz.question}</Text>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {quiz.choices.map((choice: string) => {
          const radio = getRadioProps({ value: choice });
          return (
            <RadioCard key={choice} {...radio}>
              {choice}
            </RadioCard>
          );
        })}
      </div>
      <Divider orientation="horizontal" />
    </VStack>
  );
};

export default RadioButtons;
