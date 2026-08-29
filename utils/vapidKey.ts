/** Décode une clé VAPID publique (URL-safe base64) en Uint8Array (65 octets). */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = globalThis.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

/**
 * `PushManager.subscribe()` peut détacher l'ArrayBuffer sous-jacent d'une vue
 * Uint8Array (observé sur Chrome/Android TWA). On renvoie donc toujours une
 * copie fraîche, jamais la vue décodée directement.
 */
export function vapidApplicationServerKey(base64String: string): Uint8Array {
  const decoded = urlBase64ToUint8Array(base64String);
  const copy = new Uint8Array(decoded.byteLength);
  copy.set(decoded);
  return copy;
}
