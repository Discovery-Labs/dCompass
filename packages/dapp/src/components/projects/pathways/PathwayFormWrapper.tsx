import { useMutation } from "@apollo/client";
import { Heading, Button, Flex } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { Web3Context } from "../../../contexts/Web3Provider";
import { CREATE_PATHWAY_MUTATION } from "../../../graphql/pathways";

import PathwayForm from "./PathwayForm";

const pathwaysDefaultValues = {
  title: null,
};

function PathwayFormWrapper() {
  const router = useRouter();
  const { library } = useWeb3React();
  const [addPathwayMutation] = useMutation(CREATE_PATHWAY_MUTATION, {
    refetchQueries: "all",
  });
  const { self, account } = useContext(Web3Context);
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  async function onSubmit(values: Record<string, any>) {
    const { prerequisites, ...pathwayOptions } = values;
    const prereqs = prerequisites
      ? {
          prerequisites: prerequisites.map(
            (prereq: { value: string; label: string }) => prereq.value
          ),
        }
      : {};

    const serlializedValues = {
      ...pathwayOptions,
      difficulty: values.difficulty.value,
      rewardCurrency: values.rewardCurrency.value,
      rewardAmount: parseFloat(values.rewardAmount),
      rewardUserCap: parseInt(values.rewardUserCap, 10),
      ...prereqs,
      createdBy: account,
      createdAt: new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(serlializedValues));

    if (values.image) {
      formData.append(values.title, values.image[0]);
    }
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();
    const finalValues = {
      ...serlializedValues,
      image: cids[values.title],
      projectId: `ceramic://${router.query.projectId}`,
    };

    console.log("submitted", finalValues);
    const pathwayDoc = await self.client.dataModel.createTile(
      "Pathway",
      { ...finalValues, createdAt: new Date().toISOString() },
      {
        pin: true,
      }
    );
    console.log(pathwayDoc);

    const signature = await library.provider.send("personal_sign", [
      JSON.stringify({
        id: `ceramic://${router.query.projectId}`,
      }),
      account,
    ]);

    const addedPathway = await addPathwayMutation({
      variables: {
        input: {
          id: pathwayDoc.id.toUrl(),
          pathwayCreatorSignature: signature.result,
        },
      },
    });
    console.log({ addedPathway });
    return router.push(`/projects/${router.query.projectId}/`);
  }

  return (
    <>
      <Heading>Add Pathway</Heading>
      <PathwayForm />

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

export default PathwayFormWrapper;
