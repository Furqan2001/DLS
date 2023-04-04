import { ChangeEvent, useEffect, useState } from "react";
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
import { useDLSContext } from "../../../common/context/DLSContext";
import withAuth from "../../../@core/HOC/withAuth";
import { ILandRecord } from "../../../@core/globals/types";
import LandTable from "../../../views/Lands/Table";
import { GET_ALL_LAND_RECORD_STATUS, URLS } from "../../../@core/globals/enums";
import { DOMAIN_URL, client } from "../../../@core/helpers/ipfs";

const NewOwnership = () => {
  const [filterUsersList, setFilterUsersList] = useState("all");
  const { getAllLandRecords } = useDLSContext();
  const [landRecords, setLandRecords] = useState<ILandRecord[]>([]);

  useEffect(() => {
    (async () => {
      const res = (await getAllLandRecords(
        GET_ALL_LAND_RECORD_STATUS.approved
      )) as ILandRecord[];

      setLandRecords(res);
    })();
  }, [getAllLandRecords, filterUsersList]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <Link href="#">
            Lands Records
          </Link>
        </Typography>
        <Typography variant="body2">List of all land records</Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Grid container alignItems="center" spacing={4} sx={{ ml: 0 }}>
                <Typography variant="h6" sx={{ mt: 5 }}>
                  Filters
                </Typography>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="form-layouts-separator-select-label">
                      Land Filters
                    </InputLabel>
                    <Select
                      label="Country"
                      defaultValue=""
                      id="form-layouts-separator-select"
                      labelId="form-layouts-separator-select-label"
                      value={filterUsersList}
                      onChange={(e) => setFilterUsersList(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <LandTable data={landRecords} redirectUrl={URLS.newOwnerships} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default withAuth(NewOwnership);
