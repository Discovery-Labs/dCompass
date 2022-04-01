import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import PathwayFormWrapper from "components/projects/pathways/PathwayFormWrapper";
import useCustomColor from "core/hooks/useCustomColor";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";

function AddPathwayStepper() {
  const { getPrimaryColor, getTextColor } = useCustomColor();
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Link
            textStyle={"small"}
            color={getTextColor}
            _hover={{ color: getPrimaryColor, textDecoration: "none" }}
            onClick={() => router.back()}
          >
            <ChevronLeftIcon w={6} h={6} />
            Back to Project
          </Link>
          <Card h="full" w="2xl">
            <PathwayFormWrapper />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default AddPathwayStepper;
