import { ApolloError, useMutation } from "@apollo/client";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, useToast, VStack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import ImageDropzone from "components/custom/ImageDropzone";
import { REQUIRED_FIELD_LABEL } from "core/constants";
import useCustomColor from "core/hooks/useCustomColor";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Web3Context } from "../../../../contexts/Web3Context";
import {
  GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
  GET_QUIZ_QUEST_BY_ID_QUERY,
  SUBMIT_QUEST_ANSWERS_MUTATION,
} from "../../../../graphql/quests";

const CodeEditor = dynamic(() => import("@uiw/react-textarea-code-editor"), {
  ssr: false,
});

function BountyForm({ questId, pathwayId, successCallback }: any) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { self, account } = useContext(Web3Context);
  const { chainId, library } = useWeb3React();
  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();

  const [questionAnswers, setQuestionAnswer] =
    useState<Array<Record<string, string[]>>>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitQuestAnswersMutation] = useMutation(
    SUBMIT_QUEST_ANSWERS_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_QUIZ_QUEST_BY_ID_QUERY,
          variables: {
            questId,
          },
        },
        {
          query: GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
          variables: {
            pathwayId,
          },
        },
      ],
    }
  );

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    // TODO: call ceramic & back-end here
    let isValid = false;
    try {
      const signatureInput = {
        id: questId,
        pathwayId,
      };
      const signature = await library.provider.send("personal_sign", [
        JSON.stringify(signatureInput),
        account,
      ]);
      const { data } = await submitQuestAnswersMutation({
        variables: {
          input: {
            questId,
            did: self.id,
            questionAnswers,
            questAdventurerSignature: signature.result,
            chainId,
          },
        },
      });
      isValid =
        data.submitQuestAnswers.expandedServerSignatures &&
        data.submitQuestAnswers.isSuccess;
      setIsLoading(false);
      if (isValid) {
        const questStreamId = data.submitQuestAnswers.streamId;
        const [, tokenAddressOrSymbol] =
          data.submitQuestAnswers.rewardCurrency.split(":");
        const isNativeToken = tokenAddressOrSymbol ? false : true;
        toast({
          title: "Well done!",
          description: `You did submit the correct answers!`,
          status: "success",
          position: "bottom-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
        // const [metadataVerify] =
        //   data.submitQuestAnswers.expandedServerSignatures;
        // await contracts.BadgeNFT.claimBadgeRewards(
        //   questStreamId,
        //   isNativeToken,
        //   isNativeToken ? account : tokenAddressOrSymbol,
        //   metadataVerify.r,
        //   metadataVerify.s,
        //   metadataVerify.v,
        //   true
        // );
        return successCallback();
      }
      return toast({
        title: "Incorrect answers",
        description: `You didn't submit the correct answers!`,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
    } catch (error) {
      isValid = false;
      toast({
        title: "Error!",
        description: (error as ApolloError).message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
      return setIsLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl isInvalid={errors.solution}>
        <FormLabel htmlFor="solution">Your Solution</FormLabel>
        <CodeEditor
          value={code}
          language="markdown"
          placeholder="Quest solution (markdown)"
          {...register("solution", {
            required: REQUIRED_FIELD_LABEL,
          })}
          onChange={(e) => {
            const { name } = e.target;
            setCode(e.target.value);
            setValue(name, e.target.value);
          }}
          style={{
            fontSize: "16px",
          }}
          className={codeEditorScheme}
          padding={15}
        />
        <FormErrorMessage>
          {errors.solution && errors.solution.message}
        </FormErrorMessage>
      </FormControl>

      <ImageDropzone
        {...{
          register,
          setValue,
          errors,
          isMultiple: true,
          fieldName: "medias",
          label: "Quest solution files"
        }}
      />

      {code && <CodeEditorPreview code={code} />}
      <Button
        isLoading={isLoading}
        loadingText="Submitting answers..."
        onClick={() => handleSubmit(onSubmit)}
      >
        Submit result
      </Button>
    </VStack>
  );
}

export default BountyForm;
