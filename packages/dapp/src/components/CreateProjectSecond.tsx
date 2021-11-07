import {
  Heading,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import { convertToKebabCase } from "../core/helpers";

import AddMembersCard from "./AddMembersCard";

const CreateProjectSecond = () => {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [currentSquadName, setCurrentSquadName] = useState("");

  const handleSquadName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSquadName(convertToKebabCase(e.target.value));
  };
  const handleAddSquad = () => {
    const values = getValues();
    setValue("squads", [...values.squads, currentSquadName]);
    setCurrentSquadName("");
  };
  const handleRemoveSquad = (oldSquad: string) => {
    const values = getValues();
    setValue(
      "squads",
      values.squads.filter((t: string) => t !== oldSquad)
    );
  };
  return (
    <>
      <Heading>Create squads &amp; add members</Heading>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          value={currentSquadName}
          type="text"
          placeholder="Enter new squad name"
          onChange={(e) => handleSquadName(e)}
        />
        <InputRightElement width="6rem">
          <Button p="4" size="md" onClick={handleAddSquad}>
            Add squad
          </Button>
        </InputRightElement>
      </InputGroup>
      {getValues().squads.map((squadType: string) => (
        <AddMembersCard
          memberType={squadType}
          removeSquad={() => handleRemoveSquad(squadType)}
        />
      ))}
    </>
  );
};

export default CreateProjectSecond;
