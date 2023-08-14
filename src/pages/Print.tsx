import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BodyLine } from "../component/BodyLine";
import { ManaCost } from "../component/ManaCost";
import { CardListContext } from "../context/CardList";
import { CardFace } from "../types/generic";
import "./print.css";
import { BottomLine } from "../component/BottomLine";
import { Stack, Typography, styled } from "@mui/joy";

const Name = styled(Typography)({
  fontFamily: "Beleren",
  fontSize: "9.5pt",
  // marginBottom: "2px",
});

const Type = styled(Typography)({
  fontFamily: "Plantin",
  fontWeight: "600",
  fontSize: "9.5pt",
  marginBottom: "4px",
});

function useFitText2(): {
  ref: React.RefObject<HTMLDivElement>;
  fontSize: number;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(9.5);

  useEffect(() => {
    const isOverflow =
      !!ref.current &&
      (ref.current.scrollHeight > ref.current.offsetHeight);
    if (isOverflow) {
      setFontSize(x => x - 0.5);
    }
  }, [ref, fontSize]);
  return { ref, fontSize };
}

const CardDisplay: FC<{ card: CardFace }> = ({ card }) => {
  const { name, manaCost, bodyText, typeLine } = card;
  // const { fontSize, ref } = useFitText({ maxFontSize: 95, minFontSize: 60 });
  const { fontSize, ref } = useFitText2();

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
        <div>
          {bodyText.map((p, i) => (
            <BodyLine
              key={i}
              slotProps={{ typography: { sx: { fontSize: `${fontSize}pt` } } }}
              data={p}
            />
          ))}
        </div>
      </div>
      <div className="botSide">
        <BottomLine data={card} />
      </div>
    </div>
  );
};

export const Print: FC = () => {
  const { cardList } = useContext(CardListContext)!;

  const cardListUnrolled = useMemo(() => {
    const result: CardFace[] = [];
    for (const { card, quantity } of cardList) {
      for (let i = 0; i < quantity; i++) {
        result.push(card);
      }
    }
    return result;
  }, [cardList]);

  // const MemoCard = React.memo(CardDisplay);

  return (
    <div className="page">
      {cardListUnrolled.map((card, i) => (
        <CardDisplay key={i} card={card} />
      ))}
    </div>
  );
};
