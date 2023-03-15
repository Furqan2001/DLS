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

const Moderators = () => {
  const [filterUsersList, setFilterUsersList] = useState("all");
  const {} = useDLSContext();
  const [allUsers, setAllUsers] = useState([]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <Link href="https://mui.com/components/tables/" target="_blank">
            Lands
          </Link>
        </Typography>
        <Typography variant="body2">List of all land records</Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Grid container alignItems="center" spacing={5} sx={{ ml: 5 }}>
                <Typography variant="h5" sx={{ mt: 5 }}>
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
          <ModeratorTable data={allUsers} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Moderators;
