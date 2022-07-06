import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function TwitterFollowerForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ twitterHandle: string }>();
  return (
    <FormControl isInvalid={!!errors.twitterHandle}>
      <FormLabel htmlFor="twitterHandle">Twitter handle to follow</FormLabel>
      <Input
        placeholder="@dCompass_"
        {...register("twitterHandle", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.twitterHandle && errors.twitterHandle.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default TwitterFollowerForm;
