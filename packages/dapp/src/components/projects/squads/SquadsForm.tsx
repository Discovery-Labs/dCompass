import { useFormContext } from "react-hook-form";

import Squads from "./Squads";

const squadsDefaultValues = {
  squads: [
    {
      name: "Genesis",
      members: ["0x0000000000000"],
      image: null,
    },
  ],
};

function SquadsForm() {
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Squads
        {...{
          control,
          register,
          defaultValues: squadsDefaultValues,
          getValues,
          setValue,
          reset,
          errors,
        }}
      />
    </>
  );
}

export default SquadsForm;
