import { useMutation } from "@apollo/client";
import { Stack, Button, useToast } from "@chakra-ui/react";

import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { initializeApollo } from "../../../../../../lib/apolloClient";
import EditPathwayForm from "../../../../../components/projects/pathways/EditPathwayForm";
import { Pathway } from "../../../../../core/types";
import {
  EDIT_PATHWAY_MUTATION,
  GET_PATHWAY_BY_ID_QUERY,
} from "../../../../../graphql/pathways";

type Props = {
  pathwayId: string | null;
  locale: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { pathwayId: string; locale: string }
> = async (ctx) => {
  const locale = ctx.locale || "en";
  const id = ctx.params?.pathwayId ?? null;
  if (id === null) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_PATHWAY_BY_ID_QUERY,
      variables: {
        pathwayId: id,
      },
    });
    return {
      props: {
        id,
        ...data.getPathwayById,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

function EditPathway(pathway: Pathway) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const toast = useToast();

  const [editPathwayMutation] = useMutation(EDIT_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });

  const { id, slogan, description, title, image, ...initialValues } = pathway;
  console.log({ initialTags: initialValues });
  const methods = useForm({
    defaultValues: {
      slogan,
      description,
      title,
    } as Record<string, any>,
  });

  async function onSubmit() {
    const values = methods.getValues();
    console.log({ values });

    try {
      await editPathwayMutation({
        variables: {
          input: {
            id,
            ...values,
          },
        },
      });
      toast({
        title: "Pathway updated!",
        description: `Pathway informations updated successfully!`,
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
      });
      return router.push(`/projects/${pathway.projectId}/pathways/${id}`);
    } catch (error) {
      toast({
        title: "Error on pathway update!",
        description: `An error occured while updating the pathway!`,
        status: "error",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
      });
    }
  }

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Card layerStyle="solid-card" h="full" w="full">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <EditPathwayForm />
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

export default EditPathway;
