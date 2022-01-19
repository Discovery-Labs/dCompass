import { useWeb3React } from "@web3-react/core";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Card from "components/custom/Card";
import NotConnectedCard from "components/custom/NotConnectedCard";
import CenteredFrame from "components/layout/CenteredFrame";
import CreateQuestForm from "components/projects/quests/QuestForm";
import { Web3Context } from "contexts/Web3Provider";

export const questDefaultValues = {
  name: "",
  description: "",
};

function AddQuestForm() {
  const { contracts } = useContext(Web3Context);
  const { account } = useWeb3React();

  const methods = useForm({
    defaultValues: questDefaultValues,
  });

  return account && contracts ? (
    <FormProvider {...methods}>
      <CenteredFrame>
        <Card h="full" w="2xl">
          <CreateQuestForm />
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

export default AddQuestForm;
