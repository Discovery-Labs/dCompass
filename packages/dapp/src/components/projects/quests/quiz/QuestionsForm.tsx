import { useFormContext } from "react-hook-form";
import { Questions } from "../../../../core/types";

import QuizQuestionsForm from "./Questions";

const questionsDefaultValues = {
  questions: [
    {
      content: "",
      question: "",
      options: [{ label: "", value: "" }],
      answer: "",
    },
  ],
};

function QuestionsForm({ questions }: { questions?: Questions }) {
  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <QuizQuestionsForm
      {...{
        control,
        register,
        defaultValues: {
          questions: questions ? questions : questionsDefaultValues.questions,
        },
        getValues,
        setValue,
        errors,
      }}
    />
  );
}

export default QuestionsForm;
