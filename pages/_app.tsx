import React, { ReactElement } from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import chakraTheme from "@/styles/theme";

import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ChakraProvider theme={chakraTheme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
