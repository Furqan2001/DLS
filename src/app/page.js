"use client";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import MainLayout from "../layouts/MainLayout";
import ConnectWallet from "../components/Home/ConnectWallet";
import { DLSContextProvider } from "../context/DLSContext";

const Home = () => {
  return (
    <DLSContextProvider>
      <MainLayout>
        <Grid
          container
          sx={{ p: 0, flexDirection: { sm: "column", md: "row" } }}
        >
          <Grid xs={12} md={6} sx={{ height: { sm: "50vh", md: "100vh" } }}>
            <img
              src={"/background_bitcoin.png"}
              alt="left grid bitcoin bg"
              height="100%"
              width="100%"
              style={{ objectFit: "cover" }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            container
            justifyContent={"center"}
            alignItems="center"
            sx={{
              background: `url(/connet_wallet_bg.png)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              mt: { xs: 5, md: 0 },
              flexDirection: "column",
            }}
          >
            <Grid>
              <ConnectWallet />
            </Grid>
          </Grid>
        </Grid>
      </MainLayout>
    </DLSContextProvider>
  );
};

export default Home;
