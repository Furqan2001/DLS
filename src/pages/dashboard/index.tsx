// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Demo Components Imports
import StatisticsCard from "src/views/dashboard/StatisticsCard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, Card, CardContent } from "@mui/material";
import LandDetailWrapper from "../../views/Lands/LandDetailWrapper";
import withAuth from "../../@core/HOC/withAuth";
import { useDLSContext } from "../../common/context/DLSContext";
import { useCallback, useEffect, useState } from "react";
import { ILandRecord } from "../../@core/globals/types";
import { GET_ALL_LAND_RECORD_STATUS, ROLES } from "../../@core/globals/enums";
import { getRole } from "../../@core/helpers";

const Dashboard = () => {
  const { getAllLandRecords, fetchAllUsers } = useDLSContext();
  const [allAdmins, setAllAdmins] = useState(0);
  const [allModerators, setAllModerators] = useState(0);
  const [landRecords, setLandRecords] = useState<ILandRecord[]>([]);
  useEffect(() => {
    (async () => {
      const res = await getAllLandRecords(GET_ALL_LAND_RECORD_STATUS.all);

      setLandRecords(res);
    })();
  }, [getAllLandRecords]);

  useEffect(() => {
    (async () => {
      try {
        const users = await fetchAllUsers("users");
        console.log("users ", users);
        let totalAdmins = 0,
          totalModerators = 0;

        users.map((user) => {
          if (getRole(user.role) === ROLES.admin) {
            totalAdmins++;
          } else if (getRole(user.role) === ROLES.moderator) {
            totalModerators++;
          }
        });

        setAllAdmins(totalAdmins);
        setAllModerators(totalModerators);
      } catch (err) {
        console.log("err ", err);
      }
    })();
  }, [fetchAllUsers]);

  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <StatisticsCard
            stats={allAdmins}
            mainTitle="All Admins"
            description="Stats about total number of registered admins in this platform"
            title="Total Admins"
            icon={<AdminPanelSettingsIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard
            stats={allModerators}
            mainTitle="All Moderators"
            description="Stats about total number of registered moderators in this platform"
            title="Total moderators"
            icon={<AdminPanelSettingsIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard
            stats={landRecords?.length}
            mainTitle="All  Lands"
            description="Stats about total number of lands in this platform"
            title="Total lands"
            icon={<AdminPanelSettingsIcon />}
            color="info"
          />
        </Grid>
      </Grid>
      <Card sx={{ mt: 10 }}>
        <CardContent>
          <LandDetailWrapper hideFilter allLandRecords={landRecords} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default withAuth(Dashboard, ROLES.admin);
