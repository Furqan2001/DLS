import { Unstable_Grid2 as Grid, Typography } from "@mui/material";
import Link from "next/link";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../../../hooks/AuthContext";
import { UrlsList } from "../../../globals/types";

const Navbar = () => {
  const { userData } = useAuth();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ my: 2 }}
      spacing={2}
    >
      <Grid>
        <Typography
          component={Link}
          href={"/"}
          variant="h6"
          color="primary"
          sx={{ cursor: "pointer", textDecoration: "none" }}
        >
          Home
        </Typography>
      </Grid>
      <Grid>
        <Typography
          component={Link}
          href={!!userData ? UrlsList.promptDashboard : UrlsList.registration}
          variant="h6"
          color="primary"
          sx={{ cursor: "pointer", textDecoration: "none" }}
        >
          {!!userData ? "Dashboard" : "Registration"}
        </Typography>
      </Grid>

      {/* TODO:- available soon
      <Grid>
        <DarkModeIcon sx={{ cursor: "pointer" }} />
      </Grid> */}
    </Grid>
  );
};

export default Navbar;
