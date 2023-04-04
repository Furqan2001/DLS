import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import ModeratorTable from "../../../views/Users/Table";
import { useEffect, useState } from "react";
import { useDLSContext } from "../../../common/context/DLSContext";
import withAuth from "../../../@core/HOC/withAuth";
import { ILandRecord } from "../../../@core/globals/types";
import LandTable from "../../../views/Lands/Table";
import {
  GET_ALL_LAND_RECORD_STATUS,
  LAND_RECORD_STATUS,
  ROLES,
  URLS,
} from "../../../@core/globals/enums";
import LandDetailWrapper from "../../../views/Lands/LandDetailWrapper";

const Lands = () => {
  return <LandDetailWrapper />;
};

export default withAuth(Lands);
