import { Box, Button, Stack, Typography } from "@mui/joy";
import { FC } from "react";
import { Color } from "../types/colors";
import { Card } from "../types/generic";
import { BodyLine } from "./BodyLine";
import { LegalitiesTable } from "./LegalitiesTable";
import { Symbol } from "./Symbol";

interface DisplayCardProps {
  readonly data: Card;
  handleAddCard(): void;
}

export const DisplayCard: FC<DisplayCardProps> = ({ data, handleAddCard }) => {
  const { manaCost, bodyText } = data;

  const BottomLine = () => {
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
          <Typography fontFamily="Plantin" fontWeight={600}>
            {data.power}/{data.toughness}
          </Typography>
        </Stack>
      );
    }
    return "";
  };

  return (
    <Stack direction="row">
      <Box sx={{ boxShadow: "lg", borderRadius: "4.75% / 3.5%" }}>
        <img
          src={data.imageUri.full}
          style={{ display: "block", borderRadius: "4.75% / 3.5%" }}
        />
      </Box>
      <Box maxWidth={350} py={4} px={2}>
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
            <BottomLine />
          </Box>
          <Box>
            <LegalitiesTable data={data.legalities} />
          </Box>
        </Box>
        <Button fullWidth sx={{ mt: 2 }} onClick={handleAddCard}>
          Add to list
        </Button>
      </Box>
    </Stack>
  );
};
