import { Box } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
  leftIcon: ReactNode;
  rightIcon: ReactNode;
}

const CombineIcons = ({ leftIcon, rightIcon }: IProps) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box>{leftIcon}</Box>
      <Box ml={-1}>{rightIcon}</Box>
    </Box>
  );
};

export default CombineIcons;
