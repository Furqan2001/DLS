// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent } from "react";

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

interface State {
  password: string;
  showPassword: boolean;
}

const FormLayoutsBasic = () => {
  // ** States
  const [values, setValues] = useState<State>({
    password: "",
    showPassword: false,
  });
  const [confirmPassValues, setConfirmPassValues] = useState<State>({
    password: "",
    showPassword: false,
  });

  const router = useRouter();

  const { accountAddress } = router.query;

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleConfirmPassChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setConfirmPassValues({
        ...confirmPassValues,
        [prop]: event.target.value,
      });
    };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickConfirmPassShow = () => {
    setConfirmPassValues({
      ...confirmPassValues,
      showPassword: !confirmPassValues.showPassword,
    });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Card>
      <CardHeader
        title="Admin Info"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item container xs={12} spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Username" name="username" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" />
              </Grid>
            </Grid>
            <Grid item container xs={12} spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" name="email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" name="phone" />
              </Grid>
            </Grid>
            <Grid item container xs={12} spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Cnic" name="cnic" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel sx={{ fontSize: "0.875rem" }}>Gender</FormLabel>
                  <RadioGroup
                    row
                    defaultValue="male"
                    aria-label="gender"
                    name="gender"
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

            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Button type="submit" variant="contained" size="large">
                  Approve It
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                >
                  Reject It
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="success">5 admins already approved</Alert>
              <Alert severity="error" sx={{ mt: 3 }}>
                3 admins already rejected
              </Alert>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormLayoutsBasic;
