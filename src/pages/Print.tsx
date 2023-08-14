import {
  FC,
  useContext,
  useMemo,
} from "react";
import { BodyLine } from "../component/BodyLine";
import { ManaCost } from "../component/ManaCost";
import { CardListContext } from "../context/CardList";
import { Card } from "../types/generic";
import "./print.css";
import { BottomLine } from "../component/BottomLine";
import { Stack, Typography, styled } from "@mui/joy";
import { useFitText } from "../hooks/useFitText";

const Name = styled(Typography)({
  fontFamily: "Beleren",
  fontSize: "9.5pt",
});

const Type = styled(Typography)({
  fontFamily: "Plantin",
  fontWeight: "600",
  fontSize: "9.5pt",
  marginBottom: "4px",
});

const CardDisplay: FC<{ card: Card }> = ({ card }) => {
  const { fontSize, ref } = useFitText();

  if (card.type === "normal") {
    const { name, manaCost, bodyText, typeLine } = card.face;
    return (
      <div className="card" ref={ref}>
        <div className="topSide">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Name>{name}</Name>
            {manaCost && (
              <Stack
              direction='row'
              justifyContent="end"
              alignItems="start"
                sx={{
                  "& > .ms-cost": {
                    fontSize: "10px",
                  },
                }}
              >
                <ManaCost mana={manaCost} />
              </Stack>
            )}
          </Stack>
          <Type>{typeLine}</Type>
          {bodyText &&
          <div>
            {bodyText.map((p, i) => (
              <BodyLine
                key={i}
                slotProps={{ typography: { sx: { fontSize: `${fontSize}pt` } } }}
                data={p}
              />
            ))}
          </div>
          }
        </div>
        <div className="botSide">
          <BottomLine data={card.face} />
        </div>
      </div>
    );
  }

  const face = card.type === 'split' ? card.left : card.face;
  const back = card.type === 'split' ? card.right : card.back;


  return (
      <div className="card" ref={ref}>
        <div className="face">
        <div className="topSide">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Name>{face.name}</Name>
            {face.manaCost && (
              <Stack
              direction='row'
              justifyContent="end"
              alignItems="start"
                sx={{
                  "& > .ms-cost": {
                    fontSize: "10px",
                  },
                }}
              >
                <ManaCost mana={face.manaCost} />
              </Stack>
            )}
          </Stack>
          <Type>{face.typeLine}</Type>
          {face.bodyText &&
          <div>
            {face.bodyText.map((p, i) => (
              <BodyLine
                key={i}
                slotProps={{ typography: { sx: { fontSize: `${fontSize}pt` } } }}
                data={p}
              />
            ))}
          </div>
          }
        </div>
        <div className="botSide">
          <BottomLine data={face} />
        </div>
        </div>
        <div className="back">

        <div className="topSide">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Name>{back.name}</Name>
            {back.manaCost && (
              <Stack
              direction='row'
              justifyContent="end"
              alignItems="start"
                sx={{
                  "& > .ms-cost": {
                    fontSize: "10px",
                  },
                }}
              >
                <ManaCost mana={back.manaCost} />
              </Stack>
            )}
          </Stack>
          <Type>{back.typeLine}</Type>
          {back.bodyText &&
          <div>
            {back.bodyText.map((p, i) => (
              <BodyLine
                key={i}
                slotProps={{ typography: { sx: { fontSize: `${fontSize}pt` } } }}
                data={p}
              />
            ))}
          </div>
          }
        </div>
        <div className="botSide">
          <BottomLine data={back} />
        </div>
        </div>

      </div>


  );

};

export const Print: FC = () => {
  const { cardList } = useContext(CardListContext)!;
  const cardListUnrolled = useMemo(() => {
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
      {cardListUnrolled.map((card, i) => (
        <CardDisplay key={i} card={card} />
      ))}
    </div>
  );
};
