// ** React Imports
import {
  ChangeEvent,
  MouseEvent,
  useState,
  SyntheticEvent,
  useEffect,
  useCallback,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import { useRouter } from "next/router";
import {
  Alert,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useDLSContext } from "../../../common/context/DLSContext";
import { IBlockchainUserInfo, IDbUserInfo } from "../../../@core/globals/types";
import { ROLES } from "../../../@core/globals/enums";
import LoadingButton from "../../../@core/components/shared/LoadingButton";
import { useUserInfo } from "../../../common/context/UserInfoContext";
import withAuth from "../../../@core/HOC/withAuth";

const UserAccountInfo = () => {
  // ** States

  const [blockchainUserInfo, setBlockchainUserInfo] =
    useState<IBlockchainUserInfo>();

  const router = useRouter();
  const { contract } = useDLSContext();

  const { accountAddress } = router.query;

  const { fetchSpecificUser, addNewModerator, addNewAdmin } = useDLSContext();
  const [dbUserInfo, setDbUserInfo] = useState<IDbUserInfo>();

  const { fetchUserDbDetails, loadingUserInfo } = useUserInfo();

  const fetchUserBlockchainInfo = useCallback(async () => {
    if (!accountAddress) return;

    // load dbUserInfo from db
    try {
      const dbUserInfo = await fetchUserDbDetails(accountAddress as string);
      setDbUserInfo(dbUserInfo);

      const res = await fetchSpecificUser(accountAddress as string);
      if (res && Object.keys(res).length > 0)
        setBlockchainUserInfo(res as IBlockchainUserInfo);
    } catch (err) {
      console.log("err in fetching the user details ", err);
    }
  }, [accountAddress, contract]);

  useEffect(() => {
    fetchUserBlockchainInfo();
  }, [fetchUserBlockchainInfo]);

  const onClickBtn = async () => {
    const account = accountAddress as string;
    if (blockchainUserInfo.role === ROLES.visitor) {
      // visitor can only convert to Moderxator
      await addNewModerator(account);
      await fetchUserBlockchainInfo();
    } else {
      // moderator can become to admin
      await addNewAdmin(account);
      await fetchUserBlockchainInfo();
    }
  };

  return (
    <Card>
      <CardHeader title="Admin Info" titleTypographyProps={{ variant: "h6" }} />
      <CardContent>
        {!dbUserInfo && (
          <Box>
            <Alert severity={loadingUserInfo ? "info" : "error"}>
              {loadingUserInfo
                ? "Please wait..."
                : "Detailed user info is not present."}
            </Alert>
          </Box>
        )}
        {!!dbUserInfo && (
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item container xs={12} spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={dbUserInfo.username}
                    name="username"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={dbUserInfo.name}
                    name="name"
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={dbUserInfo.email}
                    name="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={dbUserInfo.phoneNumber}
                    name="phone"
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cnic"
                    value={dbUserInfo.cnic}
                    name="cnic"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <FormLabel sx={{ fontSize: "0.875rem" }}>Gender</FormLabel>
                    <RadioGroup
                      row
                      defaultValue="male"
                      aria-label="gender"
                      name="gender"
                      value={dbUserInfo.gender}
                    >
                      <FormControlLabel
                        value="male"
                        label="Male"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="female"
                        label="Female"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="other"
                        label="Other"
                        control={<Radio />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {blockchainUserInfo &&
                blockchainUserInfo?.role !== ROLES.admin && (
                  <>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          gap: 5,
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          size="large"
                          onClick={onClickBtn}
                        >
                          {blockchainUserInfo.role === ROLES.visitor
                            ? "Vote to make a moderator"
                            : "Vote to make an Admin"}
                        </LoadingButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="success">
                        {blockchainUserInfo.role === ROLES.visitor
                          ? blockchainUserInfo.modApprovalsLeft
                          : blockchainUserInfo.adminApprovalsLeft}{" "}
                        approvals requires to become
                        {blockchainUserInfo.role === ROLES.visitor
                          ? " moderator"
                          : " admin"}
                      </Alert>
                    </Grid>
                  </>
                )}
            </Grid>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default withAuth(UserAccountInfo);
