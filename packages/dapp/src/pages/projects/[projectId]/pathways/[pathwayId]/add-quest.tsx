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
};

function AddQuestForm() {
  const { getPrimaryColor, getTextColor } = useCustomColor();
  const router = useRouter();
  const methods = useForm({
    defaultValues: questDefaultValues,
  });

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Box py="1">
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
          <Card h="full" w="2xl">
            <CreateQuestForm />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default AddQuestForm;
