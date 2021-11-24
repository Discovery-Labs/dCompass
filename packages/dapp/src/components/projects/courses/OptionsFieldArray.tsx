import { Button, HStack, IconButton, Input, VStack } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";
import { FiX } from "react-icons/fi";

const OptionsFieldArray = ({ nestIndex, control, register }: any) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `quests[${nestIndex}].options`,
  });

  return (
    <VStack w="full" align="start" spacing="2">
      {fields.map((item, k) => {
        return (
          <HStack w="full" key={item.id}>
            <Input
              {...register(`quests[${nestIndex}].options[${k}].value`, {
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

      <Button mt="2" type="button" onClick={() => append("")}>
        +
      </Button>
    </VStack>
  );
};

export default OptionsFieldArray;
