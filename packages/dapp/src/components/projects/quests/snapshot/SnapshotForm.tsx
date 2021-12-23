import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function SnapshotForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormControl isInvalid={errors.proposalId}>
      <FormLabel htmlFor="proposalId">Proposal ID</FormLabel>
      <Input
        placeholder="Proposal ID"
        {...register("proposalId", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.proposalId && errors.proposalId.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default SnapshotForm;
