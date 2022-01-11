import { Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import Quests from "./Quests";

const questsDefaultValues = {
  quests: [
    {
      name: "Genesis",
      options: ["0x0000000000000"],
      answer: "Omega",
    },
  ],
};

function QuestsForm() {
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  async function onSubmit() {
    console.log("submitted");
  }

  return (
    <>
      <Heading>Create Quest</Heading>
      <Text>for Project-Name</Text>
      <Quests
        {...{
          control,
          register,
          defaultValues: questsDefaultValues,
          getValues,
          setValue,
          errors,
        }}
      />

      <Flex w="full" justify="space-between">
        <Button
          colorScheme="secondary"
          type="button"
          onClick={() => reset(questsDefaultValues)}
        >
          Reset Quest Form
        </Button>
        <Button type="button" onClick={() => onSubmit()}>
          Submit
        </Button>
      </Flex>
    </>
  );
}

export default QuestsForm;
