// ** React Imports
import React, { forwardRef, useCallback, useEffect, useState } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import RadioGroup from "@mui/material/RadioGroup";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";

// ** Third Party Imports
import DatePicker from "react-datepicker";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { findUndefinedKeyInObj } from "../../@core/helpers";
import { useDLSContext } from "../../common/context/DLSContext";
import { fetchUserInfo, updateUserBioInfo } from "../../common/api/userInfo";
import { IDbUserInfo } from "../../@core/globals/types";
import LoadingButton from "../../@core/components/shared/LoadingButton";
import { useUserInfo } from "../../common/context/UserInfoContext";

// eslint-disable-next-line react/display-name
const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label="Birth Date" fullWidth {...props} />;
});

interface IProps {
  userInfo?: IDbUserInfo;
}

const TabInfo = ({ userInfo }: IProps) => {
  const [formState, setFormState] = useState({
    bio: "",
    birthDate: null,
    phoneNumber: "",
    gender: "male",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { userAddress } = useDLSContext();
  const { fetchCurrentUserDetail } = useUserInfo();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const submitValue = async () => {
    if (findUndefinedKeyInObj(formState)) {
      return setErr("All fields are required");
    }
    setErr("");
    setLoading(true);

    const formData = new FormData();
    formData.append("accountAddress", userAddress);
    formData.append("bio", formState.bio);
    formData.append("birthDate", formState.birthDate);
    formData.append("phoneNumber", formState.phoneNumber);
    formData.append("gender", formState.gender);

    try {
      await updateUserBioInfo(formData);
      await fetchCurrentUserDetail();
    } catch (err) {
      console.log("err is ", err);
      setErr(err?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userInfo) return;
    setFormState({
      bio: userInfo.bio,
      birthDate: userInfo.birthDate,
      phoneNumber: userInfo.phoneNumber,
      gender: userInfo.gender,
    });
  }, [userInfo]);

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8 }}>
            <TextField
              fullWidth
              multiline
              label="Bio"
              minRows={2}
              name="bio"
              value={formState.bio}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={
                  formState.birthDate
                    ? new Date(formState.birthDate)
                    : new Date()
                }
                showYearDropdown
                showMonthDropdown
                id="account-settings-date"
                placeholderText="MM-DD-YYYY"
                customInput={<CustomInput />}
                onChange={(date: Date) =>
                  setFormState({ ...formState, birthDate: date })
                }
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Phone"
              placeholder="(+92) 331-345345"
              name="phoneNumber"
              value={formState.phoneNumber}
              onChange={onChange}
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
                value={formState.gender}
                onChange={onChange}
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
          <Grid item xs={12}>
            <LoadingButton
              onClick={submitValue}
              variant="contained"
              sx={{ marginRight: 3.5 }}
              loading={loading}
            >
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
        {err && <Alert severity="error">{err}</Alert>}
      </form>
    </CardContent>
  );
};

export default TabInfo;
