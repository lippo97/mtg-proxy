import { Box, Stack, Typography } from "@mui/joy";
import { FC, useMemo } from "react";
import { Color } from "../types/colors";
import { Card } from "../types/scryfall";
import { parseManaCost } from "../util";
import { parse } from "../util/parser";
import { tokenize } from "../util/tokenizer";
import { BodyLine } from "./BodyLine";
import { LegalitiesTable } from "./LegalitiesTable";
import { Symbol } from "./Mana";

interface DisplayCardProps {
	readonly data: Card;
}

export const DisplayCard: FC<DisplayCardProps> = ({ data }) => {
	const manas = data.mana_cost ? parseManaCost(data.mana_cost) : undefined;
	const parsed = useMemo(() => {
		const tokens = tokenize(data.oracle_text);
		const parsed = parse(tokens);
		return parsed;
	}, [data]);

	const BottomLine = () => {
		if (data.type_line.includes("Planeswalker")) {
			return (
				<Stack direction="row" justifyContent="flex-end">
					<span
						className={`ms ms-loyalty ms-loyalty-start ms-loyalty-${data.loyalty!}`}
					/>
				</Stack>
			);
		}
		if (data.type_line.includes("Creature")) {
			return (
				<Stack direction="row" justifyContent="flex-end">
					<Typography fontFamily="Plnatin">
						{data.power!}/{data.toughness!}
					</Typography>
				</Stack>
			);
		}
		return "";
	};

	return (
		<Stack direction="row">
			<Box sx={{ boxShadow: "lg", borderRadius: "4.75% / 3.5%" }}>
				<img
					src={data.image_uris.normal}
					style={{ display: "block", borderRadius: "4.75% / 3.5%" }}
				/>
			</Box>
			<Box maxWidth={350} py={4} px={2}>
				<Box
					sx={{
						border: "1px solid rgba(0,0,0,0.1)",
						borderRadius: "4px",
						borderTop: "3px solid black",
						borderBottom: "3px solid black",
						boxShadow: "xs",
						"& > *": {
							borderBottom: "1px solid rgba(0,0,0,0.1)",
							px: 1,
							py: 0.5,
						},
					}}
				>
					<Stack direction="row" justifyContent="space-between">
						<Typography fontFamily="Beleren">{data.name}</Typography>
						<Stack direction="row" alignItems="center">
							{manas &&
								manas.map((x, i) => (
									<Symbol key={i} kind={x as unknown as Color} shadow />
								))}
						</Stack>
					</Stack>
					<Typography fontFamily="Plantin" fontWeight={600}>
						{data.type_line}
					</Typography>
					<Box>
						{parsed.map((p) => (
							<BodyLine data={p} />
						))}
						<BottomLine />
					</Box>
					<Box>
						<LegalitiesTable data={data.legalities} />
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};
