import { Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Dashboard() {
  const { t } = useTranslation("common");

  return (
    <>
      <Text>Dashboard</Text>
      <Text>{t("create-project")}</Text>
      <Text>{t("all-projects")}</Text>
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
      // Will be passed to the page component as props
    },
  };
}

export default Dashboard;
