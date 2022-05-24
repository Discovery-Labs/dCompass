import { FormProvider, useForm } from "react-hook-form";

import Card from "components/custom/Card";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import CenteredFrame from "components/layout/CenteredFrame";
import {
  Link,
  Box,
  useToast,
  Stack,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Spinner,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import useCustomColor from "core/hooks/useCustomColor";
import { useRouter } from "next/router";
import EditQuestForm from "../../../../../../components/projects/quests/EditQuestForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { EDIT_PATHWAY_MUTATION } from "../../../../../../graphql/pathways";

import { GET_QUIZ_QUEST_BY_ID_QUERY } from "../../../../../../graphql/quests";
import { useEffect } from "react";

export const getServerSideProps = async (ctx) => {
  const locale = ctx.locale || "en";
  const id = ctx.params?.questId ?? null;
  if (id === null) {
    return {
      redirect: { destination: "/", permanent: true },
    };
  }
  try {
    return {
      props: {
        questId: id,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/404", permanent: true },
    };
  }
};

function EditQuest({ questId }: { questId: string }) {
  console.log({ questId });
  const { getPrimaryColor } = useCustomColor();
  const { t } = useTranslation("common");
  const router = useRouter();
  const toast = useToast();
  const editableFields = ["name", "slogan", "description"];

  const { data, loading, error } = useQuery(GET_QUIZ_QUEST_BY_ID_QUERY, {
    variables: {
      questId,
    },
  });

  const [editQuestMutation] = useMutation(EDIT_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });

  const methods = useForm({
    defaultValues: {
      slogan: data?.getQuizQuestById?.slogan,
      description: data?.getQuizQuestById?.description,
      name: data?.getQuizQuestById?.name,
      questions: data?.getQuizQuestById?.questions
        ? data.getQuizQuestById.questions.map((q) => ({
            options: q.choices.map((choice) => ({ value: choice })),
            answer: JSON.parse(q.answer),
            question: q.question,
          }))
        : undefined,
    } as Record<string, any>,
  });

  useEffect(() => {
    if (data?.getQuizQuestById?.id) {
      Object.entries(data.getQuizQuestById).map(([key, value]: any) => {
        if (key === "questions") {
          methods.setValue(
            key,
            value
              ? value.map((q) => ({
                  options: q.choices.map((choice) => ({ value: choice })),
                  answer: JSON.parse(q.answer).map((a) => ({
                    label: a,
                    value: a,
                    colorScheme: "purple",
                  })),
                  question: q.question,
                }))
              : undefined
          );
        }
        if (editableFields.includes(key)) {
          methods.setValue(key, value);
        }
      });
    }
  }, [data?.getQuizQuestById, methods, editableFields]);

  async function onSubmit() {
    const values = methods.getValues();

    try {
      await editQuestMutation({
        variables: {
          input: {
            id: questId,
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
      return router.back();
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

  if (loading || !data.getQuizQuestById) return <Spinner />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Network error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <NotConnectedWrapper>
      <FormProvider {...methods}>
        <CenteredFrame>
          <Box w="full" py="1">
            <Link
              textStyle={"small"}
              color="text"
              _hover={{ color: getPrimaryColor, textDecoration: "none" }}
              onClick={() => router.back()}
            >
              <ChevronLeftIcon w={6} h={6} />
              Back to quest
            </Link>
          </Box>
          <Card layerStyle="solid-card" h="full" w="full">
            <Stack w="full" as="form" onSubmit={methods.handleSubmit(onSubmit)}>
              {data?.getQuizQuestById && (
                <EditQuestForm quest={data?.getQuizQuestById} />
              )}
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

export default EditQuest;
