// ** React Imports
import { ReactNode } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Footer Content Component
import FooterContent from "./FooterContent";

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
  footerContent?: (props?: any) => ReactNode;
}

const Footer = (props: Props) => {
  // ** Props
  const { settings, footerContent: userFooterContent } = props;

  // ** Hook
  const theme = useTheme();

  // ** Vars
  const { contentWidth } = settings;

  return (
    <Box
      component="footer"
      className="layout-footer"
      sx={{
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    ></Box>
  );
};

export default Footer;
