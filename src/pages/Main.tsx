import { ContentPaste, MoreVert, Print, Save, Sort } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dropdown,
  Grid,
  IconButton,
  LinearProgress,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Modal,
  ModalClose,
  ModalOverflow,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import * as Scryfall from "../api/scryfall";
import { CardList } from "../component/CardList";
import { DisplayCard } from "../component/DisplayCard";
import { CardListContext } from "../context/CardList";
import { useQueryParams } from "../hooks/useQueryParams";
import { ExportEntry, parseGeneric } from "../types/generic";
import { parseDeckList, sortDeckList } from "../util/cards";
import { decodeBase64ToData, encodeDataToBase64 } from "../util/strings";

export const Main: FC = () => {
  const [value, setValue] = useState<string | null>(
    "Spikefield Hazard // Spikefield Cave"
  );
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 300);
  const { cardList, setCardList } = useContext(CardListContext)!;
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const [importing, setImporting] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const importTextArea = useRef<HTMLTextAreaElement>(null);

  async function loadState(entries: ExportEntry[]) {
    setTotal(entries.length);
    try {
      const cardList = await Scryfall.importCardList(entries, () =>
        setImporting((x) => (x ?? 0) + 1)
      );
      setCardList(cardList);
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(null);
    }
  }

  useEffect(() => {
    const data = queryParams.get("data");
    if (data) {
      const entries = decodeBase64ToData(data);
      loadState(entries);
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

  const sortCardList = () => {
    setCardList((list) => {
      sortDeckList(list);
    });
  };

  const importCardList = () => {
    if (importTextArea.current) {
      const a = importTextArea.current.value;
      const deck = parseDeckList(a);
      setOpenModal(false);
      loadState(deck);
    }
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
              <MenuItem onClick={() => setOpenModal(true)}>
                <ListItemDecorator>
                  <ContentPaste />
                </ListItemDecorator>{" "}
                Import
              </MenuItem>
              <MenuItem onClick={print}>
                <ListItemDecorator>
                  <Print />
                </ListItemDecorator>{" "}
                Print
              </MenuItem>
              <MenuItem onClick={sortCardList}>
                <ListItemDecorator>
                  <Sort />
                </ListItemDecorator>
                Sort
              </MenuItem>
            </Menu>
          </MenuButton>
        </Dropdown>
      </Sheet>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ModalOverflow
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="md">
            <Sheet
              variant="outlined"
              sx={{ minWidth: 400, px: 4, py: 2, mt: 2 }}
            >
              <ModalClose />
              <Typography component="h2" level="h4">
                Paste list here
              </Typography>
              <Textarea
                minRows={12}
                slotProps={{ textarea: { ref: importTextArea } }}
                sx={{ mb: 2 }}
                placeholder="4 Lightning Bolt&#10;2 Counterspell&#10;2 Mana Leak"
              ></Textarea>
              <Button onClick={importCardList}>Import</Button>
            </Sheet>
          </Container>
        </ModalOverflow>
      </Modal>
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
            {card && (
              <Box sx={{ boxShadow: "lg", borderRadius: "4.75% / 3.5%" }}>
                <img
                  src={
                    card.type === "normal" || card.type === "adventure"
                      ? card.face.imageUri.full
                      : card.type === "split"
                      ? card.left.imageUri.full
                      : card?.face.imageUri.full
                  }
                  style={{ display: "block", borderRadius: "4.75% / 3.5%" }}
                  alt="FIXME"
                />
              </Box>
            )}
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
            {importing !== null ? (
              <Box p={2}>
                <LinearProgress
                  determinate
                  value={(importing / total!) * 100}
                />
              </Box>
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
