import { Heading } from "@chakra-ui/react";
import { useContext } from "react";

import Card from "../../../components/custom/Card";
import NotConnectedCard from "../../../components/custom/NotConnectedCard";
import AddGitHubAccountScreen from "../../../components/custom/profile/AddGithubAccountScreen";
import CenteredFrame from "../../../components/layout/CenteredFrame";
import { Web3Context } from "../../../contexts/Web3Provider";

function AddGitHubAccountPage() {
  const { self, account } = useContext(Web3Context);

  return self && account ? (
    <>
      <Heading margin={{ horizontal: "none", vertical: "small" }}>
        Verify GitHub account
      </Heading>
      <AddGitHubAccountScreen />
    </>
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotConnectedCard />
      </Card>
    </CenteredFrame>
  );
}

export default AddGitHubAccountPage;
