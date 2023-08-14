import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box, List, ListItem, Stack, Typography } from "@mui/joy";
import { FC, useCallback } from "react";
import { Updater } from "use-immer";
import { useDebounceEffect } from "../hooks/useDebounceEffect";
import { BaseColor, Color } from "../types/colors";
import { Entry } from "../types/generic";
import { ArrowButton } from "./ArrowButton";
import { Symbol } from "./Symbol";

interface CardListProps {
  readonly data: Entry[];
  readonly setData: Updater<Entry[]>;
  setSelected(name: string): void;
}

function calcBg(colors: BaseColor[]): string {
  if (colors.length > 1) {
    return "rgb(244, 212, 36)";
  }
  if (colors.length === 0) {
    return "rgba(210, 210, 210, 1)";
  }
  switch (colors[0]) {
    case "U":
      return "#529cf0";
    case "W":
      return "rgb(223, 213, 173)";
    case "B":
      return "#888888";
    case "R":
      return "#E64934";
    case "G":
      return "#26714A";
  }
}

const CardListItem: FC<{
  entry: Entry;
  onIncrement(): void;
  onDecrement(): void;
  onRemove(): void;
  setSelected(name: string): void;
}> = ({ entry, onDecrement, onIncrement, onRemove, setSelected }) => {
  useDebounceEffect(entry.quantity, 1000, (qty) => {
    if (qty === 0) {
      onRemove();
    }
  });

  const renderManaCost = useCallback((manaCost: Color[] | undefined) => {
    return (
      manaCost && manaCost.map((c, i) => <Symbol key={i} kind={c} shadow />)
    );
  }, []);

  const Separator = () => (
    <Box
      sx={{
        fontFamily: "Beleren",
        fontWeight: 600,
        fontSize: "1rem",
        margin: "0 4px",
      }}
    >
      //
    </Box>
  );

  const ManaCost = () => {
    if (entry.card.type === "normal") {
      return renderManaCost(entry.card.face.manaCost);
    }
    if (entry.card.type === "split") {
      return (
        <>
          <div className="cost-left">
            {renderManaCost(entry.card.left.manaCost)}
          </div>
          <Separator />
          <div className="cost-right">
            {renderManaCost(entry.card.right.manaCost)}
          </div>
        </>
      );
    }
    return (
      <>
        <div>{renderManaCost(entry.card.face.manaCost)}</div>
        <Separator />
        <div>{renderManaCost(entry.card.back.manaCost)}</div>
      </>
    );
  };

  return (
    <ListItem
      sx={{
        "--ListItem-paddingLeft": 0,
        "--ListItem-paddingRight": 0,
        "--ListItem-paddingY": 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        mb: "1px",
        "&:last-of-type": {
          mb: 0,
        },
        ...(entry.quantity === 0 && {
          opacity: "30%",
        }),
      }}
    >
      <ArrowButton onClick={onDecrement}>
        <ArrowLeft />
      </ArrowButton>
      <Box
        sx={{
          display: "flex",
          justifyContent: "stretch",
          background: "black",
          padding: "2px",
          transform: "translateX(10px)",
          marginLeft: "-10px",
          zIndex: -100,
          borderRadius: "10px / 20px",
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Typography
          level="title-md"
          fontFamily="Beleren"
          textAlign="center"
          sx={{
            border: "1px solid white",
            borderRight: 0,
            color: "white",
            margin: 0,
            pl: 2,
            pr: 1.5,
            py: 0,
            width: "20px",
            lineHeight: "34px",
            borderRadius: "10px / 20px",
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // pl: '15px',
            "&::after": {
              content: '" "',
              width: "10px",
            },
          }}
        >
          {entry.quantity}
        </Typography>
      </Box>
      <Stack
        flex={1}
        direction="row"
        bgcolor={calcBg(entry.card.colorIdentity)}
        borderRadius="10px / 20px"
        px="2px"
        py="2px"
      >
        <Stack
          flex={1}
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
          border="2px solid black"
          borderRadius="10px / 20px"
          bgcolor="rgba(255,255,255,0.8)"
          boxShadow="inset 1px -2px 2px rgba(0,0,0,0.75),inset -1px 3px 2px rgba(255,255,255,1)"
          px={1}
        >
          <Typography
            display="inline-block"
            level="title-md"
            fontFamily="Beleren"
            component="a"
            href="#"
            onClick={() => setSelected(entry.card.name)}
            sx={{ textDecoration: "none" }}
          >
            {" "}
            {entry.card.name}
          </Typography>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="end"
            alignItems="center"
          >
            <ManaCost />
          </Stack>
        </Stack>
      </Stack>
      <ArrowButton onClick={onIncrement}>
        <ArrowRight />
      </ArrowButton>
    </ListItem>
  );
};

export const CardList: FC<CardListProps> = ({ data, setData, setSelected }) => {
  return (
    <List sx={{}}>
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
              data[i].quantity = Math.max(data[i].quantity - 1, 0);
            })
          }
          onRemove={() => {
            setData((data) => {
              data.splice(i, 1);
            });
          }}
          setSelected={setSelected}
        />
      ))}
    </List>
  );
};
