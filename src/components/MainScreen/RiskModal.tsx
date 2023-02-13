import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import RiskStatusAlert from "../shared/RiskStatusAlert";
import ModalWrapper from "../shared/ModalWrapper";

interface IProps {
  open: boolean;
  setClose: () => void;
}

const RiskModal = ({ open, setClose }: IProps) => {
  return (
    <ModalWrapper
      open={open}
      setClose={setClose}
      bodyContainerSx={{ width: { xs: 360, sm: 560, lg: 960 }, p: 0 }}
    >
      <Grid container p={3}>
        <Typography>Status</Typography>
        <CancelIcon onClick={setClose} sx={{ ml: "auto", color: "#B3B3B3" }} />
      </Grid>
      <Divider />

      <Box mx={5} mt={2.5}>
        <Grid container alignItems="center">
          <Typography mr={1}>Risk Status</Typography>
          <RiskStatusAlert text="Red" />
        </Grid>

        <Box mt={3} p={2} sx={{ background: "#F5F5F5" }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography sx={{ color: "common.lightBlack" }}>
                Trigger
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 400, mt: 1.2 }}>
                The asset risk profile has changed significantly.
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ color: "common.lightBlack" }}>
                Event Summary
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 400, mt: 1.2 }}>
                A significant amount of Compound were transferred.
              </Typography>
            </Grid>
          </Grid>
          <Box mt={5.5}>
            <Typography sx={{ color: "common.lightBlack" }}>Details</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 400, mt: 1.2 }}>
              [Token % out of the entire circulation] 0.58% were transferred. A
              significant movement is detected when there are more than 1% of
              the tokens in circulation that were moved in a single transaction.
              Such a significant movement usually triggers movements in the
              asset price and therefor should be monitored closely.
            </Typography>
          </Box>
        </Box>

        <Box textAlign="center" my={3}>
          <Button
            variant="contained"
            sx={{ borderRadius: 46, width: 221, height: 48 }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default RiskModal;
