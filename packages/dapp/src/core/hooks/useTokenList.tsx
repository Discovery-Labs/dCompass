import DEFAULT_TOKEN_LIST from "@uniswap/default-token-list";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

type Token = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

function useTokenList(): {
  tokens: Token[];
  defaultMainnetDAIToken: Token;
  getRewardCurrency: (rewardCurrency: string) => string;
} {
  const { chainId } = useWeb3React();
  const [defaultToken, setDefaultToken] = useState<Token>({
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  });
  const [tokens, setTokens] = useState<Token[]>([
    {
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      decimals: 18,
      chainId: 1,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
  ]);

  useEffect(() => {
    const tokensByCurrentChainId = DEFAULT_TOKEN_LIST.tokens.filter(
      (token) => token.chainId === chainId
    );
    setTokens(tokensByCurrentChainId);
    const DAI_DEFAULT_CURRENCY = tokensByCurrentChainId.find(
      (token) => token.symbol === "DAI"
    );
    setDefaultToken((currentDAI) => DAI_DEFAULT_CURRENCY ?? currentDAI);
  }, [chainId]);

  const getRewardCurrency = (rewardCurrency: string) => {
    if (rewardCurrency) {
      const [chainIdStr, tokenAddress] = rewardCurrency.split(":");
      const currencyChainId = parseInt(chainIdStr, 10);
      const foundToken = tokens.find(
        (token) =>
          token.address === tokenAddress && token.chainId === currencyChainId
      );
      if (foundToken?.symbol) {
        return foundToken?.symbol;
      }
    }
    return defaultToken.symbol;
  };

  return {
    defaultMainnetDAIToken: defaultToken,
    tokens,
    getRewardCurrency,
  };
}

export default useTokenList;
