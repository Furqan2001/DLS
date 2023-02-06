import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { LANGUAGES } from "../../../globals/constants/languages";

interface IProps extends SelectProps {}

const SelectLanguage = (props: IProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Select Language</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Language"
        {...props}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang.languageId} value={lang.symbol}>
            {lang.language} ({lang.symbol})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectLanguage;
