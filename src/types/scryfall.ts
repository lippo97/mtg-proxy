interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export interface Legalities {
  standard: string;
  future: string;
  historic: string;
  gladiator: string;
  pioneer: string;
  explorer: string;
  modern: string;
  legacy: string;
  pauper: string;
  vintage: string;
  penny: string;
  commander: string;
  oathbreaker: string;
  brawl: string;
  historicbrawl: string;
  alchemy: string;
  paupercommander: string;
  duel: string;
  oldschool: string;
  premodern: string;
  predh: string;
}

interface Preview {
  source: string;
  source_uri: string;
  previewed_at: string;
}

interface Prices {
  usd: string;
  usd_foil: string;
  usd_etched?: string | null;
  eur: string;
  eur_foil: string;
  tix: string;
}

interface RelatedUris {
  gatherer: string;
  tcgplayer_infinite_articles: string;
  tcgplayer_infinite_decks: string;
  edhrec: string;
}

interface PurchaseUris {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
}

export interface CardBase {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  flavor_text?: string;
  artist: string;
  artist_id: string;
  illustration_id: string;
  image_uris: ImageUris;
}

export interface Summary {
  name: string;
  mana_cost?: string;
  cmc?: number;
  type_line: string;
  colors: string[];
  color_identity: string[];
  keywords: string[];
}

export interface Metadata {
  id: string;
  oracle_id: string;
  multiverse_ids?: number[];
  mtgo_id?: number;
  mtgo_foil_id?: number;
  tcgplayer_id?: number;
  cardmarket_id?: number;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  //
  highres_image: boolean;
  image_status: string;
  //
  legalities: Legalities;
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  card_back_id: string;
  border_color: string;
  frame: string;
  security_stamp?: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank: number;
  preview?: Preview;
  prices: Prices;
  related_uris: RelatedUris;
  purchase_uris: PurchaseUris;
}

export type CardFace = { object: "card_face" } & CardBase;

export type Normal = { layout: "normal" } & CardBase;

export type DFC = { layout: "transform" } & {
  card_faces: CardFace[];
};

export type MDFC = { layout: "modal_dfc" } & {
  card_faces: CardFace[];
};

export type Adventure = { layout: "adventure" } & {
  card_faces: Omit<CardFace, "image_uris">[];
  image_uris: ImageUris;
};

export type Split = { layout: "split" } & {
  card_faces: Omit<CardFace, "image_uris">[];
  image_uris: ImageUris;
};

export type Card = { object: "card" } & (
  | Normal
  | DFC
  | MDFC
  | Adventure
  | Split
) &
  Summary &
  Metadata;
