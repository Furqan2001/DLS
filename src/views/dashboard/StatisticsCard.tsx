// ** React Imports
import { ReactElement, ReactNode } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Icons Imports
import TrendingUp from "mdi-material-ui/TrendingUp";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

interface IProps {
  mainTitle: string;
  description: string;
  stats: number;
  title: string;
  color?: ThemeColor;
  icon: ReactElement;
}

const renderStats = ({ color = "primary", icon, title, stats }) => {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          variant="rounded"
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: "common.white",
            backgroundColor: `${color}.main`,
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">{title}</Typography>
          <Typography variant="h6">{stats}</Typography>
        </Box>
      </Box>
    </Grid>
  );
};

const StatisticsCard = ({ mainTitle, description, ...data }: IProps) => {
  return (
    <Card>
      <CardHeader
        title={mainTitle}
        subheader={
          <Typography variant="body2">
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {description}
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
