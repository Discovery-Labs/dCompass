import { ApolloError, useMutation } from "@apollo/client";
import {
  Button,
  Container,
  Flex,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useTranslation } from "next-i18next";
// import { useWeb3React } from "@web3-react/core";
import { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Web3Context } from "../../../../contexts/Web3Context";
import { usePageMarkdownTheme } from "../../../../core/hooks/useMarkdownTheme";
import {
  GET_ALL_QUESTS_BY_PATHWAY_ID_QUERY,
  GET_QUIZ_QUEST_BY_ID_QUERY,
  SUBMIT_QUEST_ANSWERS_MUTATION,
} from "../../../../graphql/quests";
import Card from "../../../custom/Card";
import CheckboxButtons from "../../../custom/quiz/CheckboxButtons";

function QuizForm({
  questions,
  questId,
  pathwayId,
  successCallback,
  overview,
}: any) {
  const toast = useToast();
  const questMarkdownTheme = usePageMarkdownTheme();
  const { t } = useTranslation("common");
  const { self } = useContext(Web3Context);
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  // const { chainId, library } = useWeb3React();

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

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: call ceramic & back-end here
    let isValid = false;
    try {
      const { data } = await submitQuestAnswersMutation({
        variables: {
          input: {
            questId,
            did: self.id,
            questionAnswers,
          },
        },
      });
      isValid =
        data.submitQuestAnswers.expandedServerSignatures &&
        data.submitQuestAnswers.isSuccess;
      setIsLoading(false);
      if (isValid) {
        // const questStreamId = data.submitQuestAnswers.streamId;
        // const [, tokenAddressOrSymbol] =
        //   data.submitQuestAnswers.rewardCurrency.split(":");
        // const isNativeToken = tokenAddressOrSymbol ? false : true;
        toast({
          title: "Well done!",
          description: `You did submit the correct answers!`,
          status: "success",
          position: "bottom-right",
          duration: 3000,
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
        duration: 3000,
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
        duration: 3000,
        isClosable: true,
        variant: "subtle",
      });
      return setIsLoading(false);
    }
  };
  return (
    <VStack w="full" flex="1" justify="space-between">
      <Steps
        w="full"
        orientation="horizontal"
        responsive={false}
        colorScheme="purple"
        activeStep={activeStep}
      >
        <Step key={0} label="Overview">
          <VStack w="full" align="flex-start">
            <ReactMarkdown
              components={ChakraUIRenderer(questMarkdownTheme)}
              skipHtml
            >
              {overview}
            </ReactMarkdown>
          </VStack>
        </Step>
        {questions.map(({ id, question, content, ...rest }) => (
          <Step key={id}>
            <Container w="full" my={{ base: 4, md: 8 }}>
              <Card h="fit-content" my="2">
                <Text>{content}</Text>
              </Card>

              <CheckboxButtons
                key={question.question}
                quiz={{ id, question, content, ...rest }}
                setQuestionAnswer={setQuestionAnswer}
              />
            </Container>
          </Step>
        ))}
      </Steps>
      <Flex w="full" justify="center">
        {activeStep > 0 && activeStep <= 2 && (
          <Button
            variant="outline"
            onClick={() => prevStep()}
            px="1.25rem"
            fontSize="md"
          >
            {t("prev")}
          </Button>
        )}
        {activeStep === 0 && (
          <Button
            ml="0.5rem"
            onClick={() => nextStep()}
            px="1.25rem"
            fontSize="md"
          >
            {"Let's play"}
          </Button>
        )}
        {activeStep !== 0 && activeStep < questions.length && (
          <Button
            ml="0.5rem"
            onClick={() => nextStep()}
            px="1.25rem"
            fontSize="md"
          >
            {t("next")}
          </Button>
        )}
        {activeStep === questions.length && (
          <Button
            ml="0.5rem"
            type="submit"
            px="1.25rem"
            fontSize="md"
            isLoading={isLoading}
            loadingText="Submitting answers..."
            onClick={handleSubmit}
          >
            {t("submit")}
          </Button>
        )}
      </Flex>
      {/* {questions.map((question: any, i: number) => (
        <Container key={i} my={{ base: 4, md: 8 }} maxW="container.lg">
          <ProgressBar progress={i} max={questions.length} hasStripe={true} />
          <CheckboxButtons
            key={question.question}
            quiz={question}
            setQuestionAnswer={setQuestionAnswer}
          />
        </Container>
      ))} */}
    </VStack>
  );
}

export default QuizForm;
