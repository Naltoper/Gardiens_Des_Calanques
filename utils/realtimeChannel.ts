/** Nom de canal Realtime unique — réutiliser le même topic après subscribe() plante. */
export function uniqueRealtimeTopic(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
