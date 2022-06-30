import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

function DiscordMemberForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <FormControl isInvalid={!!errors.discordGuildId}>
      <FormLabel htmlFor="discordGuildId">Discord Guild ID</FormLabel>
      <Input
        placeholder="562828676480237578"
        {...register("discordGuildId", {
          required: "This is required",
          maxLength: {
            value: 150,
            message: "Maximum length should be 150",
          },
        })}
      />
      <FormErrorMessage>
        {errors.discordGuildId && errors.discordGuildId.message}
      </FormErrorMessage>
    </FormControl>
  );
}

export default DiscordMemberForm;
