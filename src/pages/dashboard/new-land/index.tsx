// ** React Imports
import React, {
  ChangeEvent,
  ElementType,
  forwardRef,
  MouseEvent,
  useState,
} from "react";
import { DOMAIN_URL, client } from "../../../@core/helpers/ipfs";

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
import LoadingButton from "../../../@core/components/shared/LoadingButton";
import { useDLSContext } from "../../../common/context/DLSContext";
import withAuth from "../../../@core/HOC/withAuth";
import AddNewLand from "../../../views/Lands/AddNewLand";

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

const NewLand = () => {
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
    plot_num: "",
    // land_complete_land_area: "",
    land_purchase_date: new Date(),
    prev_owner_cnic: "",
  });

  const { addNewLandRecord } = useDLSContext();

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

      await addNewLandRecord(added.path);

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

      <Divider />
      <CardContent>
        <AddNewLand
          formState={formState}
          onChange={onChange}
          onChangeFile={onChangeFile}
          uploadingImageStatus={uploadingImageStatus}
        />
      </CardContent>

      <CardActions>
        <LoadingButton
          onClick={handleSubmit}
          size="large"
          type="submit"
          sx={{ mr: 2 }}
          variant="contained"
          loading={uploadingImageStatus || submissionStatus}
        >
          Submit
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default withAuth(NewLand);
