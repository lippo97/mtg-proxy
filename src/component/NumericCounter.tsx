import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, BoxProps, Button, Stack, Typography } from "@mui/joy";
import { FC } from "react";

interface NumericCounterProps {
  readonly value: number;
  onIncrement(): void;
  onDecrement(): void;
  slots?: {
    box: BoxProps;
  };
}

export const NumericCounter: FC<NumericCounterProps> = ({
  value,
  onDecrement,
  onIncrement,
  slots,
}) => {
  return (
    <Box display="inline-block" {...slots?.box}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          "& > button": {
            width: "10px",
            height: "10px",
            padding: 0,
            margin: 0,
            bgcolor: "inherit",
            color: "black",
            ":hover": {
              bgcolor: "unset",
            },
            ":active": {
              bgcolor: "unset",
            },
          },
        }}
      >
        <Button onClick={onDecrement}><ArrowLeft /></Button>
        <Typography level="title-lg" fontFamily="Plantin" fontWeight={600}>{value}</Typography>
        <Button onClick={onIncrement}><ArrowRight /></Button>
      </Stack>
    </Box>
  );
};
