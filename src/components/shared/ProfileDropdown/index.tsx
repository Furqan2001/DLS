import { useState } from "react";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import CustomMenuList from "../CustomMenuList";
import { UrlsList } from "../../../globals/types";

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const list = [
    { id: 1, text: "Home", link: "/" },
    // { id: 2, text: "Settings", link: UrlsList.dashboardSettings },
    { id: 3, text: "Sign Out", onClick: () => {} },
  ];

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <PersonIcon />
      </Button>
      <CustomMenuList
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        items={list}
      />
    </div>
  );
};

export default ProfileDropdown;
