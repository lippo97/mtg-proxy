import { Autocomplete, Box, Container, Stack } from "@mui/joy";
import { FC, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
import * as Scryfall from "./api/scryfall";
import { CardList } from "./component/CardList";
import { DisplayCard } from "./component/DisplayCard";
import { useImmer } from "use-immer";
import { Entry, parseGeneric } from "./types/generic";

export const App: FC = () => {
  const [value, setValue] = useState<string | null>("Stormwing Entity");
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 300);
  const [cardList, setCardList] = useImmer<Entry[]>([]);

  const autocompleteQuery = useQuery(
    ["autocomplete", debouncedValue],
    () => Scryfall.getAutocomplete(debouncedValue),
    {
      enabled: debouncedValue.length >= 2,
    }
  );

  const cardQuery = useQuery(
    ["card", value],
    () => Scryfall.getCardByName({ exact: value! }),
    {
      enabled: value != null,
    }
  );

  const card = useMemo(() => {
    if (cardQuery.data) {
      return parseGeneric(cardQuery.data);
    }
  }, [cardQuery.data])

  const handleAddCard = () =>
    setCardList((cards) => {
      if (card) {
        const existing = cards.find(x => x.card.name === card.name);
        if (existing) {
          existing.quantity++;
        } else {
          cards.push({
            quantity: 1,
            card: card,
          });
        }
      }
    });

  return (
    <Container>
      <Stack direction="column" spacing={2}>
        <Autocomplete
          options={autocompleteQuery.data?.data ?? []}
          filterOptions={(x) => x}
          autoComplete
          getOptionLabel={(x) => x}
          onChange={(_, updated) => {
            setValue(updated);
          }}
          onInputChange={(_, updated) => setInputValue(updated)}
        />
        <Stack direction="row">
          <Box flex={2}>
            {cardQuery.status === "success" && card && (
              <DisplayCard
                data={card}
                handleAddCard={handleAddCard}
              />
            )}
          </Box>
          <Box flex={1}>
            <CardList data={cardList} setData={setCardList} />
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};
