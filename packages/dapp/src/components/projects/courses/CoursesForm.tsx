import { Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import Courses from "./Courses";

const coursesDefaultValues = {
  courses: [
    {
      name: "Genesis",
      options: ["0x0000000000000"],
      answer: "Omega",
    },
  ],
};

function CoursesForm() {
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
      <Heading>Add Course</Heading>
      <Text>for Project-Name</Text>
      <Courses
        {...{
          control,
          register,
          defaultValues: coursesDefaultValues,
          getValues,
          setValue,
          errors,
        }}
      />

      <Flex w="full" justify="space-between">
        <Button
          colorScheme="pink"
          type="button"
          onClick={() => reset(coursesDefaultValues)}
        >
          Reset Course Form
        </Button>
        <Button colorScheme="aqua" type="button" onClick={() => onSubmit()}>
          Submit
        </Button>
      </Flex>
    </>
  );
}

export default CoursesForm;
