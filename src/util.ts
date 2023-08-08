import { Color } from "./types/colors";

export function parseManaCost(manaCost: string): Color[] {
  const regex = /{([^}]+)}/g;
  const matches = manaCost.match(regex);
  return matches ? matches.map(match => match.slice(1, -1)) as Color[] : [];
}
