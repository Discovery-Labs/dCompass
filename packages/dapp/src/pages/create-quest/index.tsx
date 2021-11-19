import { useWeb3React } from "@web3-react/core";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import NotConnectedCard from "../../components/custom/NotConnectedCard";
import CenteredFrame from "../../components/layout/CenteredFrame";
import QuestsForm from "../../components/projects/quests/QuestsForm";
import { Web3Context } from "../../contexts/Web3Provider";
import Card from "components/custom/Card";

function CreateProjectStepper() {
  const { self, contracts, provider } = useContext(Web3Context);
  const web3React = useWeb3React();

  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = web3React;

  console.log({
    contracts,
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  });

  const methods = useForm({
    defaultValues: {
      quests: [
        {
          question: "Genesis",
          options: ["0x0000000000000"],
        },
      ],
    },
  });

  return account && contracts ? (
    <FormProvider {...methods}>
      <CenteredFrame>
        <Card h="full" w="2xl">
          <QuestsForm />
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

export default CreateProjectStepper;
