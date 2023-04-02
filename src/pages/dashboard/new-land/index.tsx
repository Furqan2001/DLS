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
import { Alert, Box, styled } from "@mui/material";
import LoadingButton from "../../../@core/components/shared/LoadingButton";
import { useDLSContext } from "../../../common/context/DLSContext";
import withAuth from "../../../@core/HOC/withAuth";
import LandDetails from "../../../views/Lands/LandDetails";
import LandRecordForm from "../../../views/NewLand/LandRecordForm";
import { ROLES } from "../../../@core/globals/enums";

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

const NewLandWrapper = () => {
  return <LandRecordForm />;
};

export default withAuth(NewLandWrapper, ROLES.moderator);
