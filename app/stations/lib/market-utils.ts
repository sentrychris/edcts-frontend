/** Convert a camelCase commodity name to a human-readable display name. */
export function prettifyName(name: string): string {
  return name.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z])([A-Z])/g, "$1 $2");
}

/** Map a stock/demand bracket number to a Low / Med / High label. */
export function stockBracketLabel(bracket: number): string {
  if (bracket === 1) return "Low";
  if (bracket === 2) return "Med";
  if (bracket === 3) return "High";
  return "—";
}
