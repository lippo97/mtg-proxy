import { FC } from "react"
import { Legalities } from "../types/scryfall"
import { Stack, Chip, Typography } from "@mui/joy";
import { capitalize } from "../util/strings";

interface LegalitiesTableProps {
  readonly data: Legalities
}

export const LegalitiesTable: FC<LegalitiesTableProps> = ({ data }) => {
  const renderLegality = (l: keyof Legalities) => (
    <Stack direction="row" spacing={1}>
      <Chip
        variant="solid"
        size="sm"
        color={data[l] === "legal" ? "success" : "neutral"}
        sx={{ width: '100px', maxWidth: 'unset' }}
        slotProps={{
          label: {
            style: {
              flexGrow: 0,
              marginBottom: -4
            }
          }
        }}
      >
        {data[l].replace("_", " ").toUpperCase()}
      </Chip>
      <Typography fontFamily="Plantin">{capitalize(l)}</Typography>
    </Stack>
  );
  return (
    <Stack spacing={1} sx={{ fontFamily: "Plantin" }} py={2}>
      {renderLegality("standard")}
      {renderLegality("pioneer")}
      {renderLegality("modern")}
      {renderLegality("legacy")}
      {renderLegality("vintage")}
      {renderLegality("commander")}
    </Stack>
  );
}