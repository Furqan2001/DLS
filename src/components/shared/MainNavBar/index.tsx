import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ProfileDropdown from "../ProfileDropdown";

const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          background: "white",
          boxShadow: "0px 1px 10px rgba(132, 132, 132, 0.07)",
          px: 8,
        }}
        elevation={0}
        position="static"
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DLS
          </Typography>
          <Box ml="auto">
            <ProfileDropdown />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
