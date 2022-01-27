import { FormProvider, useForm } from "react-hook-form";

import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import CreateQuestForm from "components/projects/quests/QuestForm";

export const questDefaultValues = {
  name: "",
  description: "",
};

function AddQuestForm() {
  const methods = useForm({
    defaultValues: questDefaultValues,
  });

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card h="full" w="2xl">
            <CreateQuestForm />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default AddQuestForm;
