import { DAIABI, ERC20ABI } from "../contracts/external-ERC20-abis";
import useTokenList from "./useTokenList";

function useTokenListWithABIs() {
  const { tokens } = useTokenList();
  return tokens.map((token) => ({
    ...token,
    abi: token.symbol === "DAI" ? DAIABI : ERC20ABI,
  }));
}

export default useTokenListWithABIs;
