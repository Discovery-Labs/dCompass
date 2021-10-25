/* eslint-disable react/jsx-props-no-spreading */
declare global {
  interface Window {
    ethereum: any;
  }
}

import { ChakraProvider } from "@chakra-ui/react";
import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "@fontsource/lexend/latin.css";
import "@fontsource/roboto-mono";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";

import defaultSEOConfig from "../../next-seo.config";
import createEmotionCache from "styles/createEmotionCache";
import customTheme from "styles/customTheme";
import "styles/globals.css";
import Layout from "components/layout";

const clientSideEmotionCache = createEmotionCache();

interface DcompassAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const DcompassApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: DcompassAppProps) => {
  return (
    <MoralisProvider
      appId="9JOpuq4lDErFzIRbmDOWV30Gw0QjrJSszyCHIYzy"
      serverUrl="https://chxc6p9owakh.grandmoralis.com:2053/server"
    >
      <CacheProvider value={emotionCache}>
        <ChakraProvider theme={customTheme}>
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
    </MoralisProvider>
  );
};

DcompassApp.defaultProps = {
  emotionCache: clientSideEmotionCache,
};

export default DcompassApp;
