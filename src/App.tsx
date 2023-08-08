import { Autocomplete, Box, Container, List, ListItem, Stack } from "@mui/joy";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
import * as Scryfall from "./api/scryfall";
import { DisplayCard } from "./component/DisplayCard";
import { CardList } from "./component/CardList";

export const App: FC = () => {
	const [value, setValue] = useState<string | null>("Stormwing Entity");
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue] = useDebounce(inputValue, 300);

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

	return (
		<Container>
			<Stack direction="column" spacing={2}>
				<Autocomplete
					options={autocompleteQuery.data?.data ?? []}
					filterOptions={(x) => x}
					autoComplete
					getOptionLabel={(x) => x}
					onChange={(_, updated) => {
						setValue(updated);
					}}
					onInputChange={(_, updated) => setInputValue(updated)}
				/>
				<Stack direction="row">
					<Box flex={2}>
						{cardQuery.status === "success" && <DisplayCard data={cardQuery.data} />}
					</Box>
					<Box flex={1}>
						<CardList data={[]} />
					</Box>
				</Stack>
			</Stack>
		</Container>
	);
};
