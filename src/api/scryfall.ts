import axios from "axios";
import { Card } from "../types/scryfall";

interface Catalog {
  object: string;
  total_values: number;
  data: string[];
}

export function getAutocomplete(query: string): Promise<Catalog> {
  return axios.get(`https://api.scryfall.com/cards/autocomplete?q=${query}`)
    .then(x => x.data);
}

type GetCardByNameQuery = 
| { exact: string; fuzzy?: never }
| { exact?: never; fuzzy: string };

export function getCardByName(query: GetCardByNameQuery): Promise<Card> {
  const queryParams = Object.entries(query)
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");
  return axios.get(`https://api.scryfall.com/cards/named?${queryParams}`)
    .then(x => x.data);
}