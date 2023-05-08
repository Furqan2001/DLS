// ** React Imports
import { ReactNode, useEffect, useState } from "react";

// ** Next Imports
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Components
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Collapse from "@mui/material/Collapse";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Link as Scroll } from "react-scroll";
import { styled } from "@mui/material/styles";
import { ILandRecord } from "src/@core/globals/types";
import LandTable from "src/views/Lands/Table";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";
import { useDLSContext } from "../common/context/DLSContext";
import { GET_ALL_LAND_RECORD_STATUS, URLS } from "../@core/globals/enums";
import themeConfig from "src/configs/themeConfig";
import Logo from "../@core/components/shared/svgs/Logo";

interface State {
  password: string;
  showPassword: boolean;
}

// ** Styled Components
const HeaderBox = styled(Box)<BoxProps>({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Nunito",
  minHeight: "100vh",
  height: "100vh",
  backgroundImage: `url(/images/background-landing.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
});

const ScrollButton = styled(IconButton)<IconButtonProps>({
  marginTop: "15px",
  transition: "0.2s linear",
  "&:hover": {
    background: "#fff",
  },
});

const SearchButton = styled(SearchIcon)({
  "&:hover": {
    color: "purple",
    transform: "translateY(-2px)",
  },
});

// const LinkStyled = styled("a")(({ theme }) => ({
//   fontSize: "0.875rem",
//   textDecoration: "none",
//   color: theme.palette.primary.main,
// }));

// const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
//   ({ theme }) => ({
//     "& .MuiFormControlLabel-label": {
//       fontSize: "0.875rem",
//       color: theme.palette.text.secondary,
//     },
//   })
// );

const LandingPage = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true);
  }, []);
  const [loading, setLoading] = useState(false);
  const [showLandTable, setShowLandTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [landRecords, setLandRecords] = useState<ILandRecord[]>([]);
  const { getOwnerLandRecords, getAllLandRecords } = useDLSContext();

  const handleSubmit = async () => {
    if (loading) return;
    setShowLandTable(false);
    setLoading(true);
    console.log(searchTerm);
    const res = (await getOwnerLandRecords(searchTerm)) as ILandRecord[];
    console.log(res);
    setLandRecords(res);

    setLoading(false);
    setShowLandTable(true);
  };

  return (
    <Box sx={{}}>
      <HeaderBox>
        <AppBar sx={{ background: "none", position: "absolute" }} elevation={0}>
          <Toolbar sx={{ width: "80%", margin: "10px auto" }}>
            <Box sx={{ mt: 2, zoom: 1.2 }}>
              <Logo />
            </Box>
            <Typography
              variant="h1"
              sx={{
                ml: 3,
                flexGrow: 1,
                lineHeight: 1,
                color: "#fff",
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "2.2rem !important",
              }}
            >
              {themeConfig.templateName}
            </Typography>
            <IconButton
              sx={{
                transition: "0.1s linear",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => router.push("/login")}
            >
              <LoginIcon sx={{ color: "#fff", fontSize: "2rem" }} />
              <Typography
                variant="h6"
                sx={{ ml: 2, color: "#fff", fontWeight: 600 }}
              >
                Login
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h1" sx={{ color: "#fff", fontSize: "4rem" }}>
              Welcome to DLS
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mt: 8,
                color: "#fff",
                fontSize: "4rem",
                margin: "auto",
                width: "80%",
              }}
            >
              A Blockchain based Land Records Management System
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 14,
                color: "#fff",
                fontSize: "4rem",
              }}
            >
              Check Your Land Records
            </Typography>

            <Scroll to="land-records" smooth={true}>
              <ScrollButton>
                <ExpandMoreIcon sx={{ color: "#4f30b8", fontSize: "4rem" }} />
              </ScrollButton>
            </Scroll>
          </Box>
        </Collapse>
      </HeaderBox>

      <Box id="land-records" sx={{ height: "60vh", textAlign: "center" }}>
        <Container maxWidth="md" sx={{ mt: 20 }}>
          <TextField
            id="search"
            type="search"
            placeholder="Enter your cnic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 800, background: "#fff" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchButton
                    sx={{ cursor: "pointer", transition: "0.1s linear" }}
                    onClick={handleSubmit}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Container>

        <Container maxWidth="lg" sx={{ mt: 10 }}>
          {loading && <CircularProgress color="secondary" />}

          {showLandTable && landRecords.length ? (
            <LandTable data={landRecords} redirectUrl={URLS.allLands} />
          ) : null}

          {showLandTable && !landRecords.length && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <SentimentVeryDissatisfiedIcon fontSize="large" />
              <Typography variant="h5" sx={{ fontSize: "4rem" }}>
                No Land Records Found
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

LandingPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default LandingPage;
