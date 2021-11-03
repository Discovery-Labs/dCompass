import { Input } from "@chakra-ui/react";
import React from "react";
import { Controller } from "react-hook-form";

const ControllerPlus = ({
  control,
  transform,
  name,
}: {
  name: string;
  transform: any;
  control: any;
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <Input
        borderColor="purple.500"
        color="purple.500"
        placeholder="Enter Address"
        onChange={(e) => field.onChange(transform.output(e))}
        value={transform.input(field.value)}
      />
    )}
  />
);

export default ControllerPlus;
