import { Container } from "@mui/material";
import Head from "next/head";
import { ReactNode } from "react";
import Navbar from "../components/shared/Navbar";

interface IProps {
  children: ReactNode;
  pageTitle: string;
  pageDescription: string;
}

const FrontLayout = ({ children, pageTitle, pageDescription }: IProps) => {
  return (
    <Container maxWidth="xl">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      {children}
    </Container>
  );
};

export default FrontLayout;
