import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, BoxProps, Button, ButtonProps, Stack, StackProps, Typography, TypographyProps } from "@mui/joy";
import { FC } from "react";

interface NumericCounterProps {
  readonly value: number;
  onIncrement(): void;
  onDecrement(): void;
  slots?: {
    box: BoxProps;
    label: TypographyProps;
    stack: StackProps;
    button: ButtonProps;
  };
}

export const NumericCounter: FC<NumericCounterProps> = ({
  value,
  onDecrement,
  onIncrement,
  slots,
}) => {

  const {sx: stackSx, ...rest} = slots?.stack ?? { sx: {} };
  return (
    <Box display="inline-block" {...slots?.box}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          "&:hover > button": {
            opacity: 1,
          },
          "& > button": {
            width: "10px",
            height: "10px",
            padding: 0,
            margin: 0,
            bgcolor: "inherit",
            // color: "black",
            opacity: 0,
            ":hover": {
              bgcolor: "unset",
            },
            ":active": {
              bgcolor: "unset",
            },
          },
          ...stackSx,
        }}
        {...rest}
      >
        <Button onClick={onDecrement} {...slots?.button}><ArrowLeft /></Button>
        <Typography level="title-lg" fontFamily="Plantin" fontWeight={600} {...slots?.label}>{value}</Typography>
        <Button onClick={onIncrement} {...slots?.button}><ArrowRight /></Button>
      </Stack>
    </Box>
  );
};
