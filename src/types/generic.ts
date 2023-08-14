import { parseManaCost } from "../util";
import { ParserResult, parse } from "../util/parser";
import { tokenize } from "../util/tokenizer";
import { BaseColor, Color } from "./colors";
import * as Scryfall from "./scryfall";

export type Entry = { card: Card; quantity: number };

export type ExportEntry = [name: string, quantity: number];

type ParseIn = Omit<Scryfall.CardBase, "image_uris"> & {
  image_uris?: Scryfall.CardBase["image_uris"];
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseFace(input: ParseIn): CardFace {
  const tokenized = tokenize(input.oracle_text);
  const parsed = parse(tokenized);
  const shared: any = {
    name: input.name,
    bodyText: parsed,
    ...(input.image_uris
      ? {
          imageUri: {
            art: input.image_uris!.art_crop,
            full: input.image_uris!.normal,
          },
        }
      : {}),
  };

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
    };
  }
  if (input.type_line.includes("Enchantment")) {
    return {
      type: "Enchantment",
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    };
  }
  if (input.type_line.includes("Artifact")) {
    return {
      type: "Artifact",
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    };
  }
  if (input.type_line.includes("Sorcery")) {
    return {
      type: "Sorcery",
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    };
  }
  if (input.type_line.includes("Instant")) {
    return {
      type: "Instant",
      manaCost: parseManaCost(input.mana_cost!),
      ...shared,
    };
  }
  if (input.type_line.includes("Land")) {
    return {
      type: "Land",
      ...shared,
    };
  }
  throw new Error("Illegal state");
}

export function parseGeneric(input: Scryfall.Card): Card {
  const shared: Pick<
    Card,
    "name" | "typeLine" | "legalities" | "colorIdentity"
  > = {
    name: input.name,
    typeLine: input.type_line,
    legalities: Object.entries(input.legalities)
      .map(([k, v]) => [k, v === "legal"] as [string, boolean])
      .reduce(
        (prev, [k, legality]) => ({
          ...prev,
          [k]: legality,
        }),
        {}
      ) as any,
    colorIdentity: input.color_identity as any,
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
  if (input.layout === "normal") {
    const parsed = parseFace(input);
    return {
      type: "normal",
      face: parsed,
      ...shared,
    };
  }
  if (input.layout === "split") {
    const left = parseFace({...input.card_faces[0], image_uris: input.image_uris});
    const right = parseFace(input.card_faces[1]);
    return {
      type: "split",
      left,
      right,
      ...shared,
    };
  }
  if (input.layout === "adventure") {
    const face = parseFace({...input.card_faces[0], image_uris: input.image_uris });
    const back = parseFace(input.card_faces[1]);
    return {
      type: "adventure",
      face,
      back,
      ...shared,
    };
  }
  const face = parseFace(input.card_faces[0]);
  const back = parseFace(input.card_faces[1]);
  const type = input.layout === "modal_dfc" ? "mdfc" : "dfc";
  return {
    type,
    face,
    back,
    ...shared,
  };
}

export type Card = (
  | { type: "normal"; face: CardFace; back?: never }
  | { type: "dfc"; face: CardFace; back: CardFace }
  | { type: "mdfc"; face: CardFace; back: CardFace }
  | { type: "adventure"; face: CardFace; back: Omit<CardFace, 'imageUri'> }
  | { type: "split"; left: CardFace; right: CardFace }
) &
  Metadata;

export type CardFace =
  | Creature
  | Enchantment
  | Artifact
  | Sorcery
  | Instant
  | Land
  | Planeswalker;

interface Metadata {
  name: string;
  typeLine: string;
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
  };
}

interface Base {
  name: string;
  imageUri: {
    art: string;
    full: string;
  };
}

export interface Creature extends Base {
  type: "Creature";
  manaCost: Color[];
  power: string;
  toughness: string;
  loyalty?: never;
  bodyText?: ParserResult;
}

export interface Enchantment extends Base {
  type: "Enchantment";
  manaCost: Color[];
  power?: never;
  toughness?: never;
  loyalty?: never;
  bodyText: ParserResult;
}

export interface Artifact extends Base {
  type: "Artifact";
  manaCost: Color[];
  power?: never;
  toughness?: never;
  loyalty?: never;
  bodyText: ParserResult;
}

export interface Land extends Base {
  type: "Land";
  manaCost?: never;
  power?: never;
  toughness?: never;
  loyalty?: never;
  bodyText: ParserResult;
}

export interface Instant extends Base {
  type: "Instant";
  manaCost: Color[];
  power?: never;
  toughness?: never;
  loyalty?: never;
  bodyText: ParserResult;
}

export interface Sorcery extends Base {
  type: "Sorcery";
  manaCost: Color[];
  power?: never;
  toughness?: never;
  loyalty?: never;
  bodyText: ParserResult;
}

export interface Planeswalker extends Base {
  type: "Planeswalker";
  manaCost: Color[];
  power?: never;
  toughness?: never;
  loyalty: number;
  bodyText: ParserResult;
}
