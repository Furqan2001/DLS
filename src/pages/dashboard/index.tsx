// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Icons Imports
import Poll from "mdi-material-ui/Poll";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";
import BriefcaseVariantOutline from "mdi-material-ui/BriefcaseVariantOutline";

// ** Custom Components Imports
import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Demo Components Imports
import Table from "src/views/dashboard/Table";
import Trophy from "src/views/dashboard/Trophy";
import TotalEarning from "src/views/dashboard/TotalEarning";
import StatisticsCard from "src/views/dashboard/StatisticsCard";
import WeeklyOverview from "src/views/dashboard/WeeklyOverview";
import DepositWithdraw from "src/views/dashboard/DepositWithdraw";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, Card, CardContent } from "@mui/material";
import LandDetailWrapper from "../../views/Lands/LandDetailWrapper";
import withAuth from "../../@core/HOC/withAuth";

const Dashboard = () => {
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <StatisticsCard
            stats={"40"}
            mainTitle="All Admins"
            description="Stats about total number of registered admins in this platform"
            title="Total Admins"
            icon={<AdminPanelSettingsIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard
            stats={"40"}
            mainTitle="All Moderators"
            description="Stats about total number of registered moderators in this platform"
            title="Total moderators"
            icon={<AdminPanelSettingsIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard
            stats={"40"}
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
          <LandDetailWrapper hideFilter />
        </CardContent>
      </Card>
    </Box>
  );
};

export default withAuth(Dashboard);
