import { ChangeEvent, useState } from "react";
import {
  Button,
  TextField,
  Unstable_Grid2 as Grid,
  Box,
  Alert,
  Typography,
  Avatar,
} from "@mui/material";
import { findUndefinedKeyInObj } from "../../globals/helpers";

const Setting = () => {
  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
    name: "M Ahmed Mushtaq",
    email: "testuser@gmail.com",
  });
  const [err, setErr] = useState("");

  const updateUser = async () => {
    if (findUndefinedKeyInObj(formState)) {
      console.log("all fields are required ", formState);
      return;
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const TextFieldWithHeading = ({ heading, name, value, placeholder }) => (
    <>
      <Typography mb={1}>{heading}</Typography>
      <TextField
        fullWidth
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );

  return (
    <Box py={1} px={2}>
      <Grid container spacing={2}>
        <Grid sm={6}>
          <TextFieldWithHeading
            heading="Update Name"
            name="name"
            value={formState.name}
            placeholder="Update name"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid sm={6}>
          <TextFieldWithHeading
            heading="Update email"
            name="email"
            value={formState.email}
            placeholder="Update email"
          />
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 2 }}>
        <Avatar
          alt="Remy Sharp"
          src="https://mui.com/static/images/avatar/2.jpg"
        />
        <Button
          variant="outlined"
          sx={{ ml: 1 }}
          color="secondary"
          component="label"
        >
          Upload Photo
          <input hidden accept="image/*" multiple type="file" />
        </Button>
      </Grid>

      <Button sx={{ mt: 5 }} variant="contained" onClick={updateUser}>
        Update Profile
      </Button>
      {err && <Alert severity="error">{err}</Alert>}
    </Box>
  );
};

export default Setting;
