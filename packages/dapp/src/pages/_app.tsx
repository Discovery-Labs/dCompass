/* eslint-disable react/jsx-props-no-spreading */
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Web3Provider as EthersProvider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import "@fontsource/poppins";
import "@fontsource/space-mono";
import { getDefaultProvider } from "ethers";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";

import theme from "styles/customTheme";

import "styles/globals.css";
import { NftProvider } from "use-nft";

import { useApollo } from "../../lib/apolloClient";
import defaultSEOConfig from "../../next-seo.config";
import Web3ReactManager from "../contexts/Web3Manager";
import { Web3Provider } from "../contexts/Web3Provider";
import createEmotionCache from "../styles/createEmotionCache";
import Layout from "components/layout";

import dynamic from "next/dynamic";

interface DcompassAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
const getLibrary = (provider: any): EthersProvider => {
  const library = new EthersProvider(provider);
  library.pollingInterval = 12000;
  return library;
};

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
  const apolloClient = useApollo(pageProps);
  return (
    <NftProvider
      fetcher={[
        "ethers",
        {
          provider: getDefaultProvider(NETWORK),
        },
      ]}
    >
      <ApolloProvider client={apolloClient}>
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
  );
};

MyApp.defaultProps = {
  emotionCache: clientSideEmotionCache,
};

export default appWithTranslation(MyApp);
