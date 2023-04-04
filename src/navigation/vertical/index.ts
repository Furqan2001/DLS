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
import { ROLES } from "../../@core/globals/enums";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Dashboard",
      //@ts-ignore
      icon: HomeOutline,
      path: "/dashboard",
      role: ROLES.admin,
    },
    {
      sectionTitle: "Users",
      role: ROLES.admin,
    },
    {
      title: "Users",
      //@ts-ignore
      icon: AddModeratorOutlinedIcon,
      path: "/dashboard/users",
      openInNewTab: true,
      role: ROLES.admin,
    },
    {
      sectionTitle: "Lands",
      role: [ROLES.admin, ROLES.moderator],
    },
    {
      title: "Lands",
      //@ts-ignore
      icon: LocationCityIcon,
      path: "/dashboard/lands",
      role: [ROLES.admin, ROLES.visitor, ROLES.moderator],
    },
    {
      title: "Add Land",
      //@ts-ignore
      icon: AddLocationAltIcon,
      path: "/dashboard/new-land",
      role: ROLES.moderator,
    },
    {
      title: "Transfer land ownership",
      //@ts-ignore
      icon: ForwardToInboxIcon,
      path: "/dashboard/new-ownership",
      role: ROLES.moderator,
    },
    {
      sectionTitle: "Account Settings",
      role: [ROLES.admin, ROLES.moderator, ROLES.visitor],
    },
    {
      title: "Account Settings",
      //@ts-ignore
      icon: AccountCogOutline,
      path: "/dashboard/account-settings",
      role: [ROLES.admin, ROLES.visitor, ROLES.moderator],
    },
  ];
};

export default navigation;
