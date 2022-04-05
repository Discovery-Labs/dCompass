import { useMutation } from "@apollo/client";
import { Stack, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import EditProjectForm from "components/projects/EditProjectForm";
import SquadsForm from "components/projects/squads/SquadsForm";
import { Web3Context } from "contexts/Web3Provider";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { initializeApollo } from "../../../../../lib/apolloClient";
import {
  EDIT_PROJECT_MUTATION,
  PROJECT_BY_ID_QUERY,
} from "../../../../graphql/projects";
import CreateProjectWallet from "components/custom/CreateProjectWallet";

type Props = {
  projectId: string | null;
  locale: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { projectId: string; locale: string }
> = async (ctx) => {
  const locale = ctx.locale || "en";
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
      props: {
        id,
        ...data.getProjectById,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

type Project = {
  [x: string]: any;
  id?: string;
  isFeatured?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  tokenUris?: string[];
};

function EditProjectStepper(project: Project) {
  const { t } = useTranslation("common");
  const { self } = useContext(Web3Context);
  const { account, library } = useWeb3React();

  const [editProjectMutation] = useMutation(EDIT_PROJECT_MUTATION, {
    refetchQueries: "all",
  });

  const {
    id,
    // isFeatured,
    // createdAt,
    // createdBy,
    // updatedAt,
    // updatedBy,
    // tokenUris,
    ...initialValues
  } = project;
  const methods = useForm({
    defaultValues: {
      ...initialValues,
      squads: initialValues.squads.map((squad: Record<string, any>) => ({
        ...squad,
        members: squad.members.map((member: string) => ({ value: member })),
      })),
    } as Record<string, any>,
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

    const currentProjectDoc = await self.client.ceramic.loadStream(id);

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
      squads: values.squads.map((squad: any) => {
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

    const signature = await library.provider.send("personal_sign", [
      JSON.stringify({
        id,
      }),
      account,
    ]);

    await currentProjectDoc.update(serializedProject);
    const allProjects = await editProjectMutation({
      variables: {
        input: {
          id,
          ...serializedProject,
          editorSignature: signature.result,
        },
      },
    });
    console.log({ allProjects });
  }

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card h="full" w="2xl">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              {id && <CreateProjectWallet id={id} />}

              <EditProjectForm />
              <SquadsForm />
              <Button isLoading={methods.formState.isSubmitting} type="submit">
                {t("submit")}
              </Button>
            </Stack>
          </Card>
        </CenteredFrame>
      </FormProvider>
    </NotConnectedWrapper>
  );
}

export default EditProjectStepper;
