// ** React Imports
import React, {
  ChangeEvent,
  ElementType,
  forwardRef,
  MouseEvent,
  useState,
} from "react";

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
import { IIPFSRecord } from "../../@core/globals/types";
import { Box, styled } from "@mui/material";
import MuiAvatar, { AvatarProps } from "@mui/material/Avatar";

interface IProps {
  formState: IIPFSRecord;
  onChange?: (e: any) => void;
  onChangeFile?: (e: any) => void;
  onChangeDate?: (date: Date) => void;
  uploadingImageStatus?: boolean;
  hideFileField?: boolean;
}

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)<AvatarProps>({
  width: "2.375rem",
  height: "2.375rem",
  fontSize: "1.125rem",
});

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

const AddNewLand = ({
  formState,
  onChange,
  onChangeFile,
  uploadingImageStatus,
  hideFileField,
  onChangeDate,
}: IProps) => {
  return (
    <Box>
      <Box>
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
                onChange={onChangeDate}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              minRows={1}
              label="Plot Number"
              name="plot_num"
              value={formState.plot_num}
              required
              onChange={onChange}
            />
          </Grid>

          {!hideFileField && (
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Upload Land Certificate
                  </Typography>
                  <input
                    type="file"
                    style={{ marginLeft: "1px" }}
                    onChange={onChangeFile}
                    disabled={uploadingImageStatus}
                    required
                    accept="image/png, image/jpeg, application/pdf"
                    id="account-settings-upload-image"
                  />
                  <Typography variant="body2" sx={{ marginTop: 5 }}>
                    Allowed PNG, JPEG or Pdf.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

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
      </Box>
    </Box>
  );
};

export default AddNewLand;
