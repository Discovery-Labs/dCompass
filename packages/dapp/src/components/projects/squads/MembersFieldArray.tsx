import {
  Box,
  Flex,
  HStack,
  VStack,
  IconButton,
  Button,
  Input,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { FiX } from "react-icons/fi";

export default ({ nestIndex, control, register }: any) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `squads[${nestIndex}].members`,
  });

  return (
    <Box>
      <VStack w="full">
        <Flex w="full" d="colum">
          {fields.map((item, k) => {
            return (
              <HStack key={item.id}>
                <Input
                  {...register(`squads[${nestIndex}].members[${k}].value`, {
                    required: true,
                  })}
                />
                <IconButton
                  variant="unstyled"
                  color="pink.300"
                  size="xs"
                  aria-label="remove"
                  as={FiX}
                  onClick={() => remove(k)}
                />
              </HStack>
            );
          })}

          <Button type="button" onClick={() => append("")}>
            +
          </Button>
          <Divider my="5" />
        </Flex>
      </VStack>
    </Box>
  );
};
