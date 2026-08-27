/** Decode a URL-safe base64 VAPID key into a standalone Uint8Array (65 bytes). */
export function urlBase64ToUint8Array(base64String: string) {
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
 * Chrome / Android TWA can detach the ArrayBuffer of a Uint8Array view.
 * Pass a fresh copy so applicationServerKey stays valid for subscribe().
 */
export function vapidApplicationServerKey(base64String: string) {
  const decoded = urlBase64ToUint8Array(base64String);
  const copy = new Uint8Array(decoded.byteLength);
  copy.set(decoded);
  return copy;
}
