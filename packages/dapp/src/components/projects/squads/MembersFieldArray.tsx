import { AddIcon } from "@chakra-ui/icons";
import {
  Center,
  Divider,
  FormLabel,
  HStack,
  IconButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import { FiX } from "react-icons/fi";

const MembersFieldArray = ({ nestIndex, control, register }: any) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `squads[${nestIndex}].members`,
  });

  return (
    <VStack w="full" align="start" spacing="2">
      <HStack w="full" justify="space-between">
        <FormLabel htmlFor={`squads[${nestIndex}].members`}>
          Squad members
        </FormLabel>

        <IconButton
          size="sm"
          aria-label="Add member"
          onClick={() => append("")}
          icon={<AddIcon />}
        />
      </HStack>
      {fields.map((item, k) => {
        return (
          <HStack w="full" key={item.id}>
            <Input
              {...register(`squads[${nestIndex}].members[${k}].value`, {
                required: true,
              })}
            />
            <IconButton
              _hover={{ cursor: "pointer" }}
              variant="unstyled"
              color="secondary.300"
              size="xs"
              aria-label="remove"
              as={FiX}
              onClick={() => remove(k)}
            />
          </HStack>
        );
      })}

      <Center w="full" height="50px">
        <Divider />
      </Center>
    </VStack>
  );
};

export default MembersFieldArray;
