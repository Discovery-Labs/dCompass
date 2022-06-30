import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function PoapOwnerForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    // TODO: to verify this we need to
    // STEP1: query the subgraph based on the network https://github.com/poap-xyz/poap-subgraph
    // STEP2: query the poap api, eg: https://api.poap.xyz/token/3099358
    <FormControl isInvalid={!!errors.poapTokenId}>
      <FormLabel htmlFor="poapTokenId">POAP Token ID</FormLabel>
      <Input
        placeholder="PAOP Token ID"
        {...register("poapTokenId", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.poapTokenId && errors.poapTokenId.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default PoapOwnerForm;
