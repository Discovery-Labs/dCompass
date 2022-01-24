import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import PathwayFormWrapper from "components/projects/pathways/PathwayFormWrapper";

function AddPathwayStepper() {
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
          <Card h="full" w="2xl">
            <PathwayFormWrapper />
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default AddPathwayStepper;
