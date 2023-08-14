import { Card, CardFace, Entry, ExportEntry } from "../types/generic";

function parseLine(input: string): ExportEntry {
  const r = /^(\d+) (.+)$/;
  const m = input.match(r);
  if (m === null) {
    throw new Error(`Couldn't parse: ${input}.`);
  }
  return [m[2], parseInt(m[1])];
}

export function parseDeckList(input: string): ExportEntry[] {
  return input.split("\n")
    .filter(x => x.length !== 0 && x !== 'Deck' && x !== 'Sideboard')
    .map(parseLine);
}

export function getType(card: Card): CardFace['type'] {
  if (card.type === 'split') {
    return card.left.type;
  }
  return card.face.type;
}

export function sortDeckList(entries: Entry[]): void {
  const cardOrder = {
    "Creature": 1,
    "Planeswalker": 2,
    "Sorcery": 3,
    "Instant": 4,
    "Artifact": 5,
    "Enchantment": 6,
    "Land": 7
  } as const;

  entries.sort((a, b) => {
    const typeA = getType(a.card);
    const typeB = getType(b.card);
    
    return cardOrder[typeA] - cardOrder[typeB];
  });
}