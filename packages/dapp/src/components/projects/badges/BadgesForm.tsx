import { useMutation } from "@apollo/client";
import { Heading, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { Web3Context } from "../../../contexts/Web3Provider";
import { CREATE_BADGE_MUTATION } from "../../../graphql/badges";

import Badges from "./Badges";

const badgesDefaultValues = {
  badges: [
    {
      title: null,
    },
  ],
};

function BadgesForm() {
  const router = useRouter();
  const [addBadgeMutation] = useMutation(CREATE_BADGE_MUTATION);
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
      badges: values.badges.map((badge: any) => {
        const { prerequisites, ...badgeOptions } = badge;
        const prereqs = prerequisites
          ? {
            prerequisites: prerequisites.map(
              (prereq: { value: string; label: string }) => prereq.value
            ),
          }
          : {};

        return {
          ...badgeOptions,
          difficulty: badge.difficulty.value,
          ...prereqs,
          createdBy: account,
          createdAt: new Date().toISOString(),
        };
      }),
    };

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(serlializedValues));

    serlializedValues.badges.forEach((badge: any) => {
      if (badge.image) {
        formData.append(badge.title, badge.image[0]);
      }
    });
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();
    const finalValues = {
      badges: serlializedValues.badges.map((badge: any) => ({
        ...badge,
        image: cids[badge.title],
        projectId: `ceramic://${router.query.projectId}`,
      })),
    };

    console.log("submitted", finalValues);
    const badgeDocs = await Promise.all(
      finalValues.badges.map(async (badge: any) => {
        return self.client.dataModel.createTile("Badge", badge, {
          pin: true,
        });
      })
    );
    console.log(badgeDocs);

    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify({
        id: `ceramic://${router.query.projectId}`,
      }),
      account,
    ]);

    const addedBadges = await Promise.all(
      badgeDocs.map((badgeDoc) =>
        addBadgeMutation({
          variables: {
            input: {
              id: badgeDoc.id.toUrl(),
              badgeCreatorSignature: signature.result,
            },
          },
        })
      )
    );
    return router.push(`/projects/${router.query.projectId}/`);
  }

  return (
    <>
      <Heading>Add Badge</Heading>
      <Badges
        {...{
          control,
          register,
          defaultValues: badgesDefaultValues,
          getValues,
          setValue,
          errors,
        }}
      />

      <Flex w="full" justify="space-between">
        <Button
          colorScheme="secondary"
          type="button"
          onClick={() => reset(badgesDefaultValues)}
        >
          Reset Badge Form
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

export default BadgesForm;
