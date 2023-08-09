import { FolderOpen, MoreVert, Print, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Container,
  Dropdown,
  Grid,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Typography,
} from "@mui/joy";
import { FC, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
import { useLocation } from "wouter";
import * as Scryfall from "../api/scryfall";
import { CardList } from "../component/CardList";
import { DisplayCard } from "../component/DisplayCard";
import { CardListContext } from "../context/CardList";
import { parseGeneric } from "../types/generic";

export const Main: FC = () => {
  const [value, setValue] = useState<string | null>("Stormwing Entity");
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 300);
  const {cardList, setCardList} = useContext(CardListContext)!;
  const [, setLocation] = useLocation();

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
  }, [cardQuery.data]);

  const handleAddCard = () => {
    setCardList((cards) => {
      if (card) {
        const existing = cards.find((x) => x.card.name === card.name);
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
  };

  const saveState = () => {
    localStorage.setItem("cardList", JSON.stringify(cardList));
  };

  const loadState = () => {
    const s = localStorage.getItem("cardList");
    if (s) {
      const items = JSON.parse(s);
      if (items) {
        setCardList(items);
      }
    }
  };

  const print = () => {
    setLocation("/print");
    // goto print page;
  };

  const addCardDisabled = cardList.some((x) => x.card.name === card?.name);

  return (
    <>
      <Sheet
        variant="solid"
        color="primary"
        invertedColors
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          mb: 2,
          gap: 4,
        }}
      >
        <Typography fontFamily="Beleren" level="title-md">
          MTG-Proxy
        </Typography>

        <Autocomplete
          options={autocompleteQuery.data?.data ?? []}
          filterOptions={(x) => x}
          autoComplete
          getOptionLabel={(x) => x}
          onChange={(_, updated) => {
            setValue(updated);
          }}
          onInputChange={(_, updated) => setInputValue(updated)}
          sx={(theme) => ({
            width: "500px",
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          })}
        />

        <Dropdown>
          <MenuButton slots={{ root: IconButton }} slotProps={{}}>
            <MoreVert sx={{ fontSize: "24px" }} />
            <Menu placement="bottom-end">
              <MenuItem onClick={saveState}>
                <ListItemDecorator>
                  <Save />
                </ListItemDecorator>{" "}
                Save list
              </MenuItem>
              <MenuItem onClick={loadState}>
                <ListItemDecorator>
                  <FolderOpen />
                </ListItemDecorator>{" "}
                Load list
              </MenuItem>
              <MenuItem onClick={print}>
                <ListItemDecorator>
                  <Print />
                </ListItemDecorator>{" "}
                Print
              </MenuItem>
            </Menu>
          </MenuButton>
        </Dropdown>
      </Sheet>
      <Container>
        <Autocomplete
          options={autocompleteQuery.data?.data ?? []}
          filterOptions={(x) => x}
          autoComplete
          getOptionLabel={(x) => x}
          onChange={(_, updated) => {
            setValue(updated);
          }}
          onInputChange={(_, updated) => setInputValue(updated)}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid xs={12} md={3}>
            <Box sx={{ boxShadow: "lg", borderRadius: "4.75% / 3.5%" }}>
              <img
                src={card?.imageUri.full}
                style={{ display: "block", borderRadius: "4.75% / 3.5%" }}
              />
            </Box>
          </Grid>
          <Grid xs={12} md={3}>
            {cardQuery.status === "success" && card && (
              <DisplayCard
                data={card}
                handleAddCard={handleAddCard}
                addCardDisabled={addCardDisabled}
              />
            )}
          </Grid>
          <Grid xs={12} md={6}>
            <CardList
              data={cardList}
              setData={setCardList}
              setSelected={setValue}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
