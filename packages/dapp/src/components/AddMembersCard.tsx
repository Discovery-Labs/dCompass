import {
  VStack,
  HStack,
  Divider,
  Button,
  InputGroup,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiX } from "react-icons/fi";

import { capitalize } from "../core/helpers";

import ControllerPlus from "./Inputs/ControllerPlus";

function AddMembersCard({
  memberType,
  removeSquad,
}: {
  memberType: string;
  removeSquad: any;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: memberType, // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  useEffect(() => {
    append("");
    return () => {
      remove();
    };
  }, [append, remove]);

  return (
    <>
      <VStack w="full">
        <Flex w="full" d="colum">
          <FormControl isInvalid={errors[memberType]}>
            <HStack>
              <FormLabel color="white" htmlFor={memberType}>
                {capitalize(memberType)} Squad
              </FormLabel>
              <IconButton
                variant="unstyled"
                color="pink.300"
                size="xs"
                aria-label="remove"
                as={FiX}
                onClick={removeSquad}
              />
            </HStack>
            {fields.map((field, index) => (
              <>
                <HStack py="2">
                  <InputGroup w="full">
                    <ControllerPlus
                      key={field.id} // important to include key with field's id
                      {...register(`squads.${index}.value`)}
                      control={control}
                    />
                  </InputGroup>
                  <IconButton
                    variant="unstyled"
                    color="pink.300"
                    size="xs"
                    aria-label="remove"
                    as={FiX}
                    onClick={() => remove(index)}
                  />
                </HStack>
              </>
            ))}
            <FormErrorMessage>
              {errors[memberType] && errors[memberType].message}
            </FormErrorMessage>
          </FormControl>
          <Button w="100%" mb="5" variant="outline" onClick={() => append("")}>
            + Add {memberType}
          </Button>
        </Flex>
      </VStack>
      <Divider />
    </>
  );
}

export default AddMembersCard;
