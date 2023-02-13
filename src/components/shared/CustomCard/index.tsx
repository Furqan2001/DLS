import { Card, CardProps } from "@mui/material";

interface IProps extends CardProps {}

const CustomCard = ({ children, sx = {}, ...restProps }: IProps) => {
  return (
    <Card
      sx={{
        py: 1,
        px: 2,
        boxShadow: "0px 1px 10px rgba(74, 74, 74, 0.07)",
        ...sx,
      }}
      {...restProps}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
