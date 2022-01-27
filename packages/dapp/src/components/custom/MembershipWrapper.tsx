import NFTAccessMinter from "components/custom/nft/NFTAccessMinter";
import useNFTAccess from "core/hooks/useNFTAccess";

function MembershipWrapper(props: any) {
  const hasMembershipAccess = useNFTAccess();
  const { children } = props;

  return hasMembershipAccess ? <>{children}</> : <NFTAccessMinter />;
}

export default MembershipWrapper;
