import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useController } from "react-hook-form";

const ControlledSelect = ({
  control,
  name,
  id,
  label,
  rules,
  ...props
}: any) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
  });

  console.log({ value });

  return (
    <FormControl id={id} isInvalid={invalid}>
      <FormLabel>{label}</FormLabel>

      <Select
        selectedOptionStyle="check"
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />

      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default ControlledSelect;
