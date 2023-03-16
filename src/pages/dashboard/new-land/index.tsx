// ** React Imports
import React, {
  ChangeEvent,
  ElementType,
  forwardRef,
  MouseEvent,
  useState,
} from "react";
import { DOMAIN_URL, client } from '../../../@core/helpers/ipfs';

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button, { ButtonProps } from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
// ** Third Party Imports
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { Box, styled } from "@mui/material";

interface State {
  password: string;
  password2: string;
  showPassword: boolean;
  showPassword2: boolean;
}

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

// eslint-disable-next-line react/display-name
const CustomInput = forwardRef((props, ref) => (
  <TextField
    fullWidth
    {...props}
    inputRef={ref}
    label="Land Purchase Date"
    autoComplete="off"
  />
));

const NewLand = () => {
  // ** States
  const [language, setLanguage] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null | undefined>(null);
  const [uploadingImageStatus, setuploadingImageStatus] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [formState, setFormState] = useState({
    owner_full_name: "",
    owner_father_name: "",
    owner_mother_name: "",
    owner_email: "",
    owner_phone: "",
    owner_cnic: "",
    owner_complete_address: "",
    land_total_area: "",
    land_amount: "",
    land_city: "",
    land_district: "",
    land_complete_location: "",
    // land_complete_land_area: "",
    land_purchase_date: new Date(),
    prev_owner_cnic: "",
  });

  async function onChangeFile(e: ChangeEvent) {
    const file = (e.target as HTMLInputElement).files[0];

    if (!file) return alert("No files selected");

    try {
      setuploadingImageStatus(true);
      const result = await client.add(file);
      const url = DOMAIN_URL + result.path;
      setuploadingImageStatus(false);
      setFileUrl(url);
    } catch (e) {
      setuploadingImageStatus(false);
      console.log(e);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    for (let key in formState) {
      if (key !== "prev_owner_cnic" && formState[key] === "") return;
    }
    if (fileUrl === "") return;
    const data = JSON.stringify({ ...formState, certificate: fileUrl });
    setSubmissionStatus(true);
    try {
      const added = await client.add(data);

      //use added.path as ipfsHash

      //For console testing
      const url = DOMAIN_URL + added.path;
      console.log(url);

      setSubmissionStatus(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Add New Land"
        titleTypographyProps={{ variant: "h6" }}
      />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                1. Owner Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="full name"
                name="owner_full_name"
                required
                value={formState.owner_full_name}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father name"
                name="owner_father_name"
                required
                value={formState.owner_father_name}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother Name"
                name="owner_mother_name"
                required
                value={formState.owner_mother_name}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="email"
                type="email"
                name="owner_email"
                required
                value={formState.owner_email}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="owner_phone"
                required
                value={formState.owner_phone}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CNIC Number"
                placeholder="sample ( 31304-4537123-3 )"
                name="owner_cnic"
                required
                value={formState.owner_cnic}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                minRows={1}
                fullWidth
                placeholder="Complete Address"
                name="owner_complete_address"
                required
                value={formState.owner_complete_address}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                2. Land Info
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Land Area"
                placeholder="land area in sq ft"
                name="land_total_area"
                required
                value={formState.land_total_area}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount Paid"
                placeholder="amount paid"
                name="land_amount"
                required
                value={formState.land_amount}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                placeholder="city"
                name="land_city"
                required
                value={formState.land_city}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                placeholder="District"
                name="land_district"
                required
                value={formState.land_district}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                minRows={1}
                label="Complete location detail"
                helperText="Complete location date like sector h12, street 2, plot number and so on"
                name="land_complete_location"
                value={formState.land_complete_location}
                required
                onChange={onChange}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                minRows={2}
                label="Complete land area detail"
                placeholder="Complete detail about the front, back and side area in sq.ft"
                helperText="Complete detail about the front, back and side area in sq.ft"
                name="land_complete_land_area"
                value={formState.land_complete_land_area}
                onChange={onChange}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={formState.land_purchase_date || new Date()}
                  showYearDropdown
                  showMonthDropdown
                  id="account-settings-date"
                  placeholderText="MM-DD-YYYY"
                  customInput={<CustomInput />}
                  value={formState.land_purchase_date}
                  name="land_purchase_date"
                  required
                  onChange={onChange}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1" sx={{marginBottom: 2}}>
                    Upload Land Certificate
                  </Typography>
                    <input
                      type="file"
                      multiple
                      style={{marginLeft: '1px'}}
                      onChange={onChangeFile}
                      disabled={uploadingImageStatus}
                      required
                      accept="image/png, image/jpeg"
                      id="account-settings-upload-image"
                    />
                  <Typography variant="body2" sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                3. Previous Owner Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Previous Owner CNIC"
                value={formState.prev_owner_cnic}
                name="prev_owner_cnic"
                onChange={onChange}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button
            onClick={handleSubmit}
            size="large"
            type="submit"
            sx={{ mr: 2 }}
            variant="contained"
            disabled={uploadingImageStatus || submissionStatus}
          >
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default NewLand;
