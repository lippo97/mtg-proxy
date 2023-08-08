import { parseManaCost } from "../util";
import { ParserResult, parse } from "../util/parser";
import { tokenize } from "../util/tokenizer";
import { Color } from "./colors";
import * as Scryfall from "./scryfall";

export type Entry = { card: Card; quantity: number };

export function parseGeneric(input: Scryfall.Card): Card {
  const tokenized = tokenize(input.oracle_text);
  const parsed = parse(tokenized);

  const shared: Pick<Card, 'name' | 'bodyText' | 'imageUri' | 'legalities'> = {
    name: input.name,
    bodyText: parsed,
    legalities: Object.entries(input.legalities)
      .map(([k, v]) => [k, v === 'legal'] as [string, boolean])
      .reduce((prev, [k, legality]) => ({
        ...prev,
        [k]: legality,
      }), {}) as any,
    imageUri: {
      art: input.image_uris.art_crop,
      full: input.image_uris.normal,
    },
  }

  if (input.type_line.includes("Creature")) {
    return {
      type: "Creature",
      typeLine: input.type_line,
      manaCost: parseManaCost(input.mana_cost!),
      power: input.power!,
      toughness: input.toughness!,
      ...shared,
    };
  }
  throw new Error("not implemented yet");
}

export type Card = (
  | Creature
  | Enchantment
  | Artifact
  | Sorcery
  | Instant
  | Land
  | Planeswalker
) &
  Shared;

interface Shared {
  name: string;
  typeLine: string;
  imageUri: {
    art: string;
    full: string;
  };
  bodyText: ParserResult;
  legalities: {
    standard: boolean;
    future: boolean;
    historic: boolean;
    gladiator: boolean;
    pioneer: boolean;
    explorer: boolean;
    modern: boolean;
    legacy: boolean;
    pauper: boolean;
    vintage: boolean;
    penny: boolean;
    commander: boolean;
    oathbreaker: boolean;
    brawl: boolean;
    historicbrawl: boolean;
    alchemy: boolean;
    paupercommander: boolean;
    duel: boolean;
    oldschool: boolean;
    premodern: boolean;
    predh: boolean;
  }
}

export interface Creature {
  type: "Creature";
  manaCost: Color[];
  power: string;
  toughness: string;
}

export interface Enchantment {
  type: "Enchantment";
  manaCost: Color[];
}

export interface Artifact {
  type: "Artifact";
  manaCost: Color[];
}

export interface Land {
  type: "Land";
  manaCost?: never;
}

export interface Instant {
  type: "Instant";
  manaCost: Color[];
}

export interface Sorcery {
  type: "Sorcery";
  manaCost: Color[];
}

export interface Planeswalker {
  type: "Planeswalker";
  manaCost: Color[];
  loyalty: number;
}
