import { useMutation } from "@apollo/client";
import { Stack, Button, Heading } from "@chakra-ui/react";

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
import { Tag } from "../../../../core/types";

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

function EditProjectSquads(project: Project) {
  const { t } = useTranslation("common");

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
    let squadImagesToUpload = 0;
    if (values.logo) {
      formData.append("logo", values.logo[0]);
    }
    values.squads.forEach((squad: Record<string, any>) => {
      if (squad.image) {
        squadImagesToUpload++;
        console.log("sqImage", squad.image);
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

    console.log(formData.values.length);
    if (squadImagesToUpload > 0) {
      console.log("form data");
      const cidsRes = await fetch("/api/image-storage", {
        method: "POST",
        body: formData,
      });
      const newCids = await cidsRes.json();
      cids = newCids.cids;
    }
    console.log(cids);

    serializedProject = {
      ...serializedProject,
      logo: cids.logo ?? serializedProject.logo,
      tags: values.tags.map((tag: any) => tag.value),
      squads: values.squads.map((squad: any) => {
        const members = squad.members.map(
          (member: Record<string, any>) => member.value ?? member
        ) as string[];
        const squadImage = cids[squad.name] ?? squad.image;
        return {
          ...squad,
          image: squadImage,
          members,
        };
      }),
    };

    const allProjects = await editProjectMutation({
      variables: {
        input: {
          id,
          ...serializedProject,
        },
      },
    });
    console.log({ allProjects });
  }

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card layerStyle="solid-card" h="full" w="full">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <Heading>Manage squads</Heading>
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

export default EditProjectSquads;
