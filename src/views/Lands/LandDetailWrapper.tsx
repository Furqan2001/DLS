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
import ModeratorTable from "../../views/Users/Table";
import { useEffect, useState } from "react";
import { useDLSContext } from "../../common/context/DLSContext";
import withAuth from "../../@core/HOC/withAuth";
import { ILandRecord } from "../../@core/globals/types";
import LandTable from "../../views/Lands/Table";
import {
  GET_ALL_LAND_RECORD_STATUS,
  LAND_RECORD_STATUS,
  URLS,
} from "../../@core/globals/enums";

interface IProps {
  allLandRecords?: ILandRecord[];
  hideFilter?: boolean;
}

const LandDetailWrapper = ({ allLandRecords, hideFilter }: IProps) => {
  const [filterUsersList, setFilterUsersList] =
    useState<GET_ALL_LAND_RECORD_STATUS>(GET_ALL_LAND_RECORD_STATUS.all);
  const { getAllLandRecords } = useDLSContext();
  const [landRecords, setLandRecords] = useState<ILandRecord[]>([]);

  useEffect(() => {
    if (allLandRecords) return setLandRecords(allLandRecords);

    (async () => {
      console.log("landRecords ", filterUsersList);
      const res = (await getAllLandRecords(filterUsersList)) as ILandRecord[];

      setLandRecords(res);
    })();
  }, [allLandRecords, getAllLandRecords, filterUsersList]);

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
              <>
                {!hideFilter && (
                  <Grid
                    container
                    alignItems="center"
                    spacing={5}
                    sx={{ ml: 5 }}
                  >
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
                          onChange={(e) =>
                            setFilterUsersList(
                              e.target.value as GET_ALL_LAND_RECORD_STATUS
                            )
                          }
                        >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </>
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <LandTable data={landRecords} redirectUrl={URLS.allLands} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default LandDetailWrapper;
