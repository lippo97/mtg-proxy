export function parseManaCost(manaCost: string): string[] {
  const regex = /{([^}]+)}/g;
  const matches = manaCost.match(regex);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
}
