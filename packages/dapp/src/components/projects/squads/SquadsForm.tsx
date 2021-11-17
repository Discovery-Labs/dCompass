import { Heading, Button } from "@chakra-ui/react";
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

function FieldArrayForm() {
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
      <Heading>Create squads &amp; add members</Heading>
      <Squads
        {...{
          control,
          register,
          defaultValues: squadsDefaultValues,
          getValues,
          setValue,
          errors,
        }}
      />

      <Button
        colorScheme="pink"
        type="button"
        onClick={() => reset(squadsDefaultValues)}
      >
        Reset Squads Form
      </Button>
    </>
  );
}

export default FieldArrayForm;
