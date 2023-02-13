"use client";
import Setting from "../../../components/Settings";
import DashboardLayout from "../../../layouts/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout heading="Settings">
      <Setting />
    </DashboardLayout>
  );
};

export default SettingsPage;
