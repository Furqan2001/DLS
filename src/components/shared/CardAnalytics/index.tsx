import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import CustomCard from "../CustomCard";
import LinkWrapper from "../LinkWrapper";

interface IProps {
  color?: "primary" | "secondary" | "warning";
  title: string;
  count?: number | string;
  percentage?: number;
  isLoss?: boolean;
  extra?: string;
  link?: string;
}

const CardAnalytics = ({
  color,
  title,
  count,
  percentage,
  isLoss,
  extra,
  link,
}: IProps) => (
  <CustomCard sx={{ p: 2.25 }}>
    <Stack spacing={0.5}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      {count && (
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h5" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Stack>
    {extra && (
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="textSecondary">
          You made an extra
          <Typography
            component="span"
            variant="caption"
            mx={0.5}
            sx={{ color: `${color || "primary"}.main` }}
          >
            {extra}
          </Typography>
          this year
        </Typography>
      </Box>
    )}
    {link && (
      <Box mt={1}>
        <LinkWrapper link={link} text={"Show More"} />
      </Box>
    )}
  </CustomCard>
);

export default CardAnalytics;
