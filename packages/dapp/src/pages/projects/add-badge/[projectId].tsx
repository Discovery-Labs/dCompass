import { useWeb3React } from "@web3-react/core";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import NotConnectedCard from "../../../components/custom/NotConnectedCard";
import CenteredFrame from "../../../components/layout/CenteredFrame";
import BadgesForm from "../../../components/projects/badges/BadgesForm";
import { Web3Context } from "../../../contexts/Web3Provider";
import Card from "components/custom/Card";

function AddBadgeStepper() {
  const { contracts } = useContext(Web3Context);
  const web3React = useWeb3React();

  const { account } = web3React;

  const methods = useForm({
    defaultValues: {
      badges: [
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
          <BadgesForm />
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

export default AddBadgeStepper;
