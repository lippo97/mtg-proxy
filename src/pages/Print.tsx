import { Box, Stack, Typography, styled } from "@mui/material";
import { FC, useContext, useMemo } from "react";
import { BodyLine } from "../component/BodyLine";
import { ManaCost } from "../component/ManaCost";
import { CardListContext } from "../context/CardList";
import { Card } from "../types/generic";
import useFitText from "use-fit-text";
import "./print.css";

const Name = styled(Typography)({
  fontFamily: "Beleren",
  fontSize: "9.5pt",
});

const Type = styled(Typography)({
  fontFamily: "Plantin",
  fontWeight: "600",
  fontSize: "9.5pt",
});

const CardDisplay: FC<{ card: Card }> = ({ card }) => {
  const { name, manaCost, bodyText, typeLine } = card;
  const { fontSize, ref } = useFitText({maxFontSize: 95, minFontSize: 60});

  return (
    <div className="card" ref={ref}>
      <Stack direction="row" justifyContent="space-between" alignItems="end">
        <Name>{name}</Name>
        {manaCost && (
          <Box
            sx={{
              "& > .ms-cost": {
                fontSize: "10px",
              },
            }}
          >
            <ManaCost mana={manaCost} />
          </Box>
        )}
      </Stack>
      <Type>{typeLine}</Type>
      <div>
        {bodyText.map((p, i) => (
          <BodyLine key={i} slotProps={{ typography: {sx: {fontSize}} }} data={p} />
        ))}
      </div>
    </div>
  );
};

export const Print: FC = () => {
  const { cardList } = useContext(CardListContext)!;

  const aa = useMemo(() => {
    const result: Card[] = [];
    for (const { card, quantity } of cardList) {
      for (let i = 0; i < quantity; i++) {
        result.push(card);
      }
    }
    return result;
  }, [cardList]);

  return (
    <div className="page">
      {aa.map((card, i) => (
        <CardDisplay key={i} card={card} />
      ))}
    </div>
  );
};
