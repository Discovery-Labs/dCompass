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
  GET_BOUNTY_QUEST_BY_ID_QUERY,
  SUBMIT_QUEST_SOLUTION_MUTATION,
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
  const { self } = useContext(Web3Context);

  const [code, setCode] = useState<string>();
  const { codeEditorScheme } = useCustomColor();

  const [isLoading, setIsLoading] = useState(false);

  const { data, loading, error } = useQuery(GET_APP_DID);
  const [submitQuestSolutionMutation] = useMutation(
    SUBMIT_QUEST_SOLUTION_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_BOUNTY_QUEST_BY_ID_QUERY,
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
    const files = values.medias;
    const markdownBlob = new Blob([values.solution], {
      type: "text/markdown",
    });
    const markdownDataUrl = await blobToDataURL(markdownBlob);
    const attachments = [] as string[];
    for await (const file of files as FileList) {
      const dataUrl = await blobToDataURL(
        new Blob([file], {
          type: file.type,
        })
      );
      attachments.push(dataUrl);
    }

    const solutionDag = await self.client.ceramic.did.createDagJWE(
      {
        solution: markdownDataUrl,
        medias: attachments,
      },
      [
        // logged-in user,
        self.id,
        // backend ceramic did
        data.getAppDID,
      ]
    );

    const decrypted = await self.client.ceramic.did.decryptDagJWE(solutionDag);
    console.log({ decrypted });
    try {
      const { data } = await submitQuestSolutionMutation({
        variables: {
          input: {
            questId,
            did: self.id,
            solution: JSON.stringify(solutionDag),
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
        title: "Can't submit solution!",
        description: `You already submitted a solution or you didn't sign your solution submission`,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
        variant: "subtle",
      });
    }
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
