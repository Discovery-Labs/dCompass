/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Web3Provider as EthersProvider } from "@ethersproject/providers";
import "@fontsource/poppins";
import "@fontsource/space-mono";
import { Web3ReactProvider } from "@web3-react/core";
import Layout from "components/layout";
import { getDefaultProvider } from "ethers";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { WagmiConfig, chain, createClient, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import theme from "styles/customTheme";
import "styles/globals.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/dist/tippy.css";
import { NftProvider } from "use-nft";
import { createApolloClient } from "../../lib/apolloClient";
import defaultSEOConfig from "../../next-seo.config";
import Web3ReactManager from "../contexts/Web3Manager";
import { Web3Provider } from "../contexts/Web3Provider";
import createEmotionCache from "../styles/createEmotionCache";
import { defaultChain, NETWORKS } from "../core/networks";

interface DcompassAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
const getLibrary = (provider: any): EthersProvider => {
  const library = new EthersProvider(provider);
  library.pollingInterval = 12000;
  return library;
};

const client = createApolloClient();

// Get environment variables
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;

// Pick chains
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.rinkeby, chain.polygonMumbai],
  [alchemyProvider({ alchemyId }), publicProvider()]
);

// Set up connectors
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "dCompass",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

const NETWORK = "rinkeby";
const Web3ReactProviderDefault = dynamic(
  () => import("../contexts/Web3ProviderNetwork"),
  { ssr: false }
);

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: DcompassAppProps) => {
  // const apolloClient = useApollo(pageProps);
  return (
    <WagmiConfig client={wagmiClient}>
      <NftProvider
        fetcher={[
          "ethers",
          {
            provider: getDefaultProvider(NETWORK),
          },
        ]}
      >
        <ApolloProvider client={client}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ReactProviderDefault getLibrary={getLibrary}>
              <Web3Provider>
                <Web3ReactManager>
                  <CacheProvider value={emotionCache}>
                    <ChakraProvider theme={theme}>
                      <Head>
                        <meta
                          name="viewport"
                          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                        />
                      </Head>
                      <DefaultSeo {...defaultSEOConfig} />
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </ChakraProvider>
                  </CacheProvider>
                </Web3ReactManager>
              </Web3Provider>
            </Web3ReactProviderDefault>
          </Web3ReactProvider>
        </ApolloProvider>
      </NftProvider>
    </WagmiConfig>
  );
};

MyApp.defaultProps = {
  emotionCache: clientSideEmotionCache,
};

export default appWithTranslation(MyApp);
