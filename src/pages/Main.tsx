import { MoreVert, Print, Save } from "@mui/icons-material";
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
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import * as Scryfall from "../api/scryfall";
import { CardList } from "../component/CardList";
import { DisplayCard } from "../component/DisplayCard";
import { Loading } from "../component/Loading";
import { CardListContext } from "../context/CardList";
import { useQueryParams } from "../hooks/useQueryParams";
import { parseGeneric } from "../types/generic";
import { decodeBase64ToData, encodeDataToBase64 } from "../util/strings";

export const Main: FC = () => {
  const [value, setValue] = useState<string | null>("Stormwing Entity");
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 300);
  const { cardList, setCardList } = useContext(CardListContext)!;
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    async function loadState(input: string) {
      // W1siU3Rvcm13aW5nIEVudGl0eSIsM10sWyJHZW5lcmFsIEZlcnJvdXMgUm9raXJpYyIsM10sWyJNeXIgQmF0dGxlc3BoZXJlIiwyXSxbIk1vdW50YWluIiwyXSxbIk5pc3NhJ3MgSnVkZ21lbnQiLDFdLFsiVGhvdWdodHNlaXplIiwzXSxbIkFqYW5pIEdvbGRtYW5lIiwxXSxbIkZvcmVzdCIsMV0sWyJCYWxtb3IsIEJhdHRsZW1hZ2UgQ2FwdGFpbiIsNF0sWyJNb25hc3RlcnkgU3dpZnRzcGVhciIsMV0sWyJUaGlyZCBQYXRoIEljb25vY2xhc3QiLDRdLFsiT3B0Iiw0XSxbIkNvbnNpZGVyIiw0XSxbIkxpZ2h0bmluZyBCb2x0IiwyXSxbIkJvc2VpanUsIFdobyBFbmR1cmVzIiwxXSxbIkJvc2VpanUsIFdobyBTaGVsdGVycyBBbGwiLDFdXQ==
      setImporting(true);
      try {
        const entries = decodeBase64ToData(input);
        const cardList = await Scryfall.importCardList(entries);
        setCardList(cardList);
      } catch (err) {
        console.error("Invalid data", data);
      } finally {
        setImporting(false);
      }
    }
    const data = queryParams.get("data");
    if (data) {
      loadState(data);
    }
  }, []);

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
    const encodedData = encodeDataToBase64(Scryfall.exportCardList(cardList));
    navigate(`?data=${encodedData}`, { replace: true });
  };

  const print = () => {
    navigate("/print");
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
          sx={(theme) => ({
            mb: 2,
            [theme.breakpoints.up("md")]: {
              display: "none",
            },
          })}
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
            {importing ? (
              <Loading slotProps={{ stack: { mt: 2 } }} />
            ) : (
              <CardList
                data={cardList}
                setData={setCardList}
                setSelected={setValue}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
