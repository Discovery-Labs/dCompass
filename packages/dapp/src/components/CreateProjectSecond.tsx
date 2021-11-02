import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Divider,
  Button,
  Input,
  InputRightElement,
  InputGroup,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import React, { useState, useEffect } from "react";

function AddMembersCard() {
  const [members, setMembers] = useState(["0xad"]);

  return (
    <>
      <Heading>Create project</Heading>
      <VStack w="full">
        <Flex w="full" d="colum">
          <Text color="white">Genesis Team</Text>
          {members.map((member, i) => (
            <>
              <HStack py="2">
                <Input w="full" placeholder="Enter Address" value={member} />
                <IconButton
                  variant="unstyled"
                  color="pink.300"
                  size="xs"
                  as={FiX}
                />
              </HStack>
            </>
          ))}
        </Flex>
        <Button
          w="100%"
          variant="outline"
          onClick={() => setMembers([...members, "0xad"])}
        >
          + Add member
        </Button>
      </VStack>

      <VStack w="full">
        <Flex w="full" d="colum">
          <Text color="white">Custom Developer Team</Text>
          {members.map((member, i) => (
            <>
              <HStack py="2">
                <Input w="full" placeholder="Enter Address" value={member} />
                <IconButton
                  variant="unstyled"
                  color="pink.300"
                  size="xs"
                  as={FiX}
                />
              </HStack>
            </>
          ))}
        </Flex>
        <Button
          w="100%"
          variant="outline"
          onClick={() => setMembers([...members, "0xad"])}
        >
          + Add member
        </Button>
      </VStack>

      <Divider />
    </>
  );
}

export default AddMembersCard;
