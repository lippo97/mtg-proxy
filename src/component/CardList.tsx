import { List, ListItem, ListItemDecorator, Stack, Typography } from "@mui/joy";
import { FC } from "react";
import { Symbol } from "./Symbol";
import { NumericCounter } from "./NumericCounter";
import { Entry } from "../types/generic";
import { Updater } from "use-immer";

interface CardListProps {
  readonly data: Entry[];
  readonly setData: Updater<Entry[]>;
}

const CardListItem: FC<{
  entry: Entry;
  onIncrement(): void;
  onDecrement(): void;
}> = ({ entry, onDecrement, onIncrement }) => {
  return (
    <ListItem
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <NumericCounter
          value={entry.quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          slots={{
            box: {
              display: "inline-block",
            },
          }}
        />
        <Typography
          display="inline-block"
          level="title-md"
          fontFamily="Beleren"
        >
          {" "}
          {entry.card.name}
        </Typography>
      </Stack>
      <ListItemDecorator>
        {entry.card.type === 'Creature' ? entry.card.manaCost.map((c, i) => <Symbol key={i} kind={c} />) : ""}
      </ListItemDecorator>
    </ListItem>
  );
};

export const CardList: FC<CardListProps> = ({ data, setData }) => {
  return (
    <List>
      {data.map((entry, i) => (
        <CardListItem
          key={entry.card.name}
          entry={entry}
          onIncrement={() =>
            setData((data) => {
              data[i].quantity++;
            })
          }
          onDecrement={() =>
            setData((data) => {
              data[i].quantity--;
            })
          }
        />
      ))}
    </List>
  );
};
