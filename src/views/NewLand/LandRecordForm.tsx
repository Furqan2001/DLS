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
import { Alert, Box, styled } from "@mui/material";
import LoadingButton from "../../@core/components/shared/LoadingButton";
import { useDLSContext } from "../../common/context/DLSContext";
import withAuth from "../../@core/HOC/withAuth";
import LandDetails from "../Lands/LandDetails";
import { client, DOMAIN_URL } from "../../@core/helpers/ipfs";
import { IIPFSRecord } from "../../@core/globals/types";
import { URLS } from "../../@core/globals/enums";
import { useRouter } from "next/router";

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

interface IProps {
  form?: "transferLandOwnership" | "newRecord";
  formState?: IIPFSRecord;
  itemId?: string;
  ipfsHash?: string;
}

const NewLand = ({
  form = "newRecord",
  formState: defaultFormState,
  itemId,
  ipfsHash,
}: IProps) => {
  const router = useRouter();

  const [uploadingImageStatus, setuploadingImageStatus] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [err, setErr] = useState("");
  const [formState, setFormState] = useState<IIPFSRecord>(
    defaultFormState || {
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
    }
  );

  const { addNewLandRecord, transferLandOwnership, contractErr } =
    useDLSContext();

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
      if (key !== "prev_owner_cnic" && formState[key] === "")
        return setErr("all fields are required");
    }
    if (fileUrl === "") return setErr("certificate is required");

    const dataObj = { ...formState, certificate: fileUrl };

    if (form === "transferLandOwnership") {
      dataObj.previous_onwers_hashes = formState?.previous_onwers_hashes
        ? [...formState?.previous_onwers_hashes, ipfsHash]
        : [ipfsHash];
    }

    const data = JSON.stringify(dataObj);
    setSubmissionStatus(true);
    try {
      const added = await client.add(data);

      if (form === "newRecord") await addNewLandRecord(added.path);
      else {
        // transfer ownership
        await transferLandOwnership(itemId, added.path);
      }

      setSubmissionStatus(false);
      router.push(`${URLS.allLands}`);

      // setTimeout(() => {
      //   window.location.href = URLS.allLands;
      // }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeDate = (date: Date) => {
    setFormState({ ...formState, land_purchase_date: date });
  };

  const pageHeading = !transferLandOwnership
    ? "Add New Land"
    : "Transfer ownership";

  return (
    <Card>
      <CardHeader
        title={pageHeading}
        titleTypographyProps={{ variant: "h6" }}
      />

      <Divider />
      <CardContent>
        <LandDetails
          formState={{ ...formState, certificate: "" }}
          onChangeDate={onChangeDate}
          onChange={onChange}
          onChangeFile={onChangeFile}
          uploadingImageStatus={uploadingImageStatus}
        />
      </CardContent>

      <CardActions>
        <Box>
          <LoadingButton
            onClick={handleSubmit}
            size="large"
            type="submit"
            sx={{ mr: 2 }}
            variant="contained"
            loading={uploadingImageStatus || submissionStatus}
          >
            {form === "transferLandOwnership"
              ? "Transfer land ownership"
              : "Submit"}
          </LoadingButton>
          <Typography mt={2} fontSize={12}>
            It will take approx 2-3 mins, so please wait after pressing the
            button.
          </Typography>
        </Box>
        {formState?.certificate && (
          <a
            target="_blank"
            rel="noreferrer"
            href={formState?.certificate}
            style={{ marginLeft: 10 }}
          >
            Check Certificate
          </a>
        )}
      </CardActions>
      {err && <Alert color="error">{err}</Alert>}
      {contractErr && <Alert color="error">{contractErr}</Alert>}
    </Card>
  );
};

export default NewLand;
