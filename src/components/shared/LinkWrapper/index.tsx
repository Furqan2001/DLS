import { SxProps, Typography } from "@mui/material";
import Link from "next/link";

interface IProps {
  link: string;
  text: string;
  sx?: SxProps;
}

const LinkWrapper = ({ link, text, sx = {} }: IProps) => {
  return (
    <Typography
      component={Link}
      href={link}
      variant="body2"
      sx={{ color: "grey", ...sx }}
    >
      {text}
    </Typography>
  );
};

export default LinkWrapper;
