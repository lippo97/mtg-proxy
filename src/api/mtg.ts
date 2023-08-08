import { Card } from "../types/mtg";

const BASE_URL = "https://api.magicthegathering.io/v1";

interface GetCardsByNameOptions {
  readonly language?: string;
}

interface Result {
  cards: Card[];
}

export function getCardByName(name: string, options: GetCardsByNameOptions = {}): Promise<Result> {
  const queryParams = Object.entries(options)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  return fetch(`${BASE_URL}/cards?name=${name}${queryParams ? "&" + queryParams : ""}`)
    .then((x) => x.json());
}