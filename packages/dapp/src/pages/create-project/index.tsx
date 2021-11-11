import { Flex, Button, Stack } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CenteredFrame from "../../components/layout/CenteredFrame";
import CreateProjectForm from "../../components/projects/CreateProjectForm";
import SquadsForm from "../../components/projects/squads/SquadsForm";
import { Web3Context } from "../../contexts/Web3Provider";
import Card from "components/custom/Card";

const CreateProject = <CreateProjectForm />;
const CreateSquads = <SquadsForm />;

const steps = [
  {
    label: "Step 1",
    content: CreateProject,
  },
  { label: "Step 2", content: CreateSquads },
];

function CreateProjectStepper() {
  const { self } = useContext(Web3Context);
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const methods = useForm({
    defaultValues: {
      logo: null,
      squads: [
        {
          name: "Genesis",
          members: ["0x0000000000000"],
          image: null,
        },
      ],
    },
  });

  async function onSubmit() {
    const values = methods.getValues();
    console.log({ values });
    const formData = new FormData();
    if (values.logo) {
      formData.append("logo", values.logo[0]);
    }
    values.squads.forEach((squad) => {
      if (squad.image) {
        formData.append(squad.name, squad.image[0]);
      }
    });
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });
    const { cids } = await cidsRes.json();
    // const ownProjects = await self.set("projects", [{ ...values }]);
    const ceramicRes = await fetch("/api/ceramic-storage", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        logo: cids.logo,
        squads: values.squads.map((squad) => {
          return {
            ...squad,
            image: cids[squad.name],
          };
        }),
      }),
    });

    const { projectStreamId } = await ceramicRes.json();
    console.log({ projectStreamId });
  }

  return (
    <FormProvider {...methods}>
      <CenteredFrame>
        <Card h="full" w="2xl">
          <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
            <Steps colorScheme="purple" activeStep={activeStep}>
              {steps.map(({ label, content }) => (
                <Step label={label} key={label}>
                  {content}
                </Step>
              ))}
            </Steps>
            <Flex w="full" justify="center">
              {activeStep > 0 && activeStep <= 1 && (
                <Button
                  variant="outline"
                  onClick={() => prevStep()}
                  px="1.25rem"
                  fontSize="md"
                >
                  Prev
                </Button>
              )}
              {activeStep < 1 && (
                <Button
                  ml="0.5rem"
                  onClick={() => nextStep()}
                  px="1.25rem"
                  fontSize="md"
                >
                  Next
                </Button>
              )}
              {activeStep === 1 && (
                <Button
                  ml="0.5rem"
                  colorScheme="aqua"
                  isLoading={methods.formState.isSubmitting}
                  type="submit"
                  onClick={() => onSubmit()}
                  px="1.25rem"
                  fontSize="md"
                >
                  Submit
                </Button>
              )}
            </Flex>
          </Stack>
        </Card>
      </CenteredFrame>
    </FormProvider>
  );
}

export default CreateProjectStepper;
