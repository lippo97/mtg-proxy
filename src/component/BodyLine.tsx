import { FC } from "react";
import { ParsedToken, ParserResult } from "../util/parser";
import { Stack, TypographyProps } from "@mui/joy";
import { Symbol } from "./Symbol";
import { CardTypography } from "./CardTypography";

interface BodyLineProps {
  readonly data: ParserResult[number];
  readonly slots?: {
    typography?: React.ElementType;
  }
  readonly slotProps?: {
    typography?: TypographyProps;
  }
}

export const BodyLine: FC<BodyLineProps> = ({ data, slots, slotProps }) => {
  const T = slots?.typography ?? CardTypography;
  const Typography = (props: TypographyProps) => ( <T {...props} {...slotProps?.typography} />) ;
  const Chunk: FC<{ data: ParsedToken }> = ({ data }) => {
    if (data.type === "text") {
      return <span>{data.value}</span>;
    }
    if (data.type === "symbol") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <Symbol kind={data.value as any} />;
    }
    if (data.type === "comma") {
      return ", ";
    }
    if (data.type === 'colon') {
      return ':';
    }
  };

  const Text: FC<{ data: ParsedToken[] }> = ({ data }) =>
    data.map((d, i) => <Chunk key={i} data={d} />);

  if (data.type === "planeswalker") {
    const loyaltyClass =
      data.loyalty > 0
        ? "ms-loyalty-up"
        : data.loyalty === 0
        ? "ms-loyalty-zero"
        : "ms-loyalty-down";
    return (
      <Stack direction="row" spacing={0.5}>
        <abbr
          className={`ms ${loyaltyClass} ms-loyalty-${Math.abs(data.loyalty)}`}
        />
        <Typography>: </Typography>
        <Typography sx={{ pt: "2px" }}>
          <Text data={data.value} />
        </Typography>
      </Stack>
    );
  }
  if (data.type === "activate") {
    return (
      <Typography>
        {data.cost
          .map<React.ReactNode>((token, i) => <Chunk key={i} data={token} />)
          .reduce((prev, curr) => [
            prev,
            <span className="comma">, </span>,
            curr,
          ])}
        :{" "}<Text data={data.value} />
        {data.explanation &&
          <Typography fontStyle="italic">
            {" "}
            (<Text data={data.explanation} />)
          </Typography>
        }
      </Typography>
    );
  }

  if (data.type === "keyword") {
    return (
      <>
        <Typography>
          <Text data={data.value} />
          <Typography fontStyle="italic">
            {" "}
            (<Text data={data.explanation} />)
          </Typography>
        </Typography>
      </>
    );
  }

  if (data.type === "reminder") {
    return (
      <Typography fontStyle="italic">
        (<Text data={data.value} />)
      </Typography>
    );
  }

  return (
    <Typography>
      <Text data={data.value} />
    </Typography>
  );
};
