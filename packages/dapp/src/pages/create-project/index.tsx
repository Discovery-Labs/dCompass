import { Flex, Box, Button } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";

import CreateProjectFirst from "../../components/CreateProjectFirst";
import CreateProjectSecond from "../../components/CreateProjectSecond";
import CreateProjectThird from "../../components/CreateProjectThird";
import CenteredFrame from "../../components/layout/CenteredFrame";
import Card from "components/custom/Card";

const CreateProject1 = <CreateProjectFirst />;
const CreateProject2 = <CreateProjectSecond />;
const CreateProject3 = <CreateProjectThird />;

const steps = [
  { label: "Step 1", content: CreateProject1 },
  { label: "Step 2", content: CreateProject2 },
  { label: "Step 3", content: CreateProject3 },
];

function CreateProjectStepper() {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <>
      <CenteredFrame>
        <Card h="full" w="2xl">
          <Steps colorScheme="purple" activeStep={activeStep}>
            {steps.map(({ label, content }) => (
              <Step label={label} key={label}>
                {content}
              </Step>
            ))}
          </Steps>
          <Flex w="full" justify="center">
            {activeStep > 0 && activeStep <= 2 && (
              <Button
                variant="outline"
                onClick={() => prevStep()}
                px="1.25rem"
                fontSize="md"
              >
                Prev
              </Button>
            )}
            {activeStep < 2 && (
              <Button
                ml="0.5rem"
                onClick={() => nextStep()}
                px="1.25rem"
                fontSize="md"
              >
                Next
              </Button>
            )}
            {activeStep === 2 && (
              <Button
                ml="0.5rem"
                onClick={() => nextStep()}
                px="1.25rem"
                fontSize="md"
              >
                Submit
              </Button>
            )}
          </Flex>
        </Card>
      </CenteredFrame>
    </>
  );
}

export default CreateProjectStepper;
