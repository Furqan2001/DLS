import { useState } from "react";
import { Box, Grid, styled, Typography } from "@mui/material";
import SearchInput from "../../shared/SearchInput";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TextWithIcon from "../../shared/TextWithIcon";
import EthereumIcon from "../../shared/Svgs/EthereumIcon";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),

    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const toggleMenuOptions = [
  {
    value: "eth",
    children: <TextWithIcon icon={<EthereumIcon />} text="Eth" />,
  },
  {
    value: "addr",
    children: <Typography>0xBAD7...E116</Typography>,
  },
];

const BalanceTableFilter = () => {
  const [selectedToggleMenu, setSelectedToggleMenu] = useState("addr");

  const onChangeToggleMenu = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setSelectedToggleMenu(newAlignment);
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{ flexDirection: { md: "column", lg: "row" } }}
    >
      <Grid item xs={12} lg={3} my={1}>
        <Typography
          variant="h6"
          sx={{ textAlign: { xs: "center", md: "start" } }}
        >
          Approved Land requests
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        my={1}
        lg={9}
        container
        alignItems="center"
        sx={{ justifyContent: { xs: "center", lg: "flex-end" } }}
      >
        <Grid item>
          <SearchInput
            sx={{ bgcolor: "common.white" }}
            inputSx={{ height: 30 }}
          />
        </Grid>
        <Grid item sx={{ ml: 2, my: { xs: 1, md: 0 } }}>
          <StyledToggleButtonGroup
            size="small"
            value={selectedToggleMenu}
            exclusive
            onChange={onChangeToggleMenu}
            aria-label="text alignment"
            sx={{ borderRadius: 22, background: "#E0EEFF" }}
          >
            {toggleMenuOptions.map((menu) => (
              <ToggleButton
                value={menu.value}
                aria-label="left aligned"
                key={menu.value}
                style={{
                  background:
                    selectedToggleMenu === menu.value
                      ? "#CBE1FF"
                      : "transparent",
                  borderRadius: 22,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
                sx={{ px: 2, height: 38, color: "#6C6C6C" }}
              >
                {menu.children}
              </ToggleButton>
            ))}
          </StyledToggleButtonGroup>
        </Grid>
        <Grid item>
          <Box
            sx={{
              background: "#CBE1FF",
              p: 1,
              borderRadius: 25,
              width: 25,
              height: 25,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ml: 1,
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BalanceTableFilter;
