import { useMutation } from "@apollo/client";
import { Heading, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { Web3Context } from "../../../contexts/Web3Provider";
import { CREATE_PATHWAY_MUTATION } from "../../../graphql/pathways";

import Pathways from "./Pathways";

const pathwaysDefaultValues = {
  pathways: [
    {
      title: null,
    },
  ],
};

function PathwaysForm() {
  const router = useRouter();
  const [addPathwayMutation] = useMutation(CREATE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const { self, account, provider } = useContext(Web3Context);
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext();

  async function onSubmit(values: Record<string, any>) {
    const serlializedValues = {
      pathways: values.pathways.map((pathway: any) => {
        const { prerequisites, ...pathwayOptions } = pathway;
        const prereqs = prerequisites
          ? {
            prerequisites: prerequisites.map(
              (prereq: { value: string; label: string }) => prereq.value
            ),
          }
          : {};

        return {
          ...pathwayOptions,
          difficulty: pathway.difficulty.value,
          ...prereqs,
          createdBy: account,
          createdAt: new Date().toISOString(),
        };
      }),
    };

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(serlializedValues));

    serlializedValues.pathways.forEach((pathway: any) => {
      if (pathway.image) {
        formData.append(pathway.title, pathway.image[0]);
      }
    });
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();
    const finalValues = {
      pathways: serlializedValues.pathways.map((pathway: any) => ({
        ...pathway,
        image: cids[pathway.title],
        projectId: `ceramic://${router.query.projectId}`,
      })),
    };

    console.log("submitted", finalValues);
    const pathwayDocs = await Promise.all(
      finalValues.pathways.map(async (pathway: any) => {
        return self.client.dataModel.createTile("Pathway", pathway, {
          pin: true,
        });
      })
    );
    console.log(pathwayDocs);

    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify({
        id: `ceramic://${router.query.projectId}`,
      }),
      account,
    ]);

    const addedPathways = await Promise.all(
      pathwayDocs.map((pathwayDoc) =>
        addPathwayMutation({
          variables: {
            input: {
              id: pathwayDoc.id.toUrl(),
              pathwayCreatorSignature: signature.result,
            },
          },
        })
      )
    );
    return router.push(`/projects/${router.query.projectId}/`);
  }

  return (
    <>
      <Heading>Add Pathway</Heading>
      <Pathways
        {...{
          control,
          register,
          defaultValues: pathwaysDefaultValues,
          getValues,
          setValue,
          errors,
        }}
      />

      <Flex w="full" justify="space-between">
        <Button
          colorScheme="secondary"
          type="button"
          onClick={() => reset(pathwaysDefaultValues)}
        >
          Reset Pathway Form
        </Button>
        <Button
          isLoading={isSubmitting}
          colorScheme="accentDark"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
}

export default PathwaysForm;
