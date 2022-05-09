import { useFormContext } from "react-hook-form";

import Questions from "./Questions";

const questionsDefaultValues = {
  questions: [
    {
      question: "",
      options: [""],
      answer: "",
    },
  ],
};

function QuestionsForm() {
  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Questions
      {...{
        control,
        register,
        defaultValues: questionsDefaultValues,
        getValues,
        setValue,
        errors,
      }}
    />
  );
}

export default QuestionsForm;
