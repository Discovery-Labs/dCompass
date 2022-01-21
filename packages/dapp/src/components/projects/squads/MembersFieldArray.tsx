import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  Center,
  Divider,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import Blockies from "react-blockies";
import { useFieldArray } from "react-hook-form";
import { FiX } from "react-icons/fi";

import { lookupAddress } from "../../../core/hooks/useResolveEnsName";

const MembersFieldArray = ({ nestIndex, control, register, setValue }: any) => {
  const [membersEns, setMemberEns] = useState({});
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
            <VStack w="full">
              {Object.keys(membersEns).length &&
                membersEns[`${nestIndex}.${k}`]?.address > 0 ? (
                <Alert
                  roundedTop="lg"
                  roundedBottom="lg"
                  w="full"
                  status="info"
                  colorScheme="primary"
                >
                  <Blockies
                    className="blockies"
                    seed={membersEns[`${nestIndex}.${k}`]?.address || ""}
                  />
                  <VStack pl="4" w="full" align="flex-start">
                    <Text>{membersEns[`${nestIndex}.${k}`]?.ens || ""}</Text>
                    <Text fontSize="md">
                      {membersEns[`${nestIndex}.${k}`]?.address || ""}
                    </Text>
                  </VStack>
                </Alert>
              ) : (
                <Input
                  {...register(`squads[${nestIndex}].members[${k}].value`, {
                    required: true,
                  })}
                  onChange={async (e) => {
                    const memberEns = await lookupAddress(e.target.value);
                    console.log({ memberEns });
                    setMemberEns((currentMembers) => ({
                      ...currentMembers,
                      [`${nestIndex}.${k}`]: {
                        ens: memberEns,
                        address: e.target.value,
                      },
                    }));
                    setValue(
                      `squads[${nestIndex}].members[${k}].value`,
                      e.target.value
                    );
                  }}
                />
              )}
            </VStack>

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
