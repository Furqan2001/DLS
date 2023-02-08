import { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Box, Typography } from "@mui/material";
import TextWithIcon from "../shared/TextWithIcon";
import ShareIcon from "../shared/Svgs/Share";
import RiskStatusAlert from "../shared/RiskStatusAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "#2C2C2C",
    fontWeight: 400,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#272727",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fff",
  "&:nth-of-type(even)": {
    backgroundColor: "#F4F9FF",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface IProps {
  setOpen: () => void;
  icon: ReactNode;
  balance?: string;
  addr?: string;
  riskStatus: string;
}

const BalanceTableRow = ({
  setOpen,
  icon,
  balance,
  addr,
  riskStatus,
}: IProps) => {
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <TextWithIcon
          textStyle={{ fontSize: 14 }}
          endIcon={<ShareIcon />}
          text="uniswap"
        />
      </StyledTableCell>
      <StyledTableCell align="left">
        <TextWithIcon
          icon={icon}
          textStyle={{ fontSize: 14 }}
          endIcon={<ShareIcon />}
          text={<Typography mx={1}>{addr}</Typography>}
        />
      </StyledTableCell>
      <StyledTableCell align="left">{balance || "..."}</StyledTableCell>
      <StyledTableCell align="left">
        <Box sx={{ cursor: "pointer" }} onClick={setOpen}>
          <RiskStatusAlert
            color={riskStatus as "red" | "green" | "yellow"}
            text={riskStatus.toUpperCase()}
          />
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default BalanceTableRow;
