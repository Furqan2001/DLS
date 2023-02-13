import { Box } from "@mui/material";

interface IProps {
  text: string;
  color?: "red" | "green" | "yellow";
}

const colors = {
  red: {
    background: "rgba(202,13,13, 0.2)",
    color: "error.main",
    "&:hover": {
      background: "rgba(202,13,13, 0.2)",
    },
  },
  green: {
    background: "rgba(40, 202, 13, 0.15)",
    color: "rgb(40, 202, 13)",
    "&:hover": {
      background: "rgba(40, 202, 13, 0.15)",
    },
  },
  yellow: {
    background: "rgba(248, 255, 168, 0.5)",
    color: "#C7B40E",
    "&:hover": {
      background: "rgba(248, 255, 168, 0.5)",
    },
  },
};

const RiskStatusAlert = ({ text, color = "red" }: IProps) => {
  return (
    <Box
      sx={{
        borderRadius: 30,
        width: 100,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...colors[color],
      }}
    >
      {text}
    </Box>
  );
};

export default RiskStatusAlert;
