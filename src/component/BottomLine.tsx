import { Stack, Typography } from "@mui/joy";
import { FC } from "react";
import { Card } from "../types/generic";

interface BottomLineProps {
  readonly data: Card;
}

export const BottomLine: FC<BottomLineProps> = ({ data }) => {
  if (data.type === "Planeswalker") {
    return (
      <Stack direction="row" justifyContent="flex-end">
        <span
          className={`ms ms-loyalty ms-loyalty-start ms-loyalty-${data.loyalty!}`}
        />
      </Stack>
    );
  }
  if (data.type === "Creature") {
    return (
      <Stack direction="row" justifyContent="flex-end">
        <Typography fontFamily="Plantin" fontWeight={600} letterSpacing="1px">
          {data.power}/{data.toughness}
        </Typography>
      </Stack>
    );
  }
};
