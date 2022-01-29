/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from "@chakra-ui/react";
import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "@fontsource/lexend/latin.css";
import "@fontsource/roboto-mono";
import "@fontsource/poppins";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";

import defaultSEOConfig from "../../next-seo.config";
import createEmotionCache from "styles/createEmotionCache";
import theme from "styles/customTheme";
import "styles/globals.css";

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
    <CacheProvider value={emotionCache}>
      <ChakraProvider theme={theme}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <Component {...pageProps} />
      </ChakraProvider>
    </CacheProvider>
  );
};

DcompassApp.defaultProps = {
  emotionCache: clientSideEmotionCache,
};

export default DcompassApp;
