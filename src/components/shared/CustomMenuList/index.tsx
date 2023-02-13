import React, { ReactNode, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { Typography } from "@mui/material";

interface IProps {
  items: {
    text: string;
    id: string | number;
    icon?: React.ReactNode;
    link?: string;
    onClick?: () => void;
  }[];
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
}

const CustomMenuList = ({ items, open, anchorEl, handleClose }: IProps) => {
  return (
    <div>
      
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem key={item.id} onClick={handleClose} disableRipple>
            {item.link ? (
              <Link style={{ textDecoration: "none" }} href={item.link}>
                {item.icon}
                <Typography color="primary"> {item.text}</Typography>
              </Link>
            ) : (
              <Typography onClick={item.onClick}>
                {item.icon}
                {item.text}
              </Typography>
            )}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default CustomMenuList;
