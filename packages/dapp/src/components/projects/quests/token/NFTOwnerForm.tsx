import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function NFTOwnerForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{
    collectionContractAddress: string;
  }>();
  return (
    <FormControl isInvalid={!!errors.collectionContractAddress}>
      <FormLabel htmlFor="collectionContractAddress">
        Collection Contract Address
      </FormLabel>
      <Input
        placeholder="Collection Contract Address"
        {...register("collectionContractAddress", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.collectionContractAddress &&
          errors.collectionContractAddress.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default NFTOwnerForm;
