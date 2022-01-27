import { HStack, Icon, IconButton, Text, useClipboard } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Blockies from "react-blockies";
import { MdCheckCircle, MdContentCopy } from "react-icons/md";

import AccountBadges from "components/custom/nft/AccountBadges";
import Container from "components/layout/Container";
import { useResolveEnsName } from "core/hooks/useResolveEnsName";

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

function BadgePage() {
  const router = useRouter();

  const { account } = router.query;
  let address = "";
  // console.log("account", account);
  if (typeof account === "string") {
    address = account;
  }

  const { hasCopied, onCopy } = useClipboard(address);
  const { ens } = useResolveEnsName(address);
  let displayAddress = address.slice(0, 6);

  const ensSplit = ens && ens.split(".");
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === "eth";
  if (validEnsCheck) {
    displayAddress = ens;
  } else {
    displayAddress += `...${address.slice(-4)}`;
  }

  return (
    <Container>
      <Blockies seed={address} className="blockies" size={16} scale={6} />
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
      <AccountBadges />
    </Container>
  );
}

export default BadgePage;
