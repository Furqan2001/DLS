import {
  Box,
  Container,
  CssBaseline,
  Typography,
  CircularProgress,
} from "@mui/material";

const LoadingScreen = ({ text = "Please wait ..." }) => {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography textAlign="center" component="h1" variant="h5">
          {text}
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingScreen;
