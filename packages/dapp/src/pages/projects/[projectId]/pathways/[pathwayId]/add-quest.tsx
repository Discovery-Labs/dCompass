import { FormProvider, useForm } from "react-hook-form";

import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import CreateQuestForm from "components/projects/quests/QuestForm";
import { Link, Box } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import useCustomColor from "core/hooks/useCustomColor";
import { useRouter } from "next/router";

export const questDefaultValues = {
  name: "",
  description: "",
  type: {
    value: "quiz",
    label: "Quiz",
  },
};

function AddQuestForm() {
  const { getPrimaryColor } = useCustomColor();
  const router = useRouter();
  const methods = useForm({
    defaultValues: questDefaultValues,
  });

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Box w="full" py="1">
            <Link
              textStyle={"small"}
              color="text"
              _hover={{ color: getPrimaryColor, textDecoration: "none" }}
              onClick={() => router.back()}
            >
              <ChevronLeftIcon w={6} h={6} />
              Back to pathway
            </Link>
          </Box>
          <Card layerStyle="solid-card" h="full" w="full">
            <CreateQuestForm />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default AddQuestForm;
