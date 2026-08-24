/** Extrait un identifiant depuis le contenu brut d'un QR code. */
export function extractIdentifierFromQr(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (typeof parsed === 'string' && parsed.trim()) return parsed.trim();
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      const candidate =
        record.identifiant ??
        record.identifier ??
        record.username ??
        record.user ??
        record.id;
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  } catch {
    // Not JSON — try URL next.
  }

  try {
    const url = new URL(trimmed);
    const fromQuery =
      url.searchParams.get('identifiant') ||
      url.searchParams.get('identifier') ||
      url.searchParams.get('id') ||
      url.searchParams.get('user');
    if (fromQuery?.trim()) return fromQuery.trim();
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    // Plain text payload.
  }

  return trimmed;
}
