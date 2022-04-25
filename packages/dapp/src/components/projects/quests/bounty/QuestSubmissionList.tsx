import { useQuery } from "@apollo/client";
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
import CodeEditorPreview from "components/custom/CodeEditorPreview";
import AddGitHubAccountScreen from "components/custom/profile/AddGithubAccountScreen";
import { Web3Context } from "contexts/Web3Context";
import { GET_BOUNTY_QUEST_BY_ID_QUERY } from "graphql/quests";
import { useContext, useState } from "react";
import { MdOutlineRateReview } from "react-icons/md";

type SolutionSubmission = {
  did: string;
  solution: string;
  reviewComment?: string;
  status: string;
};
function QuestSubmissionList({
  questId,
  signature,
}: {
  questId: string;
  signature: string;
}) {
  const [solutionReview, setSolutionReview] =
    useState<SolutionSubmission | null>();
  const { self } = useContext(Web3Context);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, loading, error } = useQuery(GET_BOUNTY_QUEST_BY_ID_QUERY, {
    variables: {
      questId,
      signature,
      did: self.id,
    },
  });

  const handleOpenReview = (solution: SolutionSubmission) => {
    setSolutionReview(solution);
    return onOpen();
  };

  const handleApproveSolution = (solution: SolutionSubmission) => {
    setSolutionReview(null);
    return onClose();
  };

  const handleRejectSolution = (solution: SolutionSubmission) => {
    setSolutionReview(null);
    return onClose();
  };

  if (loading)
    return (
      <Stack pt="30" px="8">
        <Text textTransform="uppercase">Quest loading</Text>
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
                      colorScheme={"accentDark"}
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

                <CodeEditorPreview
                  key={solutionReview.did}
                  code={solutionReview.solution}
                />
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
                did,
                status,
                reviewComment,
                solution,
              }: SolutionSubmission) => {
                return (
                  <Tr key={did}>
                    <Td>
                      <Tag
                        colorScheme={
                          status === "approved" ? "accentDark" : "orange"
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
