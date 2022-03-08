import { Alert, Input, Text, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Blockies from "react-blockies";
import { useWatch } from "react-hook-form";

import { lookupAddress, lookupEns } from "../../core/hooks/useResolveEnsName";

const AddressInput = ({ name, control, register, setValue }: any) => {
  const [isEdit, setIsEdit] = useState(true);
  const [ens, setEns] = useState<string>();
  const value = useWatch({
    control,
    name,
  });
  useEffect(() => {
    async function getEnsOrAddress() {
      const isAddress = ethers.utils.isAddress(value);
      if (isAddress) {
        const reportedEns = await lookupAddress(value);
        return setEns(reportedEns);
      }
      try {
        const reportedAddress = await lookupEns(value);
        if (reportedAddress) {
          setEns(value);
          return setValue(name, reportedAddress);
        }
      } catch (error) {
        return setEns("");
      }
    }

    getEnsOrAddress();
  }, [value, name, setValue]);

  return (
    <VStack w="full">
      {value && isEdit === false && (
        <Alert
          roundedTop="lg"
          roundedBottom="lg"
          w="full"
          status="info"
          colorScheme="primary"
          onClick={() => {
            setIsEdit(true);
          }}
        >
          <Blockies className="blockies" seed={value || ""} />
          <VStack pl="4" w="full" align="flex-start">
            <Text>{ens || ""}</Text>
            <Text fontSize="md">{value || ""}</Text>
          </VStack>
        </Alert>
      )}
      {isEdit === true && (
        <Input
          {...register(name)}
          defaultValue={value}
          onBlur={() => {
            if (value) {
              setIsEdit(false);
            }
          }}
        />
      )}
    </VStack>
  );
};
export default AddressInput;
