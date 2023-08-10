import { Box, Button, Stack, Typography } from "@mui/joy";
import { FC } from "react";
import { Color } from "../types/colors";
import { Card } from "../types/generic";
import { BodyLine } from "./BodyLine";
import { LegalitiesTable } from "./LegalitiesTable";
import { Symbol } from "./Symbol";
import { BottomLine } from "./BottomLine";

interface DisplayCardProps {
  readonly data: Card;
  readonly addCardDisabled?: boolean;
  handleAddCard?(): void;
}

export const DisplayCard: FC<DisplayCardProps> = ({
  addCardDisabled,
  data,
  handleAddCard,
}) => {
  const { manaCost, bodyText } = data;

  return (
    <Box>
      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "4px",
          borderTop: "3px solid black",
          borderBottom: "3px solid black",
          boxShadow: "xs",
          "& > *": {
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            px: 1,
            py: 0.5,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography fontFamily="Beleren">{data.name}</Typography>
          <Stack direction="row" alignItems="center">
            {manaCost &&
              manaCost.map((x, i) => (
                <Symbol key={i} kind={x as unknown as Color} shadow />
              ))}
          </Stack>
        </Stack>
        <Typography fontFamily="Plantin" fontWeight={600}>
          {data.typeLine}
        </Typography>
        <Box>
          {bodyText.map((p, i) => (
            <BodyLine key={i} data={p} />
          ))}
          <BottomLine data={data} />
        </Box>
        <Box>
          <LegalitiesTable data={data.legalities} />
        </Box>
      </Box>
      <Button
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleAddCard}
        disabled={addCardDisabled}
      >
        Add to list
      </Button>
    </Box>
  );
};
