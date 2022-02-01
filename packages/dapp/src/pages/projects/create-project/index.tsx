import { useMutation } from "@apollo/client";
import { Button, Flex, Stack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ThreeTierPricing from "../../../components/custom/Pricing";
import CenteredFrame from "../../../components/layout/CenteredFrame";
import CreateProjectForm from "../../../components/projects/CreateProjectForm";
import SquadsForm from "../../../components/projects/squads/SquadsForm";
import { Web3Context } from "../../../contexts/Web3Provider";
import { schemaAliases } from "../../../core/ceramic";
import { CREATE_PROJECT_MUTATION } from "../../../graphql/projects";
import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";

const { PROJECTS_ALIAS } = schemaAliases;
const CreateProject = <CreateProjectForm />;
const CreateSquads = <SquadsForm />;
const Pricing = <ThreeTierPricing />;

const steps = [
  {
    label: "Step 1",
    content: CreateProject,
  },
  { label: "Step 2", content: CreateSquads },
  { label: "Step 3", content: Pricing },
];

function CreateProjectStepper() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { self } = useContext(Web3Context);
  const { account, library } = useWeb3React();

  const [createProjectMutation] = useMutation(CREATE_PROJECT_MUTATION, {
    refetchQueries: "all",
  });
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
      tags: [] as {
        value: string;
        label: string;
      }[],
      website: null,
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

    const serializedProject = {
      ...values,
      logo: cids.logo,
      website: `https://${values.website}`,
      createdBy: account,
      tags: values.tags.map((tag) => ({ id: `ceramic://${tag.value}` })),
      squads: values.squads.map((squad) => {
        const members = squad.members.map(
          (member: any) => member.value
        ) as string[];
        return {
          ...squad,
          image: cids[squad.name],
          members,
        };
      }),
    };

    const newProjectDoc = await self.client.dataModel.createTile(
      "Project",
      { ...serializedProject, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );

    const projectId = newProjectDoc.id.toUrl();
    formData.append(
      "metadata",
      JSON.stringify({
        projectId,
        ...newProjectDoc.content,
      })
    );

    const nftCidRes = await fetch("/api/squad-nft-storage", {
      method: "POST",
      body: formData,
    });

    const { metadataCids } = await nftCidRes.json();

    // Get user's existing projects
    const existingProjects = await self.client.dataStore.get(PROJECTS_ALIAS);

    // Index his new project
    if (existingProjects && existingProjects.projects.length > 0) {
      await self.client.dataStore.set(PROJECTS_ALIAS, {
        projects: [...existingProjects.projects, projectId],
      });
    } else {
      await self.client.dataStore.set(PROJECTS_ALIAS, {
        projects: [projectId],
      });
    }
    const signature = await library.provider.send("personal_sign", [
      JSON.stringify({
        id: projectId,
        tokenUris: metadataCids,
      }),
      account,
    ]);
    const allProjects = await createProjectMutation({
      variables: {
        input: {
          id: projectId,
          tokenUris: metadataCids,
          creatorSignature: signature.result,
        },
      },
    });
    console.log({ allProjects });
    return router.push("/");
  }

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card h="full" w={activeStep === 2 ? "fit-content" : "2xl"}>
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <Steps
                w="full"
                orientation="horizontal"
                colorScheme="purple"
                activeStep={activeStep}
              >
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
                    {t("prev")}
                  </Button>
                )}
                {activeStep < 2 && (
                  <Button
                    ml="0.5rem"
                    onClick={() => nextStep()}
                    px="1.25rem"
                    fontSize="md"
                  >
                    {t("next")}
                  </Button>
                )}
                {activeStep === 2 && (
                  <Button
                    ml="0.5rem"
                    // colorScheme="accentDark"
                    isLoading={methods.formState.isSubmitting}
                    type="submit"
                    px="1.25rem"
                    fontSize="md"
                  >
                    {t("submit")}
                  </Button>
                )}
              </Flex>
            </Stack>
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

export default CreateProjectStepper;
