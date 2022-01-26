import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import copy from "copy-to-clipboard";
import { useTranslation } from "next-i18next";
import { useCallback, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Web3Context } from "../../../contexts/Web3Provider";
import {
  createTwitter,
  findTwitter,
} from "../../../core/ceramic/identity-link";

function createTweetLink(did: string): string {
  const text = encodeURIComponent(
    `Verifying my Twitter account for my decentralized identity ${did} on @ceramicnetwork via @mySelfID.`
  );
  const url = encodeURIComponent(`${document.location.origin}/${did}`);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

type Props = {
  onCloseModal?: () => void;
};

function AddTwitterAccountScreen({ onCloseModal }: Props) {
  const { t } = useTranslation("common");
  const { self, identityLink } = useContext(Web3Context);
  const [challengeLoading, setChallengeLoading] = useState<boolean>(false);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const did = self.id;
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const copyMessage = useCallback(() => {
    if (self == null || typeof username !== "string" || challengeLoading) {
      return;
    }

    const toastId = toast.loading("Loading challenge...");
    setChallengeLoading(true);

    identityLink.requestTwitter(did, username).then(
      (userChallenge: string) => {
        setChallenge(userChallenge);
        if (copy(did)) {
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
  }, [challengeLoading, self, username, did, identityLink]);

  const verify = useCallback(() => {
    const handleAddTwitterAttestation = async (
      twitterUsername: string,
      challengeCode: string
    ) => {
      let [attestation, accounts] = await Promise.all([
        (async () => {
          const jws = await self.client.ceramic.did?.createJWS({
            challengeCode,
          });
          if (!jws) {
            throw new Error("Not authorized");
          }
          return identityLink.confirmTwitter(jws);
        })(),
        self.get("alsoKnownAs"),
      ]);

      console.log({ attestation, accounts });

      const existingTwitter = accounts
        ? findTwitter(accounts.accounts, twitterUsername)
        : null;
      const existingGithub = accounts
        ? accounts.accounts.find(
            (acc: Record<string, any>) => acc.host === "github.com"
          )
        : null;

      if (existingTwitter == null) {
        accounts = {
          accounts: [
            createTwitter(twitterUsername, attestation),
            existingGithub,
          ],
        };
      } else {
        existingTwitter.attestations = existingTwitter.attestations ?? [];
        existingTwitter.attestations.push({ "did-jwt-vc": attestation });
      }
      console.log({ accounts });
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

    handleAddTwitterAttestation(username, challenge).then(
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
  }, [identityLink, challenge, self, onCloseModal, username, verifyLoading]);

  const steps = [
    {
      label: "Step 1",
      content: (
        <FormControl w="fit-content">
          <FormLabel htmlFor="name">Twitter username</FormLabel>
          <Input
            placeholder="Your Twitter username"
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
            Tweet a verification from{" "}
            <Text color="twitter.500">@{username}</Text>
          </Box>
          <Box>
            <Link
              href={createTweetLink(did)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Tweet verification</Button>
            </Link>
          </Box>
        </VStack>
      ),
    },
    {
      label: "Step 4",
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
        {activeStep > 0 && activeStep <= 3 && (
          <Button
            variant="outline"
            onClick={() => prevStep()}
            px="1.25rem"
            fontSize="md"
          >
            {t("prev")}
          </Button>
        )}
        {activeStep < 3 && (
          <Button
            ml="0.5rem"
            onClick={() => nextStep()}
            px="1.25rem"
            fontSize="md"
          >
            {t("next")}
          </Button>
        )}
        {activeStep === 3 && (
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
export default AddTwitterAccountScreen;
