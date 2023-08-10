import { CircularProgress, CircularProgressProps, Stack, StackProps } from "@mui/joy";
import { FC } from "react";

interface LoadingProps {
  slotProps?: {
    stack?: StackProps;
    circularProgress?: CircularProgressProps;
  }
}

export const Loading: FC<LoadingProps> = ({ slotProps }) => (
  <Stack flex={1} justifyContent="center" alignItems="center" {...slotProps?.stack}>
    <CircularProgress {...slotProps?.circularProgress} />
  </Stack>
)