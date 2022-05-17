import { useMutation, useQuery } from "@apollo/client";
import mime from "mime-types";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Tag,
  Stack,
  Text,
  Progress,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  useDisclosure,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Heading,
  HStack,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Web3Context } from "contexts/Web3Context";
import { dataURLtoBlob } from "core/helpers";
import useCustomColor from "core/hooks/useCustomColor";
import {
  APPROVE_QUEST_SOLUTION_MUTATION,
  GET_BOUNTY_QUEST_BY_ID_QUERY,
} from "graphql/quests";
import { useContext, useState } from "react";
import { BiDownload } from "react-icons/bi";
import { MdOutlineRateReview } from "react-icons/md";
import ReactMarkdown from "react-markdown";

type SolutionSubmission = {
  id: string;
  did: string;
  solution: string;
  reviewComment?: string;
  status: string;
};
function QuestSubmissionList({ questId }: { questId: string }) {
  const [solutionReview, setSolutionReview] =
    useState<SolutionSubmission | null>();
  const [markdownSolution, setMarkdownSolution] = useState<string | null>();
  const { self } = useContext(Web3Context);
  const { getBorderColor } = useCustomColor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [approveQuestSolutionMutation] = useMutation(
    APPROVE_QUEST_SOLUTION_MUTATION
  );
  const { data, loading, error } = useQuery(GET_BOUNTY_QUEST_BY_ID_QUERY, {
    variables: {
      input: {
        questId,
        did: self?.id,
      },
    },
  });

  const handleOpenReview = async (submission: SolutionSubmission) => {
    setSolutionReview(submission);
    const solutionBlob = dataURLtoBlob(
      JSON.parse(submission.solution).solution
    );

    const rawMarkdown = await solutionBlob.text();

    setMarkdownSolution(rawMarkdown);

    return onOpen();
  };

  const handleApproveSolution = async (solution: SolutionSubmission) => {
    // TODO: call mutation to change the status of the submission

    const res = await approveQuestSolutionMutation({
      variables: {
        input: {
          id: questId,
          adventurerDID: solution.did,
          solutionId: solution.id,
        },
      },
    });
    console.log({ res });
    setSolutionReview(null);
    return onClose();
  };

  const handleRejectSolution = (solution: SolutionSubmission) => {
    console.log({ solution });
    setSolutionReview(null);
    return onClose();
  };

  if (loading)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">Submissions loading</Text>
        <Progress size="xs" isIndeterminate />
      </Stack>
    );
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Network error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  return (
    <Box>
      <Modal onClose={onClose} isOpen={isOpen} size="full">
        <ModalOverlay />
        <ModalContent w="full">
          <ModalHeader>
            Review quest solution - {data.getBountyQuestById.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody w="full">
            {solutionReview && (
              <VStack w="full">
                <HStack w="full" justifyContent="space-between">
                  <Heading size="md">
                    Submitted by: {solutionReview.did}
                  </Heading>

                  <HStack>
                    <Button
                      colorScheme={"accent"}
                      onClick={() => handleApproveSolution(solutionReview)}
                      leftIcon={<CheckIcon />}
                    >
                      Approve solution
                    </Button>
                    <Button
                      onClick={() => handleRejectSolution(solutionReview)}
                      ml="5"
                      colorScheme="secondary"
                      leftIcon={<CloseIcon />}
                    >
                      Reject solution
                    </Button>
                  </HStack>
                </HStack>

                {JSON.parse(solutionReview.solution).solution && (
                  <Button leftIcon={<BiDownload />}>
                    <a
                      download={`questId_${questId}-did_${solutionReview.did}-solution.md`}
                      href={JSON.parse(solutionReview.solution).solution}
                    >
                      Download solution
                    </a>
                  </Button>
                )}

                {JSON.parse(solutionReview.solution)?.medias &&
                  JSON.parse(solutionReview.solution).medias.map(
                    (media: string, i: number) => {
                      const mimeTypeMatch = media.match(
                        /[^:]\w+\/[\w-+\d.]+(?=;|,)/
                      );
                      if (mimeTypeMatch) {
                        const extension = mime.extension(mimeTypeMatch[0]);
                        return (
                          <Button key={media} leftIcon={<BiDownload />}>
                            <a
                              download={`questId_${questId}-did_${solutionReview.did}-attachments_${i}.${extension}`}
                              href={media}
                            >
                              Download attachment {i + 1}
                            </a>
                          </Button>
                        );
                      }
                    }
                  )}

                <Box
                  bgColor="bg"
                  border={`1px solid ${getBorderColor}`}
                  borderRadius="4px"
                  padding="4"
                >
                  {markdownSolution && (
                    <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                      {markdownSolution}
                    </ReactMarkdown>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Table variant="simple">
        <TableCaption>
          Quest solutions submitted by the users above
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Solution status</Th>
            <Th>DID</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.getBountyQuestById?.submissions &&
            data.getBountyQuestById.submissions.map(
              ({
                id,
                did,
                status,
                reviewComment,
                solution,
              }: SolutionSubmission) => {
                return (
                  <Tr key={id}>
                    <Td>
                      <Tag
                        colorScheme={
                          status === "approved" ? "accent" : "orange"
                        }
                      >
                        {status === "approved" ? "Approved" : "Under review"}
                      </Tag>
                    </Td>
                    <Td>{did}</Td>
                    <Td>
                      <Button
                        onClick={() =>
                          handleOpenReview({
                            id,
                            did,
                            status,
                            solution,
                            reviewComment,
                          })
                        }
                        leftIcon={<MdOutlineRateReview />}
                      >
                        Review solution
                      </Button>
                    </Td>
                  </Tr>
                );
              }
            )}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Solution status</Th>
            <Th>DID</Th>
            <Th>Actions</Th>
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  );
}

export default QuestSubmissionList;
