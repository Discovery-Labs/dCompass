import {
  Box,
  Link,
  Button,
  Spinner,
  Text,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import copy from "copy-to-clipboard";
import { useTranslation } from "next-i18next";
import { useCallback, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Web3Context } from "../../../contexts/Web3Provider";
import { findGitHub } from "../../../core/ceramic";
import { createGitHub } from "../../../core/ceramic/identity-link";

function AddGitHubAccountScreen({
  onCloseModal,
}: {
  onCloseModal?: () => void;
}) {
  const { t } = useTranslation("common");
  const { self, identityLink } = useContext(Web3Context);
  const [challengeLoading, setChallengeLoading] = useState<boolean>(false);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const copyMessage = useCallback(() => {
    if (self == null || typeof username !== "string" || challengeLoading) {
      return;
    }

    const toastId = toast.loading("Loading challenge...");
    setChallengeLoading(true);

    identityLink.requestGitHub(self.id, username).then(
      (userChallenge: string) => {
        setChallenge(userChallenge);
        if (copy(self.id)) {
          toast.success("Copied to clipboard!", { id: toastId });
        } else {
          toast.error("Failed to copy to clipboard", { id: toastId });
        }
        setChallengeLoading(false);
      },
      (err: Error) => {
        toast.error(`Failed to get challenge: ${err.message}`, { id: toastId });
        setChallengeLoading(false);
      }
    );
  }, [challengeLoading, username, self, identityLink]);

  const verify = useCallback(() => {
    const handleAddGithubAttestation = async (
      githubUsername: string,
      challengeCode: string
    ) => {
      // eslint-disable-next-line prefer-const
      let [attestation, accounts] = await Promise.all([
        (async () => {
          const jws = await self.client.ceramic.did?.createJWS({
            challengeCode,
          });
          if (!jws) {
            throw new Error("Not authorized");
          }
          return identityLink.confirmGitHub(jws);
        })(),
        self.get("alsoKnownAs"),
      ]);

      const existing = accounts.accounts
        ? findGitHub(accounts, githubUsername)
        : null;
      if (existing == null) {
        accounts = {
          accounts: [createGitHub(githubUsername, attestation)],
        };
      } else {
        existing.attestations = existing.attestations ?? [];
        existing.attestations.push({ "did-jwt-vc": attestation });
      }
      await self.set("alsoKnownAs", accounts);
      return accounts;
    };

    if (
      self == null ||
      challenge == null ||
      typeof username !== "string" ||
      verifyLoading
    ) {
      return;
    }

    const toastId = toast.loading("Verifying...");
    setVerifyLoading(true);

    handleAddGithubAttestation(username, challenge).then(
      () => {
        toast.success("Attestation added!", { id: toastId });
        setVerifyLoading(false);
        return onCloseModal && onCloseModal();
      },
      (err: Error) => {
        toast.error(`Failed to verify or add attestation: ${err.message}`, {
          id: toastId,
        });
        setVerifyLoading(false);
      }
    );
  }, [challenge, onCloseModal, self, username, verifyLoading, identityLink]);

  const steps = [
    {
      label: "Step 1",
      content: (
        <FormControl w="fit-content">
          <FormLabel htmlFor="name">Github username</FormLabel>
          <Input
            placeholder="Your Github username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
      ),
    },
    {
      label: "Step 2",
      content: (
        <VStack align="left">
          <Box>
            <Text color="neutral-2">
              Click this button to copy the verification message.
            </Text>
          </Box>
          <Box>
            {challengeLoading ? (
              <Button disabled icon={<Spinner />} />
            ) : (
              <Button disabled={verifyLoading} onClick={copyMessage}>
                Copy
              </Button>
            )}
          </Box>
        </VStack>
      ),
    },
    {
      label: "Step 3",
      content: (
        <VStack align="left">
          <Box>
            <Text color="neutral-2">
              Click this button to open a new window and create a Gist file.
            </Text>
          </Box>
          <Box>
            <Link
              href="https://gist.github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Open</Button>
            </Link>
          </Box>
        </VStack>
      ),
    },
    {
      label: "Step 4",
      content: (
        <VStack align="left">
          <Text color="neutral-2">
            Paste your DID in the Gist and save as public.
          </Text>
        </VStack>
      ),
    },
    {
      label: "Step 5",
      content: (
        <VStack align="left">
          <Box>
            <Text color="neutral-2">
              Return to this page and verify your account by clicking this
              Verify button.
            </Text>
          </Box>
        </VStack>
      ),
    },
  ];
  return (
    <Box w="full">
      <Toaster />
      <Steps
        colorScheme="purple"
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            {content}
          </Step>
        ))}
      </Steps>

      <Flex w="full" justify="center">
        {activeStep > 0 && activeStep <= 4 && (
          <Button
            variant="outline"
            onClick={() => prevStep()}
            px="1.25rem"
            fontSize="md"
          >
            {t("prev")}
          </Button>
        )}
        {activeStep < 4 && (
          <Button
            ml="0.5rem"
            onClick={() => nextStep()}
            px="1.25rem"
            fontSize="md"
          >
            {t("next")}
          </Button>
        )}
        {activeStep === 4 && (
          <Box>
            {verifyLoading ? (
              <Button disabled leftIcon={<Spinner />}>
                Verifying...
              </Button>
            ) : (
              <Button
                disabled={challenge == null}
                onClick={verify}
                ml="0.5rem"
                colorScheme="accentDark"
                loadingText="Verifying..."
                type="submit"
                px="1.25rem"
                fontSize="md"
              >
                Verify
              </Button>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export default AddGitHubAccountScreen;
