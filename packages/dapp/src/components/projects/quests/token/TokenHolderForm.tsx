import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function TokenHolderForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormControl isInvalid={errors.tokenContractAddress}>
      <FormLabel htmlFor="tokenContractAddress">
        Token Contract Address
      </FormLabel>
      <Input
        placeholder="Token Contract Address"
        {...register("tokenContractAddress", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.tokenContractAddress && errors.tokenContractAddress.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default TokenHolderForm;
