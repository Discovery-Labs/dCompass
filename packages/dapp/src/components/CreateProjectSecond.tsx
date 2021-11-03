import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Divider,
  Button,
  Icon,
  Input,
  InputGroup,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiX } from "react-icons/fi";

import ControllerPlus from "./Inputs/ControllerPlus";

function AddMembersCard() {
  const [members, setMembers] = useState(["0xad"]);
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "founders", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  const {
    fields: devFields,
    append: devAppend,
    remove: devRemove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "developers", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  useEffect(() => {
    devAppend("");
    append("");
    return () => {
      devRemove();
      remove();
    };
  }, [append, remove, devAppend, devRemove]);

  return (
    <>
      <Heading>Create project</Heading>
      <VStack w="full">
        <Flex w="full" d="colum">
          <FormControl isInvalid={errors.founders}>
            <FormLabel color="white" htmlFor="founders">
              Genesis Team
            </FormLabel>
            {fields.map((field, index) => (
              <>
                <HStack py="2">
                  <InputGroup w="full">
                    <ControllerPlus
                      key={field.id} // important to include key with field's id
                      {...register(`founders.${index}.value`)}
                      transform={{
                        input: (value: any) => {
                          console.log(value);
                          return value;
                        },
                        output: (e: any) => e.target.value,
                      }}
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
              {errors.founders && errors.founders.message}
            </FormErrorMessage>
          </FormControl>
          <Button w="100%" mb="5" variant="outline" onClick={() => append("")}>
            + Add genesis member
          </Button>
          <FormControl isInvalid={errors.founders}>
            <FormLabel color="white" htmlFor="developers">
              Developer Team
            </FormLabel>
            {devFields.map((field, index) => (
              <>
                <HStack py="2">
                  <InputGroup w="full">
                    <ControllerPlus
                      key={field.id} // important to include key with field's id
                      {...register(`developers.${index}.value`)}
                      transform={{
                        input: (value: any) => {
                          console.log(value);
                          return value;
                        },
                        output: (e: any) => e.target.value,
                      }}
                      control={control}
                    />
                  </InputGroup>
                  <IconButton
                    variant="unstyled"
                    color="pink.300"
                    size="xs"
                    aria-label="remove"
                    as={FiX}
                    onClick={() => devRemove(index)}
                  />
                </HStack>
              </>
            ))}
            <FormErrorMessage>
              {errors.developers && errors.developers.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            w="100%"
            mb="5"
            variant="outline"
            onClick={() => devAppend("")}
          >
            + Add developer member
          </Button>
        </Flex>
      </VStack>
      <Divider />
    </>
  );
}

export default AddMembersCard;
