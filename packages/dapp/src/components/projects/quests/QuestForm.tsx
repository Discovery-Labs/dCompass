import { useMutation } from "@apollo/client";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";

import { Web3Context } from "../../../contexts/Web3Provider";
import useTokenList from "../../../core/hooks/useTokenList";
import {
  CREATE_QUIZ_QUEST_MUTATION,
  CREATE_SNAPSHOT_VOTER_QUEST_MUTATION,
} from "../../../graphql/quests";
import ImageDropzone from "../../custom/ImageDropzone";
import ControlledSelect from "../../Inputs/ControlledSelect";

import DiscordMemberForm from "./discord/DiscordMemberForm";
import PoapOwnerForm from "./poap/PoapOwnerForm";
import QuestionsForm from "./quizz/QuestionsForm";
import SnapshotForm from "./snapshot/SnapshotForm";
import NFTOwnerForm from "./token/NFTOwnerForm copy";
import TokenHolderForm from "./token/TokenHolderForm";
import TwitterFollowerForm from "./twitter/TwitterFollowerForm";

type QuestionFormItemType = {
  question: string;
  options: { value: string }[];
  answer: string;
};
const questTypeOptions = [
  {
    label: "Snapshot voter",
    value: "snapshot-voter",
  },
  {
    label: "Twitter follower",
    value: "twitter-follower",
  },
  {
    label: "Discord member",
    value: "discord-member",
  },
  {
    label: "Token holder",
    value: "token-holder",
  },
  {
    label: "POAP owner",
    value: "poap-owner",
  },
  {
    label: "NFT owner",
    value: "nft-owner",
  },
  {
    label: "Quiz",
    value: "quiz",
  },
];

const CreateQuestForm: React.FunctionComponent = () => {
  const { tokens, defaultMainnetDAIToken } = useTokenList();
  const { self, provider, account } = useContext(Web3Context);
  const [createSnapshotVoterQuest] = useMutation(
    CREATE_SNAPSHOT_VOTER_QUEST_MUTATION,
    { refetchQueries: "all" }
  );
  const [createQuizQuestMutation] = useMutation(CREATE_QUIZ_QUEST_MUTATION, {
    refetchQueries: "all",
  });
  // const [createQuestMutation] = useMutation(CREATE_QUEST_MUTATION);
  // const [createQuestMutation] = useMutation(CREATE_QUEST_MUTATION);
  // const [createQuestMutation] = useMutation(CREATE_QUEST_MUTATION);
  // const [createQuestMutation] = useMutation(CREATE_QUEST_MUTATION);
  // const [createQuestMutation] = useMutation(CREATE_QUEST_MUTATION);

  const router = useRouter();
  const {
    control,
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const currentValues = watch();
  const questDetails = {
    "snapshot-voter": <SnapshotForm />,
    "twitter-follower": <TwitterFollowerForm />,
    "poap-owner": <PoapOwnerForm />,
    "token-holder": <TokenHolderForm />,
    "nft-owner": <NFTOwnerForm />,
    "discord-member": <DiscordMemberForm />,
    quiz: <QuestionsForm />,
    defaultOption: "",
  };
  const questType = (currentValues?.type?.value ||
    "defaultOption") as keyof typeof questDetails;

  function goBack() {
    router.back();
  }
  async function onSubmit(values: Record<string, any>) {
    console.log("submitted", values);

    const formData = new FormData();
    if (values.image) {
      formData.append(values.name, values.image[0]);
    }
    const cidsRes = await fetch("/api/image-storage", {
      method: "POST",
      body: formData,
    });

    const { cids } = await cidsRes.json();
    const finalValues =
      questType === "quiz"
        ? {
          ...values,
          questions: values.questions.map(
            ({ question, options, answer }: QuestionFormItemType) => ({
              question,
              choices: options.map((option) => option.value),
              answer,
            })
          ),
          image: cids[values.name],
          pathwayId: `ceramic://${router.query.pathwayId}`,
        }
        : {
          ...values,
          image: cids[values.name],
          pathwayId: `ceramic://${router.query.pathwayId}`,
        };

    const questDoc = await self.client.dataModel.createTile(
      "Quest",
      finalValues,
      {
        pin: true,
      }
    );

    const signature = await provider.provider.send("personal_sign", [
      JSON.stringify({
        id: questDoc.id.toUrl(),
        pathwayId: `ceramic://${router.query.pathwayId}`,
      }),
      account,
    ]);

    let result;
    if (questType === "snapshot-voter") {
      const { data } = await createSnapshotVoterQuest({
        variables: {
          input: {
            id: questDoc.id.toUrl(),
            questCreatorSignature: signature.result,
          },
        },
      });
      result = data.createSnapshotVoterQuest;
    }

    if (questType === "quiz") {
      const { data } = await createQuizQuestMutation({
        variables: {
          input: {
            id: questDoc.id.toUrl(),
            questCreatorSignature: signature.result,
          },
        },
      });
      result = data.createQuizQuest;
    }
    console.log({ result });

    return goBack();
  }

  return (
    <Stack w="full" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading>Create quest</Heading>

      <ImageDropzone
        {...{
          register,
          setValue,
          errors,
          fieldName: "image",
          label: "Quest NFT Image reward",
          isRequired: true,
        }}
      />

      <HStack w="full" alignItems="center">
        <FormControl isInvalid={errors.rewardAmount}>
          <FormLabel htmlFor="rewardAmount">Quest reward amount</FormLabel>
          <NumberInput step={1_000} defaultValue={1_000}>
            <NumberInputField
              placeholder=""
              {...register("rewardAmount", {
                required: "This is required",
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            {errors.rewardAmount && errors.rewardAmount.message}
          </FormErrorMessage>
        </FormControl>

        <ControlledSelect
          control={control}
          name="rewardCurrency"
          label="Reward currency"
          rules={{
            required: "This is required",
          }}
          defaultValue={{
            label: `${defaultMainnetDAIToken.symbol} - ${defaultMainnetDAIToken.name}`,
            value: `${defaultMainnetDAIToken.chainId}:${defaultMainnetDAIToken.address}`,
          }}
          options={tokens.map((token) => ({
            label: `${token.symbol} - ${token.name}`,
            value: `${token.chainId}:${token.address}`,
          }))}
        />
      </HStack>

      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">Quest name</FormLabel>
        <Input
          placeholder="Quest name"
          {...register("name", {
            required: "This is required",
            maxLength: {
              value: 150,
              message: "Maximum length should be 150",
            },
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.description}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          placeholder="Quest description"
          {...register("description", {
            required: "This is required",
            maxLength: {
              value: 1200,
              message: "Maximum length should be 1200",
            },
          })}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>

      <ControlledSelect
        control={control}
        name="type"
        id="type"
        label="Type"
        rules={{
          required: "This is required",
        }}
        options={questTypeOptions}
      />
      {questDetails[questType]}
      <Divider bg="none" py="5" />
      <Flex w="full" justify="space-between">
        <Button colorScheme="secondary" type="button" onClick={() => reset()}>
          Reset Quest Form
        </Button>
        <Button type="submit">Submit</Button>
      </Flex>
    </Stack>
  );
};

export default CreateQuestForm;
