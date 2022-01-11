import { useWeb3React } from "@web3-react/core";
import PathwaysForm from "components/projects/pathways/PathwaysForm";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Card from "components/custom/Card";
import NotConnectedCard from "components/custom/NotConnectedCard";
import CenteredFrame from "components/layout/CenteredFrame";
import { Web3Context } from "contexts/Web3Provider";

function AddPathwayStepper() {
  const { contracts } = useContext(Web3Context);
  const web3React = useWeb3React();

  const { account } = web3React;

  const methods = useForm({
    defaultValues: {
      pathways: [
        {
          title: "",
          description: "",
        },
      ],
    },
  });

  return account && contracts ? (
    <FormProvider {...methods}>
      <CenteredFrame>
        <Card h="full" w="2xl">
          <PathwaysForm />
        </Card>
      </CenteredFrame>
    </FormProvider>
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotConnectedCard />
      </Card>
    </CenteredFrame>
  );
}

export default AddPathwayStepper;
