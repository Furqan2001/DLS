// ** React Imports
import {
  useState,
  ElementType,
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button, { ButtonProps } from "@mui/material/Button";

// ** Icons Imports
import Close from "mdi-material-ui/Close";
import { ROLES } from "../../@core/globals/enums";
import { fetchUserInfo, updateUserInfo } from "../../common/api/userInfo";
import { useDLSContext } from "../../common/context/DLSContext";
import { findUndefinedKeyInObj } from "../../@core/helpers";
import LoadingButton from "../../@core/components/shared/LoadingButton";
import { IDbUserInfo } from "../../@core/globals/types";
import { useUserInfo } from "../../common/context/UserInfoContext";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
}));

interface IProps {
  userInfo?: IDbUserInfo;
}

const TabAccount = ({ userInfo }: IProps) => {
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(true);
  const [uploadedFile, setUploadedFile] = useState<FileList>();
  const [imgSrc, setImgSrc] = useState<string>("/images/avatars/1.png");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { userRole, userAddress } = useDLSContext();

  const { fetchCurrentUserDetail } = useUserInfo();

  const [formState, setFormState] = useState({
    username: "",
    name: "",
    email: "",
    role: ROLES.visitor,
  });

  const onChangeFile = (file: ChangeEvent) => {
    const reader = new FileReader();
    const { files } = file.target as HTMLInputElement;
    setUploadedFile(files);
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string);

      reader.readAsDataURL(files[0]);
    }
  };

  const onChangeFormFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!userInfo) return;

    setFormState({
      ...formState,
      name: userInfo.name,
      email: userInfo.email,
      username: userInfo.username,
    });
    if (userInfo.avatar) {
      setImgSrc(userInfo.avatar);
    }
  }, [userInfo]);

  const submitUserData = async () => {
    delete formState.role;

    if (findUndefinedKeyInObj(formState)) {
      return setErr("All fields are required");
    }

    setLoading(true);
    setErr("");
    const formData = new FormData();
    formData.append("accountAddress", userAddress);
    formData.append("name", formState.name);
    formData.append("email", formState.email);
    formData.append("username", formState.username);
    if (uploadedFile) formData.append("files", uploadedFile?.[0]);

    try {
      await updateUserInfo(formData);
      await fetchCurrentUserDetail();
    } catch (err) {
      console.log("err in updating the user info ", err);
      setErr(err?.message);
    }

    setLoading(false);
  };

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ImgStyled src={imgSrc} alt="Profile Pic" />
              <Box>
                <ButtonStyled
                  component="label"
                  variant="contained"
                  htmlFor="account-settings-upload-image"
                >
                  Upload New Photo
                  <input
                    hidden
                    type="file"
                    onChange={onChangeFile}
                    accept="image/png, image/jpeg"
                    id="account-settings-upload-image"
                  />
                </ButtonStyled>

                <Typography variant="body2" sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formState.username}
              onChange={onChangeFormFields}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formState.name}
              onChange={onChangeFormFields}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formState.email}
              onChange={onChangeFormFields}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                disabled
                value={userRole}
                label="Role"
                defaultValue="visitor"
              >
                <MenuItem value={ROLES.admin}>{ROLES.admin}</MenuItem>
                <MenuItem value={ROLES.moderator}>{ROLES.visitor}</MenuItem>
                <MenuItem value={ROLES.visitor}>{ROLES.visitor}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* {openAlert ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity="warning"
                sx={{ "& a": { fontWeight: 400 } }}
                action={
                  <IconButton
                    size="small"
                    color="inherit"
                    aria-label="close"
                    onClick={() => setOpenAlert(false)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>
                  Your email is not confirmed. Please check your inbox.
                </AlertTitle>
                <Link
                  href="/"
                  onClick={(e: SyntheticEvent) => e.preventDefault()}
                >
                  Resend Confirmation
                </Link>
              </Alert>
            </Grid>
          ) : null} */}

          <Grid item xs={12}>
            <LoadingButton
              variant="contained"
              onClick={submitUserData}
              sx={{ marginRight: 3.5 }}
              loading={loading}
            >
              Save Changes
            </LoadingButton>
          </Grid>
          {err && <Alert severity="error">{err}</Alert>}
        </Grid>
      </form>
    </CardContent>
  );
};

export default TabAccount;
