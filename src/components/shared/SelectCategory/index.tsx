import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import useToLoadCategories from "../../../hooks/useToLoadCategories";

interface IProps extends SelectProps {
  passNameInValue?: boolean;
}

const SelectCategory = (props: IProps) => {
  const { allCategories } = useToLoadCategories();
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">
        {props.label || "Select Category"}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Category"
        {...props}
      >
        {allCategories.map((cat) => (
          <MenuItem
            key={cat.id}
            value={props.passNameInValue ? cat.name : cat.id}
          >
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCategory;
