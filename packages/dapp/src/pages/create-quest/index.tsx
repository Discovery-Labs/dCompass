import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormProvider, useForm } from "react-hook-form";

import NotConnectedWrapper from "../../components/custom/NotConnectedWrapper";
import CenteredFrame from "../../components/layout/CenteredFrame";
import QuestsForm from "../../components/projects/quests/QuestForm";
import Card from "components/custom/Card";

function CreateQuestStepper() {
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
  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card h="full" w="2xl">
            <QuestsForm />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default CreateQuestStepper;
