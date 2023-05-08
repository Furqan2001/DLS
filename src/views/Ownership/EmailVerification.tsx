import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";
import {
  confirmEmailVerificationCode,
  sendEmailConfirmation,
} from "../../common/api/sendMail";
import LoadingButton from "../../@core/components/shared/LoadingButton";

interface IProps {
  email: string;
  setShowLandRecord: (val?: boolean) => void;
}

const EmailVerification = ({ email, setShowLandRecord }) => {
  const [showEnterCodeInput, setShowEnterCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const sendEmailConfirmationMail = async () => {
    setLoading(true);
    setErr("");
    try {
      await sendEmailConfirmation({
        to: email,
        subject: "Onwership transfer confirmation",
        message: "Your verification code is: ",
      });
      setShowEnterCodeInput(true);
    } catch (err) {
      console.log("err is ", err);
      setErr(String(err?.message));
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setErr("");
    try {
      await confirmEmailVerificationCode({
        code,
        email,
      });
      setShowLandRecord();
    } catch (err) {
      console.log("err is ", err);
      setErr(String(err?.response?.data?.message || err?.message));
    }
    setLoading(false);
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title={
            !showEnterCodeInput
              ? "Take permission from owner by verifying email"
              : "Enter Verification Code"
          }
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={5}>
              {showEnterCodeInput && (
                <Grid item xs={12}>
                  <TextField
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                    label="Enter Code"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Box
                  sx={{
                    gap: 5,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <LoadingButton
                    type="submit"
                    onClick={
                      !showEnterCodeInput
                        ? sendEmailConfirmationMail
                        : handleVerifyCode
                    }
                    variant="contained"
                    size="large"
                    loading={loading}
                  >
                    {!showEnterCodeInput ? "Send Email" : "Submit Code"}
                  </LoadingButton>
                </Box>
                {err && <Alert color="error">{err}</Alert>}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailVerification;
