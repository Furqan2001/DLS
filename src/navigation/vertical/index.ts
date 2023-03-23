// ** Icon imports
import Login from "mdi-material-ui/Login";
import Table from "mdi-material-ui/Table";
import CubeOutline from "mdi-material-ui/CubeOutline";
import HomeOutline from "mdi-material-ui/HomeOutline";
import FormatLetterCase from "mdi-material-ui/FormatLetterCase";
import AccountCogOutline from "mdi-material-ui/AccountCogOutline";
import CreditCardOutline from "mdi-material-ui/CreditCardOutline";
import AccountPlusOutline from "mdi-material-ui/AccountPlusOutline";
import AlertCircleOutline from "mdi-material-ui/AlertCircleOutline";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,
      path: "/dashboard",
    },
    {
      title: "Account Settings",
      icon: AccountCogOutline,
      path: "/dashboard/account-settings",
    },
    {
      sectionTitle: "Users",
    },
    {
      title: "Users",
      icon: AddModeratorOutlinedIcon,
      path: "/dashboard/users",
      openInNewTab: true,
    },
    {
      sectionTitle: "Lands",
    },
    {
      title: "Lands",
      icon: LocationCityIcon,
      path: "/dashboard/lands",
    },
    {
      title: "Add Land",
      icon: AddLocationAltIcon,
      path: "/dashboard/new-land",
    },
    {
      title: "Transfer land ownership",
      icon: ForwardToInboxIcon,
      path: "/dashboard/new-ownership",
    },
    // {
    //   title: "Cards",
    //   icon: CreditCardOutline,
    //   path: "/dashboard/cards",
    // },
    // {
    //   title: "Tables",
    //   icon: Table,
    //   path: "/dashboard/tables",
    // },
    // {
    //   icon: CubeOutline,
    //   title: "Form Layouts",
    //   path: "/dashboard/form-layouts",
    // },
  ];
};

export default navigation;
