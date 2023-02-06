import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";

import NextProgress from "next-progress";
import theme from "../theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NextProgress delay={300} options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
