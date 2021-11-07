import { Input } from "@chakra-ui/react";
import React from "react";
import { Controller } from "react-hook-form";

const ControllerPlus = ({ control, name }: { name: string; control: any }) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <Input
        {...field}
        borderColor="purple.500"
        color="purple.500"
        placeholder="Enter Address"
      />
    )}
  />
);

export default ControllerPlus;
