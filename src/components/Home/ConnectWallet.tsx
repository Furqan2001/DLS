"use client";
import { useEffect } from "react";
import { Box, Card, Typography, TextField, Button } from "@mui/material";
import TextWithIcon from "../shared/TextWithIcon";
import Link from "next/link";
import { useDLSContext } from "../../context/DLSContext";
import { useRouter } from "next/navigation";

const ConnectWallet = () => {
  const { connectToWallet, currentAccount } = useDLSContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentAccount) return;

    router.push("/dashboard");
  }, [currentAccount]);

  return (
    <Card
      sx={{
        background: "common.white",
        width: { xs: 499, md: 399, lg: 499, xl: 599 },
        height: { xs: 500, xl: 654 },
      }}
    >
      <Box textAlign="center" sx={{ p: 5, mt: { xs: 2, xl: 7.5 } }}>
        <Typography variant="h5" sx={{}}>
          Welcome to DLS
        </Typography>
        <Typography variant="body1" mt={1}>
          Connect your wallet
        </Typography>
      </Box>

      <Box sx={{ py: 2, px: 5 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={
            <img
              src="https://img.icons8.com/office/512/metamask-logo.png"
              width={20}
              height={20}
            />
          }
          sx={{
            height: 65,
            borderRadius: 25,
            mt: { xs: 4, xl: 7 },
            fontSize: "1rem",
            fontWeight: 500,
          }}
          onClick={() => {
            console.log("onClick occured ");
            connectToWallet();
          }}
        >
          Connect To MetaMask
        </Button>

        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          startIcon={
            <img
              src="https://img.icons8.com/cotton/512/ghost.png"
              width={20}
              height={20}
            />
          }
          sx={{
            height: 65,
            borderRadius: 25,
            mt: { xs: 4, xl: 7 },
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Connect To Phantom
        </Button>
      </Box>
    </Card>
  );
};

export default ConnectWallet;
