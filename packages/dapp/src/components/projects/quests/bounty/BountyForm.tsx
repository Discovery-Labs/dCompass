import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Progress,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import ImageDropzone from "components/custom/ImageDropzone";
import { REQUIRED_FIELD_LABEL } from "core/constants";
import { blobToDataURL } from "core/helpers";
import useCustomColor from "core/hooks/useCustomColor";
import { GET_APP_DID } from "graphql/app";
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

  const [isLoading, setIsLoading] = useState(false);

  const { data, loading, error } = useQuery(GET_APP_DID);
  const [submitQuestSolutionMutation] = useMutation(
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
    if (!self?.client?.ceramic?.did) {
      return toast({
        title: "Not connected with Self.ID",
        description: `Try to refresh the page or disconnect & connect`,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
    }
    console.log({ values });
    const files = values.medias;
    console.log({ files });

    const markdownBlob = new Blob([values.solution], {
      type: "text/markdown",
    });
    const markdownDataUrl = await blobToDataURL(markdownBlob);
    console.log({ markdownDataUrl });
    // const mdFile = new File([mardownBlob], "solution.md");
    // formData.append("solution.md", mdFile);
    const attachments = [] as Array<string | ArrayBuffer | null>;
    for (const file of files) {
      // Encode the file using the FileReader API
      const reader = new FileReader();
      reader.onloadend = () => {
        attachments.push(reader.result);
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
      };
      reader.readAsDataURL(file);

      // formData.append(file.name, file); // appending every file to formdata
    }

    const submission = {
      solution: markdownDataUrl,
      medias: attachments,
    };
    console.log({ submission });
    const solutionDag = await self.client.ceramic.did.createDagJWE(submission, [
      // logged-in user,
      self.id,
      // backend ceramic did
      data.getAppDID,
    ]);

    // const nftCidRes = await fetch("/api/media-storage/", {
    //   method: "POST",
    //   body: formData,
    // });
    // const { rootCid } = await nftCidRes.json();

    // console.log({ rootCid });
    // setIsLoading(true);
    // // TODO: upload files under root dir through Web3.storage
    // let isValid = false;
    try {
      const signatureInput = {
        id: questId,
        pathwayId,
        solution: JSON.stringify(solutionDag),
      };

      const signature = await library.provider.send("personal_sign", [
        JSON.stringify(signatureInput),
        account,
      ]);

      const { data } = await submitQuestSolutionMutation({
        variables: {
          input: {
            questId,
            did: self.id,
            solution: JSON.stringify(solutionDag),
            questAdventurerSignature: signature.result,
            chainId,
          },
        },
      });
      if (data.submitQuestSolution) {
        toast({
          title: "Solution submitted!",
          description: `Thanks for your submission, your solution will be reviewed soon!`,
          status: "success",
          position: "bottom-right",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
        setIsLoading(false);
        return successCallback();
      }
      setIsLoading(false);
      return toast({
        title: "Something went wrong!",
        description: `There was an issue with your solution submission..`,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
    } catch (error) {
      console.log(error);
      return toast({
        title: "Signature rejected",
        description: `You didn't sign your solution submission`,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
    }
    // try {
    //   const signatureInput = {
    //     id: questId,
    //     pathwayId,
    //   };
    //   const signature = await library.provider.send("personal_sign", [
    //     JSON.stringify(signatureInput),
    //     account,
    //   ]);
    //   const { data } = await submitQuestAnswersMutation({
    //     variables: {
    //       input: {
    //         questId,
    //         did: self.id,
    //         questionAnswers,
    //         questAdventurerSignature: signature.result,
    //         chainId,
    //       },
    //     },
    //   });
    //   isValid =
    //     data.submitQuestAnswers.expandedServerSignatures &&
    //     data.submitQuestAnswers.isSuccess;
    //   setIsLoading(false);
    //   if (isValid) {
    //     const questStreamId = data.submitQuestAnswers.streamId;
    //     const [, tokenAddressOrSymbol] =
    //       data.submitQuestAnswers.rewardCurrency.split(":");
    //     const isNativeToken = tokenAddressOrSymbol ? false : true;
    //     toast({
    //       title: "Well done!",
    //       description: `You did submit the correct answers!`,
    //       status: "success",
    //       position: "bottom-right",
    //       duration: 6000,
    //       isClosable: true,
    //       variant: "subtle",
    //     });
    //     // const [metadataVerify] =
    //     //   data.submitQuestAnswers.expandedServerSignatures;
    //     // await contracts.BadgeNFT.claimBadgeRewards(
    //     //   questStreamId,
    //     //   isNativeToken,
    //     //   isNativeToken ? account : tokenAddressOrSymbol,
    //     //   metadataVerify.r,
    //     //   metadataVerify.s,
    //     //   metadataVerify.v,
    //     //   true
    //     // );
    //     return successCallback();
    //   }
    //   return toast({
    //     title: "Incorrect answers",
    //     description: `You didn't submit the correct answers!`,
    //     status: "error",
    //     position: "bottom-right",
    //     duration: 6000,
    //     isClosable: true,
    //     variant: "subtle",
    //   });
    // } catch (error) {
    //   isValid = false;
    //   toast({
    //     title: "Error!",
    //     description: (error as ApolloError).message,
    //     status: "error",
    //     position: "bottom-right",
    //     duration: 6000,
    //     isClosable: true,
    //     variant: "subtle",
    //   });
    //   return setIsLoading(false);
    // }
  };
  if (loading) {
    <Stack>
      <Progress size="xs" isIndeterminate />
      <Text>Loading...</Text>
    </Stack>;
  }

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Network error</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  return (
    <VStack as="form">
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
          label: "Quest solution attachment",
        }}
      />

      {code && <CodeEditorPreview code={code} />}
      <Button
        isLoading={isLoading}
        loadingText="Submitting answers..."
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        Submit result
      </Button>
    </VStack>
  );
}

export default BountyForm;
