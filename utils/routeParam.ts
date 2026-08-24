/** Normalise un paramètre de route Expo (string, tableau, ou valeur vide). */
export function parseRouteParam(value: unknown): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== 'string' && typeof raw !== 'number') return undefined;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed === '[id]') {
    return undefined;
  }
  return trimmed;
}
