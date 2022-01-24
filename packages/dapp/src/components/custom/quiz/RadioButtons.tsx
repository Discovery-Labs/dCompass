import {
  Divider,
  VStack,
  useRadioGroup,
  useToast,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

import RadioCard from "./RadioCard";

const RadioButtons = ({ quiz, setQuestionAnswer }: any) => {
  const toast = useToast();
  const [chosen, setChosen] = useState("");
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "option",
    defaultValue: "default",
    onChange: (nextValue: string) => {
      setChosen(nextValue);
      setQuestionAnswer((currentState: any) => {
        return currentState
          ? [...currentState, { question: quiz.question, answer: nextValue }]
          : [{ question: quiz.question, answer: nextValue }];
      });
      console.log(nextValue);
    },
  });
  const group = getRootProps();

  function verifyResult() {
    if (chosen === quiz.answer) {
      console.log("Correct");
      toast({
        title: `Correct!`,
        status: "success",
        isClosable: true,
      });
    } else {
      console.log("Incorrect");
    }
  }

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
