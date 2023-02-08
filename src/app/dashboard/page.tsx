"use client";
import { Box } from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";
import MainScreen from "../../components/MainScreen";

const Dashbaord = () => {
  return (
    <DashboardLayout childrenCardBg>
      <Box>
        <MainScreen />
      </Box>
    </DashboardLayout>
  );
};

export default Dashbaord;
