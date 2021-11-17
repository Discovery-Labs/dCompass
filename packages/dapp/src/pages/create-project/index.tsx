import { useMutation } from "@apollo/client";
import { Flex, Button, Stack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CenteredFrame from "../../components/layout/CenteredFrame";
import CreateProjectForm from "../../components/projects/CreateProjectForm";
import SquadsForm from "../../components/projects/squads/SquadsForm";
import { Web3Context } from "../../contexts/Web3Provider";
import { schemaAliases } from "../../core/ceramic";
import { CREATE_PROJECT_MUTATION } from "../../graphql/projects";
import Card from "components/custom/Card";

const { PROJECTS_ALIAS } = schemaAliases;
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
  const { self, contracts } = useContext(Web3Context);
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
  const [createProjectMutation] = useMutation(CREATE_PROJECT_MUTATION);
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

    let contributors = [] as string[];
    const serializedProject = {
      ...values,
      logo: cids.logo,
      squads: values.squads.map((squad) => {
        const members = squad.members.map(
          (member: any) => member.value
        ) as string[];
        contributors = members;
        return {
          ...squad,
          image: cids[squad.name],
          members,
        };
      }),
    };
    console.log({ contributors, serializedProject });

    const newProjectDoc = await self.client.dataModel.createTile(
      "Project",
      serializedProject
    );

    // Get user's existing projects
    const existingProjects = await self.client.dataStore.get(PROJECTS_ALIAS);

    // Index his new project
    if (existingProjects && existingProjects.projects.length > 0) {
      await self.client.dataStore.set(PROJECTS_ALIAS, {
        projects: [...existingProjects.projects, newProjectDoc.id.toUrl()],
      });
    } else {
      await self.client.dataStore.set(PROJECTS_ALIAS, {
        projects: [newProjectDoc.id.toUrl()],
      });
    }

    const voteForApprovalTx =
      await contracts.projectNFTContract.voteForApproval(
        contributors,
        10,
        newProjectDoc.id.toUrl()
      );

    // get return values or events
    const receipt = await voteForApprovalTx.wait(2);
    console.log({ receipt });

    const allProjects = await createProjectMutation({
      variables: {
        input: {
          id: newProjectDoc.id.toUrl(),
        },
      },
    });

    console.log({ allProjects });
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
