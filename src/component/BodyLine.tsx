import { FC } from "react";
import { ParsedToken, ParserResult } from "../util/parser";
import { Stack } from "@mui/joy";
import { Symbol } from "./Mana";
import { CardTypography } from "./CardTypography";

interface BodyLineProps {
	readonly data: ParserResult[number];
}

export const BodyLine: FC<BodyLineProps> = ({ data }) => {
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
				<CardTypography sx={{ pt: "2px" }}>
					: <Text data={data.value} />
				</CardTypography>
			</Stack>
		);
	}
	if (data.type === "activate") {
		return (
			<CardTypography>
				{data.cost
					.map<React.ReactNode>((token, i) => <Chunk key={i} data={token} />)
					.reduce((prev, curr) => [
						prev,
						<span className="comma">, </span>,
						curr,
					])}{" "}
				:<Text data={data.value} />
			</CardTypography>
		);
	}

	if (data.type === "keyword") {
		return (
			<>
				<CardTypography>
					<Text data={data.value} />
					<CardTypography fontStyle="italic">
						{" "}
						(<Text data={data.explanation} />)
					</CardTypography>
				</CardTypography>
			</>
		);
	}

	if (data.type === "reminder") {
		return (
			<CardTypography fontStyle="italic">
				(<Text data={data.value} />)
			</CardTypography>
		);
	}

	return (
		<CardTypography>
			<Text data={data.value} />
		</CardTypography>
	);
};
