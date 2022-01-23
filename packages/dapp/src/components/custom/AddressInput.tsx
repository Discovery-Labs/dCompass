import { Alert, Input, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import { useWatch } from "react-hook-form";

import { lookupAddress } from "../../core/hooks/useResolveEnsName";

const AddressInput = ({ name, control, register }: any) => {
  const [ens, setEns] = useState<string>();
  const value = useWatch({
    control,
    name,
  });
  useEffect(() => {
    async function getEns() {
      const reportedEns = await lookupAddress(value);
      return setEns(reportedEns);
    }

    getEns();
  }, [value]);

  return (
    <VStack w="full">
      {value && (
        <Alert
          roundedTop="lg"
          roundedBottom="lg"
          w="full"
          status="info"
          colorScheme="primary"
        >
          <Blockies className="blockies" seed={value || ""} />
          <VStack pl="4" w="full" align="flex-start">
            <Text>{ens || ""}</Text>
            <Text fontSize="md">{value || ""}</Text>
          </VStack>
        </Alert>
      )}
      <Input {...register(name)} defaultValue={value} />
    </VStack>
  );
};
export default AddressInput;
