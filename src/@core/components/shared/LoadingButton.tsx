import { ButtonProps, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface IProps extends ButtonProps {
  loading?: boolean;
  text?: string;
}

const LoadingButton = ({ loading, children, text, ...restProps }: IProps) => {
  return (
    <Button disabled={loading} variant="contained" {...restProps}>
      {text || children}
      {loading && (
        <CircularProgress color="secondary" sx={{ ml: 2 }} size={20} />
      )}
    </Button>
  );
};

export default LoadingButton;
