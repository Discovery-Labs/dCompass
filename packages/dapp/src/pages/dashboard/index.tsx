import { Text, Heading, Flex, VStack } from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Container from "components/layout/Container";
import UserNFTs from "components/custom/dashboard/UserNFTs";

function Dashboard() {
  const { t } = useTranslation("common");
  const { getTextColor } = useCustomColor();
  return (
    <Container>
      <Flex w="full">
        <Heading as="h1" size="2xl" color={getTextColor}>
          Dashboard
        </Heading>
      </Flex>
      <VStack w="full" align="start">
        <Text as="h2" textStyle="h2">
          Badges
        </Text>
        <UserNFTs />
      </VStack>
    </Container>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default Dashboard;
