import { FC } from "react"
import { Legalities } from "../types/scryfall"
import { Stack, Chip, Typography } from "@mui/joy";
import { capitalize } from "../util/strings";
import { Card } from "../types/generic";

interface LegalitiesTableProps {
  readonly data: Card['legalities']
}

export const LegalitiesTable: FC<LegalitiesTableProps> = ({ data }) => {
  const renderLegality = (l: keyof Legalities) => (
    <Stack direction="row" spacing={1}>
      <Chip
        variant="solid"
        size="sm"
        color={data[l] ? "success" : "neutral"}
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
        {data[l] ? 'Legal' : 'Not legal'}
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