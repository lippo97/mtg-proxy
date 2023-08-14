import { Box, Button, Stack, Typography } from "@mui/joy";
import { FC, useMemo } from "react";
import { Color } from "../types/colors";
import { Card } from "../types/generic";
import { BodyLine } from "./BodyLine";
import { BottomLine } from "./BottomLine";
import { LegalitiesTable } from "./LegalitiesTable";
import { Symbol } from "./Symbol";

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
  const Front = useMemo(() => {
    const src = data.type === "split" ? data.left : data.face;
    const { manaCost, bodyText, name, type } = src;
    return (
      <Box className={`card-face card-face-${data.type} card-face-front`}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontFamily="Beleren">{name}</Typography>
          <Stack direction="row" alignItems="center">
            {manaCost &&
              manaCost.map((x, i) => (
                <Symbol key={i} kind={x as unknown as Color} shadow />
              ))}
          </Stack>
        </Stack>
        <Typography fontFamily="Plantin" fontWeight={600}>
          {type}
        </Typography>
        {bodyText && (
          <Box>
            {bodyText.map((p, i) => (
              <BodyLine key={i} data={p} />
            ))}
          </Box>
        )}
        <BottomLine data={src} />
      </Box>
    );
  }, [data]);

  const Back = useMemo(() => {
    if (data.type === "normal") return;
    const src = data.type === "split" ? data.right : data.back;
    const { manaCost, bodyText, name, type } = src;
    return (
      <Box className={`card-face card-face-${data.type} card-face-back`}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontFamily="Beleren">{name}</Typography>
          <Stack direction="row" alignItems="center">
            {manaCost &&
              manaCost.map((x, i) => (
                <Symbol key={i} kind={x as unknown as Color} shadow />
              ))}
          </Stack>
        </Stack>
        <Typography fontFamily="Plantin" fontWeight={600}>
          {type}
        </Typography>
        {bodyText && (
          <Box>
            {bodyText.map((p, i) => (
              <BodyLine key={i} data={p} />
            ))}
          </Box>
        )}
        <BottomLine data={src} />
      </Box>
    );
  }, [data]);

  return (
    <Box>
      <Stack
        alignItems="stretch"
        sx={{
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "4px",
          borderTop: "3px solid black",
          borderBottom: "3px solid black",
          boxShadow: "xs",
          "& > *:not(.card-face)": {
            px: 1,
            py: 0.5,
          },
          ".card-face > *": {
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            px: 1,
            py: 0.5,
          },
          ".card-face-front:not(.card-face-normal) > *:last-child": {
            borderBottom: 0,
          },
          ".card-face-back:not(.card-face-normal) > *:first-child": {
            borderTop: "3px solid black",
            borderRadius: "xs",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        {Front}
        {Back}
        <Box>
          <LegalitiesTable data={data.legalities} />
        </Box>
      </Stack>
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
