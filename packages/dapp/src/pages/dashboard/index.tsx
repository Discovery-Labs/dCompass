import { Flex, VStack, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import UserNFTs from "components/custom/dashboard/UserNFTs";
import MembershipWrapper from "components/custom/MembershipWrapper";
import NotConnectedWrapper from "components/custom/NotConnectedWrapper";
import Container from "components/layout/Container";
import useCustomColor from "core/hooks/useCustomColor";

function Dashboard() {
  const { t } = useTranslation("common");
  const { getTextColor } = useCustomColor();
  return (
    <NotConnectedWrapper>
      <MembershipWrapper>
        <Container>
          <Flex w="full">
            <Text as="h1" textStyle="h1" color={getTextColor}>
              Dashboard
            </Text>
          </Flex>
          <VStack pt="8" w="full" align="start">
            <Text as="h2" textStyle="h2">
              Badges
            </Text>
            <UserNFTs />
          </VStack>
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

export default Dashboard;
