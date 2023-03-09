// ** React Imports
import { useState, ChangeEvent } from "react";

// ** MUI Imports
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { IGenericColor } from "../../@core/globals/types";
import { Chip } from "@mui/material";
import Link from "next/link";
import { URLS } from "../../@core/globals/enums";
import LoadingButton from "../../@core/components/shared/LoadingButton";
import { useRouter } from "next/router";

type accountStatus = "requested" | "approved" | "voting" | "rejected";

interface Column {
  id: "name" | "email" | "accountAddress" | "status" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "accountAddress", label: "Account Address", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

interface Data {
  accountAddress: string;
  status: accountStatus;
}

function createData(accountAddress: string, status: accountStatus): Data {
  return { accountAddress, status };
}

const statusObj: IGenericColor = {
  voting: { color: "info" },
  rejected: { color: "error" },
  approved: { color: "primary" },
  requested: { color: "success" },
};

interface IProps {
  tableRole?: "admin" | "moderator";
  data?: { accountAddress: string; status: accountStatus }[];
}

const Table = ({ tableRole, data = [] }: IProps) => {
  // ** States
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const router = useRouter();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openModeratorInfo = (accountAddress: string) => {
    if (tableRole === "admin") {
      return router.push(`${URLS.adminDetails}/${accountAddress}`);
    }
    router.push(`${URLS.moderatorDetails}/${accountAddress}`);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.accountAddress}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];

                      if (column.id === "status") {
                        return (
                          <TableCell key={column.id}>
                            <Chip
                              label={row.status}
                              color={statusObj[value]?.color}
                              sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                textTransform: "capitalize",
                                "& .MuiChip-label": { fontWeight: 500 },
                              }}
                            />
                          </TableCell>
                        );
                      } else if (column.id === "actions") {
                        return (
                          <TableCell key={column.id}>
                            <LoadingButton
                              style={{ color: "white" }}
                              sx={{ color: "white" }}
                              size="small"
                              onClick={() => {
                                openModeratorInfo(row.accountAddress);
                              }}
                            >
                              Open
                            </LoadingButton>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Table;
