import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function GithubContributorForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ githubOrgId: string }>();
  return (
    <FormControl isInvalid={!!errors.githubOrgId}>
      <FormLabel htmlFor="githubOrgId">Github Organization</FormLabel>
      <Input
        placeholder="Github Org ID"
        {...register("githubOrgId", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.githubOrgId && errors.githubOrgId.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default GithubContributorForm;
