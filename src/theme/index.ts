import { createTheme } from "@mui/material";

import {
  Palette as MuiPallete,
  PaletteOptions as MuiPaletteOptions,
} from "@mui/material/styles/createPalette";

const theme = createTheme({
  palette: {
    background: {
      default: "#f7f4f2ff",
    },
    colors: {
      darkblue: "#364570ff",
      lightgreen: "#9cbec6ff",
    },
  },
});

declare module "@mui/material/styles" {
  interface Theme {}
  // allow configuration using `createTheme`
  interface ThemeOptions {}
}

declare module "@mui/material/styles/createPalette" {
  interface Palette extends MuiPallete {
    colors: { darkblue: string; lightgreen: string };
  }

  //@ts-ignore
  interface PaletteOptions extends MuiPaletteOptions {
    colors: { darkblue: string; lightgreen: string };
  }
}

export default theme;
