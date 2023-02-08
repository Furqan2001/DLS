import {
  ViewComfy as ViewComfyIcon,
  Abc as AbcIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { UrlsList } from "../types";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MilitaryTechRoundedIcon from "@mui/icons-material/MilitaryTechRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";

export const dashboardNavigation = [
  { id: 1, Icon: HomeIcon, text: "Home", link: "/" },
  {
    id: 2,
    Icon: LocationCityIcon,
    text: "Lands",
    // link: UrlsList.categoryDashboard,
  },
  {
    id: 3,
    Icon: MilitaryTechRoundedIcon,
    text: "Onwership change",
    // link: UrlsList.languageDashboard,
    admin: true,
  },
  {
    id: 3,
    Icon: SupervisorAccountRoundedIcon,
    text: "New Admin",
    // link: UrlsList.languageDashboard,
    admin: true,
  },
];
