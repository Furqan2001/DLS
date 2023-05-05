// ** React Imports
import { useState, ChangeEvent, useEffect } from "react";

// ** MUI Imports
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { IGenericColor, ILandRecord } from "../../@core/globals/types";
import { Chip } from "@mui/material";
import { IIPFSRecord } from "../../@core/globals/types";
import { getValueFromHash } from "src/@core/helpers/ipfs";
import Link from "next/link";
import { LAND_RECORD_STATUS, ROLES, URLS } from "../../@core/globals/enums";
import LoadingButton from "../../@core/components/shared/LoadingButton";
import { useRouter } from "next/router";

interface Column {
  id: "ipfsHash" | "ownerName" | "location" | "itemId" | "status" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "itemId", label: "Id", minWidth: 100 },
  { id: "ownerName", label: "Owner", minWidth: 100 },
  { id: "location", label: "Land location", minWidth: 200 },
  // { id: "ipfsHash", label: "IPFS HASH", minWidth: 200 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

interface Data {
  accountAddress: string;
  role: ROLES;
}

function createData(accountAddress: string, role: ROLES): Data {
  return { accountAddress, role };
}

const roleColorObj: IGenericColor = {
  [LAND_RECORD_STATUS.rejected]: { color: "error" },
  [LAND_RECORD_STATUS.approved]: { color: "primary" },
  [LAND_RECORD_STATUS.pending]: { color: "info" },
  [LAND_RECORD_STATUS.underChangeReview]: { color: "secondary" },
};

interface IProps {
  tableRole?: "admin" | "moderator";
  data?: ILandRecord[];
  redirectUrl: string;
}

const LandTable = ({ tableRole, data = [], redirectUrl }: IProps) => {
  // ** States
  const [page, setPage] = useState<number>(0);
  const [landRecords, setLandRecords] = useState<ILandRecord[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  // const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLandData = async (data: ILandRecord) => {
      try {
        const res = await getValueFromHash<IIPFSRecord>(
          data.ipfsHash as string
        );
        return {
          ...data,
          ownerName: res.owner_full_name,
          location: res.land_complete_location,
        } as ILandRecord;
      } catch (err) {
        console.log("err is ", err);
      }
    };

    const fetchData = async () => {
      const records: ILandRecord[] = [];

      for (let record of data) {
        const updatedRecord = await fetchLandData(record);
        if (updatedRecord !== null) {
          records.push(updatedRecord);
        }
      }

      setLandRecords(records);
    };

    fetchData();
  }, [data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openLandRecord = (ipfsHash: string, itemId: number) => {
    router.push(`${redirectUrl}/${ipfsHash}?itemId=${itemId}`);
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
            {landRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.itemId}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];

                      if (column.id === "status") {
                        return (
                          <TableCell key={column.id}>
                            <Chip
                              label={row.status}
                              color={roleColorObj[value]?.color}
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
                                openLandRecord(row.ipfsHash, row.itemId);
                              }}
                            >
                              Open
                            </LoadingButton>
                          </TableCell>
                        );
                      }
                      // console.log(column);
                      // console.log(value);
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

export default LandTable;
