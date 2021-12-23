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
  } = useFormContext();
  return (
    <FormControl isInvalid={errors.nftCollectionContractAddress}>
      <FormLabel htmlFor="nftCollectionContractAddress">
        Collection Contract Address
      </FormLabel>
      <Input
        placeholder="Collection Contract Address"
        {...register("nftCollectionContractAddress", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.nftCollectionAContractddress &&
          errors.nftCollectionAddresContracts.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default NFTOwnerForm;
