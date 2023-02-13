import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EthereumIcon from "../shared/Svgs/EthereumIcon";
import { Box } from "@mui/material";
import TextWithIcon from "../shared/TextWithIcon";
import SearchFilter from "./BalanceTableFilter/SearchFilter";
import BalanceTableRow from "./BalanceTableRow";
import DataFilter from "./BalanceTableFilter/DataFilter";
import RiskModal from "./RiskModal";
import TableWrapper from "../shared/TableWrapper";
import CustomCard from "../shared/CustomCard";
import { useState } from "react";

const balanceTableHeading = [
  { key: "admin_name", heading: "Admin name" },
  { key: "transaction_id", heading: "transaction id" },
  { key: "owner_cnic", heading: "owner cnic" },
];

const data = [
  {
    admin_name: "M Ahmed",
    transaction_id: "0xfffff",
    owner_cnic: "31304",
  },
];

const MainScreen = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box mb={2}>
        <SearchFilter />
      </Box>
      <CustomCard>
        <TableWrapper
          actionColumn
          actionColumnConfig={{
            actionButtons: [{ type: "link", onClick: () => {} }],
          }}
          columns={balanceTableHeading}
          rows={data}
        />
      </CustomCard>
      <Box>
        <DataFilter />
      </Box>
      <RiskModal open={open} setClose={() => setOpen(false)} />
    </Box>
  );
};

export default MainScreen;
