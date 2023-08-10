import { parseManaCost } from "../util";
import { ParserResult, parse } from "../util/parser";
import { tokenize } from "../util/tokenizer";
import { BaseColor, Color } from "./colors";
import * as Scryfall from "./scryfall";

export type Entry = { card: Card; quantity: number };

export type ExportEntry = [ name: string, quantity: number ];

export function parseGeneric(input: Scryfall.Card): Card {
  const tokenized = tokenize(input.oracle_text);
  const parsed = parse(tokenized);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const shared: Pick<Card, 'name' | 'bodyText' | 'imageUri' | 'legalities' | 'typeLine' | 'colorIdentity'> = {
    name: input.name,
    typeLine: input.type_line,
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
    colorIdentity: input.color_identity as any,
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (input.type_line.includes("Creature")) {
    return {
      type: "Creature",
      manaCost: parseManaCost(input.mana_cost!),
      power: input.power!,
      toughness: input.toughness!,
      ...shared,
    };
  }
  if (input.type_line.includes("Planeswalker")) {
    return {
      type: "Planeswalker",
      loyalty: parseInt(input.loyalty!),
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    }
  }
  if (input.type_line.includes("Enchantment")) {
    return {
      type: 'Enchantment',
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    }
  }
  if (input.type_line.includes("Artifact")) { 
    return {
      type: 'Artifact',
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    }
  }
  if (input.type_line.includes("Sorcery")) { 
    return {
      type: 'Sorcery',
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    }
  }
  if (input.type_line.includes("Instant")) { 
    return {
      type: 'Instant',
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    }
  }
  if (input.type_line.includes("Land")) {
    return {
      type: 'Land',
      ...shared,
    }
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
  colorIdentity: BaseColor[];
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
