import Grid from "@mui/material/Grid";
import { Card, CardHeader, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import Table from "../../../views/moderatorsAndAdmin/Table";

const Moderators = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <Link href="https://mui.com/components/tables/" target="_blank">
            Admins
          </Link>
        </Typography>
        <Typography variant="body2">List of all admins</Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="List" titleTypographyProps={{ variant: "h6" }} />
          <Table tableRole="admin" />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Moderators;
