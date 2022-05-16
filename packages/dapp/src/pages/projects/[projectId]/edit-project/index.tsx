import { useMutation } from "@apollo/client";
import { Stack, Button, useToast } from "@chakra-ui/react";

import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import EditProjectForm from "components/projects/EditProjectForm";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FormProvider, useForm } from "react-hook-form";
import { initializeApollo } from "../../../../../lib/apolloClient";
import {
  EDIT_PROJECT_MUTATION,
  PROJECT_BY_ID_QUERY,
} from "../../../../graphql/projects";
import { useRouter } from "next/router";

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
        projectId: id,
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
  const router = useRouter();
  const toast = useToast();

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
  console.log({ initialTags: initialValues.tags });
  const methods = useForm({
    defaultValues: {
      ...initialValues,
      tags: initialValues.tags.map((tag: any) => ({
        value: tag.id,
        label: tag.label,
        colorScheme: tag.color,
      })),
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

    let {
      createdAt,
      createdBy,
      _nextI18Next,
      squads,
      isFeatured,
      streamId,
      ...serializedProject
    } = values;

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
      tags: values.tags.map((tag: any) => tag.value),
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

    await editProjectMutation({
      variables: {
        input: {
          id,
          ...serializedProject,
        },
      },
    });
    toast({
      title: "Project updated!",
      description: `Project informations updated successfully!`,
      status: "success",
      position: "bottom-right",
      duration: 6000,
      isClosable: true,
      variant: "subtle",
    });
    return router.push(`/projects/${id}`);
  }

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card layerStyle="solid-card" h="full" w="full">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <EditProjectForm />
              {/* <SquadsForm /> */}
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
