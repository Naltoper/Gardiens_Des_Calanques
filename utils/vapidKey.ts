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

/** Taille attendue d'une clé publique VAPID (P-256, format non compressé : 0x04 + 32 + 32 octets). */
const VAPID_KEY_BYTE_LENGTH = 65;

/**
 * `PushManager.subscribe()` peut détacher l'ArrayBuffer sous-jacent d'une vue
 * Uint8Array (observé sur Chrome/Android TWA). On renvoie donc toujours une
 * copie fraîche, jamais la vue décodée directement.
 *
 * On valide aussi explicitement la taille (65 octets) : une clé VAPID mal
 * configurée (variable d'env tronquée, mauvaise clé collée, etc.) doit
 * échouer ici avec un message clair, plutôt que de laisser
 * `pushManager.subscribe()` échouer plus loin avec une erreur DOMException
 * opaque.
 */
export function vapidApplicationServerKey(base64String: string): Uint8Array {
  if (!base64String) {
    throw new Error('Clé VAPID publique manquante (EXPO_PUBLIC_VAPID_KEY non définie).');
  }

  const decoded = urlBase64ToUint8Array(base64String);
  if (decoded.byteLength !== VAPID_KEY_BYTE_LENGTH) {
    throw new Error(
      `Clé VAPID publique invalide (${decoded.byteLength} octets, ${VAPID_KEY_BYTE_LENGTH} attendus).`,
    );
  }

  const copy = new Uint8Array(decoded.byteLength);
  copy.set(decoded);
  return copy;
}
