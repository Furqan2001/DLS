import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import ModeratorTable from "../../../views/Users/Table";
import { useEffect, useState } from "react";
import { useDLSContext } from "../../../common/context/DLSContext";
import { ROLES, SOLIDITY_ROLES_ENUM } from "../../../@core/globals/enums";

type TFilterUsers = "users" | ROLES.moderator | ROLES.admin;
const Moderators = () => {
  const [filterUsersList, setFilterUsersList] = useState<TFilterUsers>("users");
  const {
    contract,
    userAddress: currentUserAddress,
    fetchAllUsers,
  } = useDLSContext();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!contract) return;
    (async () => {
      const users = await fetchAllUsers(filterUsersList);

      const usersList = [];

      users.map((user: { userAddress: string; role: SOLIDITY_ROLES_ENUM }) => {
        if (user.userAddress !== currentUserAddress) {
          usersList.push({
            accountAddress: user.userAddress,
            role:
              user.role === SOLIDITY_ROLES_ENUM.Admin
                ? ROLES.admin
                : user.role === SOLIDITY_ROLES_ENUM.Moderator
                ? ROLES.moderator
                : ROLES.visitor,
          });
        }
      });
      setAllUsers(usersList);
    })();
  }, [contract, filterUsersList]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <Link href="https://mui.com/components/tables/" target="_blank">
            Moderators
          </Link>
        </Typography>
        <Typography variant="body2">List of all moderators</Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Grid container alignItems="center" spacing={5} sx={{ ml: 5 }}>
                <Typography variant="h5" sx={{ mt: 5 }}>
                  Filters
                </Typography>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel id="form-layouts-separator-select-label">
                      Users
                    </InputLabel>
                    <Select
                      label="Country"
                      defaultValue=""
                      id="form-layouts-separator-select"
                      labelId="form-layouts-separator-select-label"
                      value={filterUsersList}
                      onChange={(e) =>
                        setFilterUsersList(e.target.value as TFilterUsers)
                      }
                    >
                      <MenuItem value="users">All Users</MenuItem>
                      <MenuItem value="moderator">Moderators</MenuItem>
                      <MenuItem value="admin">Admins</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <ModeratorTable data={allUsers} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Moderators;
