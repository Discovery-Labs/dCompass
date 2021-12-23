import { useMutation } from "@apollo/client";
import { Flex, Button, Stack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { GetServerSideProps } from "next";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { initializeApollo } from "../../../../../lib/apolloClient";
import {
  EDIT_PROJECT_MUTATION,
  PROJECT_BY_ID_QUERY,
} from "../../../../graphql/projects";
import Card from "components/custom/Card";
import NotConnectedCard from "components/custom/NotConnectedCard";
import CenteredFrame from "components/layout/CenteredFrame";
import EditProjectForm from "components/projects/EditProjectForm";
import SquadsForm from "components/projects/squads/SquadsForm";
import { Web3Context } from "contexts/Web3Provider";

type Props = {
  projectId: string | null;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string }
> = async (ctx) => {
  const id = ctx.params?.projectId ?? null;
  if (id === null) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: PROJECT_BY_ID_QUERY,
      variables: {
        projectId: `ceramic://${id}`,
      },
    });
    return {
      props: { id, ...data.getProjectById },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

const EditProject = <EditProjectForm />;
const EditSquads = <SquadsForm />;

const steps = [
  {
    label: "Step 1",
    content: EditProject,
  },
  { label: "Step 2", content: EditSquads },
];

function EditProjectStepper(project) {
  const { self, contracts, provider } = useContext(Web3Context);
  const { account } = useWeb3React();

  const [editProjectMutation] = useMutation(EDIT_PROJECT_MUTATION, {
    refetchQueries: "all",
  });

  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const {
    isFeatured,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    tokenUris,
    ...initialValues
  } = project;
  const methods = useForm({
    defaultValues: {
      ...initialValues,
      squads: initialValues.squads.map((squad: Record<string, any>) => ({
        ...squad,
        members: squad.members.map((member: string) => ({ value: member })),
      })),
    },
  });

  async function onSubmit() {
    const values = methods.getValues();
    console.log({ values });

    const formData = new FormData();
    if (values.logo) {
      formData.append("logo", values.logo[0]);
    }
    values.squads.forEach((squad: Record<string, any>) => {
      if (squad.image) {
        formData.append(squad.name, squad.image[0]);
      }
    });

    const currentProjectDoc = await self.client.ceramic.loadStream(project.id);

    let serializedProject = {
      ...values,
    };

    let cids = {} as Record<string, string>;

    if (formData.keys.length > 0) {
      const cidsRes = await fetch("/api/image-storage", {
        method: "POST",
        body: formData,
      });
      cids = await cidsRes.json();
    }

    serializedProject = {
      ...serializedProject,
      logo: cids.logo ?? serializedProject.logo,
      squads: values.squads.map((squad) => {
        const members = squad.members.map(
          (member: Record<string, any>) => member.value ?? member
        ) as string[];
        return {
          ...squad,
          image: cids[squad.name] ?? squad.image,
          members,
        };
      }),
    };

    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify({
        id: project.id,
      }),
      account,
    ]);

    await currentProjectDoc.update(serializedProject);
    const allProjects = await editProjectMutation({
      variables: {
        input: {
          id: project.id,
          ...serializedProject,
          editorSignature: signature.result,
        },
      },
    });
    console.log({ allProjects });
  }

  return account && contracts ? (
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
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotConnectedCard />
      </Card>
    </CenteredFrame>
  );
}

export default EditProjectStepper;
