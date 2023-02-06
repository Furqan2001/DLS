import { ReactNode } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SxProps,
} from "@mui/material";
import Link from "next/link";

interface IProps {
  icon?: string | ReactNode;
  text: string | ReactNode;
  sx?: SxProps;
  endIcon?: string | ReactNode;
  onClick?: () => void;
  textStyle?: SxProps;
  link?: string;
  linkColor?: "primary" | "secondary";
  iconSx?: SxProps;
}

const TextWithIcon = ({
  icon,
  text,
  sx = {},
  onClick,
  iconSx,
  endIcon,
  textStyle,
  linkColor = "primary",
  link,
}: IProps) => {
  const optionalProps = link ? { component: Link, href: link } : {};
  return (
    <List
      sx={{
        textDecoration: "none",
        color: !linkColor
          ? undefined
          : linkColor === "primary"
          ? "primary.main"
          : "secondary.main",
        ...sx,
      }}
      {...optionalProps}
    >
      <ListItem disablePadding>
        {icon && <ListItemIcon sx={iconSx}>{icon}</ListItemIcon>}
        <ListItemText sx={textStyle} primary={text} />
        {endIcon && <ListItemIcon sx={iconSx}>{endIcon}</ListItemIcon>}
      </ListItem>
    </List>
  );
};

export default TextWithIcon;
