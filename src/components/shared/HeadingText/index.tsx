import { SxProps, Typography, TypographyProps } from "@mui/material";
import { ElementType, ReactNode } from "react";

interface IProps extends TypographyProps {
  text1: string | ReactNode;
  secondaryText?: string | ReactNode;
  text2?: string | ReactNode;
  secondarySx?: SxProps;
  component?: any;
}

const HeadingText = ({
  text1,
  secondaryText,
  text2,
  variant = "h4",
  secondarySx = {},
  component,
  ...restProps
}: IProps) => {
  return (
    <Typography component={component as any} {...restProps} variant={variant}>
      {text1}
      <Typography
        sx={{ mx: 1, ...secondarySx }}
        color="secondary"
        component="span"
        variant={variant}
      >
        {secondaryText}
      </Typography>
      {text2}
    </Typography>
  );
};

export default HeadingText;
