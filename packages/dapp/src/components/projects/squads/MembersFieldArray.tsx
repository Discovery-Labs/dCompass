import { AddIcon } from "@chakra-ui/icons";
import {
  FormLabel,
  Heading,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import { FiX } from "react-icons/fi";
import AddressInput from "../../custom/AddressInput";

const MembersFieldArray = ({ nestIndex, control, register, setValue }: any) => {
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
          <VStack align="start" w="full" key={item.id}>
            <Heading size="sm" as="h4">
              Member {k + 1}
            </Heading>
            <HStack w="full">
              <AddressInput
                register={register}
                control={control}
                name={`squads[${nestIndex}].members[${k}].value`}
                setValue={setValue}
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
          </VStack>
        );
      })}
    </VStack>
  );
};

export default MembersFieldArray;
