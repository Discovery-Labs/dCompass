import { useWeb3React } from "@web3-react/core";
import { useContext } from "react";

import Card from "components/custom/Card";
import NotConnectedCard from "components/custom/NotConnectedCard";
import CenteredFrame from "components/layout/CenteredFrame";
import { Web3Context } from "contexts/Web3Provider";

function MembershipWrapper(props: any) {
  const { children } = props;

  const { contracts } = useContext(Web3Context);
  const web3React = useWeb3React();

  const { account } = web3React;

  return account && contracts ? (
    <>{children}</>
  ) : (
    <CenteredFrame>
      <Card h="full" w="2xl" border="solid 1px red">
        <NotConnectedCard />
      </Card>
    </CenteredFrame>
  );
}

export default MembershipWrapper;
