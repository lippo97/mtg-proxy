import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, BoxProps, Button } from "@mui/joy";
import { FC } from "react";

interface NumericCounterProps {
  readonly value: number;
  setValue(updated: number): void;
  slots?: {
    box: BoxProps
  }
}

export const NumericCounter: FC<NumericCounterProps> = ({ value, setValue, slots }) => {
  const decrement = () => setValue(value - 1);
  const increment = () => setValue(value + 1);

  return (
    <Box {...slots?.box} sx={{
      '& > button': {
        width: '10px',
        height: '10px',
        ':hover': {
          bgcolor: 'unset'
        }
      }
    }}>
      <Button onClick={decrement}><ArrowLeft /></Button>
      <span>{value}</span>
      <Button onClick={increment}><ArrowRight /></Button>
    </Box>
  );
};