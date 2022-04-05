import {
  Box,
  HStack,
  Icon,
  IconButton,
  Link,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext } from "react";
import Blockies from "react-blockies";
import { MdCheckCircle, MdContentCopy } from "react-icons/md";

import { Web3Context } from "../../contexts/Web3Provider";
import Card from "components/custom/Card";
import MembershipWrapper from "components/custom/MembershipWrapper";
import UserNFTs from "components/custom/nft/UserNFTs";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import Container from "components/layout/Container";
import useCustomColor from "core/hooks/useCustomColor";
import { useResolveEnsName } from "core/hooks/useResolveEnsName";

function Badges() {
  const { account } = useContext(Web3Context);
  const address = account || "";
  const { ens } = useResolveEnsName(address);
  const { hasCopied, onCopy } = useClipboard(address);
  const { getTextColor } = useCustomColor();

  if (!account) {
    return (
      <Box padding="6" as="span">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={1} spacing="4" />
      </Box>
    );
  }

  let displayAddress = address.slice(0, 6);

  const ensSplit = ens && ens.split(".");
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === "eth";
  if (validEnsCheck) {
    displayAddress = ens;
  } else {
    displayAddress += `...${address.slice(-4)}`;
  }

  return (
    <NotConnectedWrapper>
      <MembershipWrapper>
        <Container>
          <Stack
            direction={["column", null, "row"]}
            w="full"
            align="start"
            spacing="16"
          >
            <Card w={["full", null, "400px"]} h="unset">
              <VStack w="full" align="center" spacing="2">
                <Blockies
                  seed={address}
                  className="blockies"
                  size={16}
                  scale={6}
                />
                <Text textAlign="center" as="h2" textStyle="h2">
                  Shadowy Super Coder
                </Text>

                <HStack>
                  <Text>{displayAddress}</Text>
                  <IconButton
                    variant="ghost"
                    onClick={onCopy}
                    aria-label="Copy Address"
                    icon={
                      hasCopied ? (
                        <Icon color="aqua.300" as={MdCheckCircle} />
                      ) : (
                        <MdContentCopy />
                      )
                    }
                  />
                </HStack>

                <VStack>
                  <Text color="text" fontSize="sm">
                    Followers 124632 Following 145
                  </Text>

                  <Text textAlign="center">
                    Blockchain enthusiast, Food lover, Solo Traveler, VR nerd.
                    Join my journey.
                  </Text>
                </VStack>

                <Link href="https://google.com">
                  <Text fontSize="sm">www.shadowysupercoderwebsite.xyz</Text>
                </Link>
              </VStack>
            </Card>
            <UserNFTs />
          </Stack>
          {/* <Flex w="full">
            <Text as="h1" textStyle="h1" color="text">
              Badges
            </Text>
            <Box pt="8">
              <UserNFTs />
            </Box>
          </Flex> */}
        </Container>
      </MembershipWrapper>
    </NotConnectedWrapper>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Badges;
