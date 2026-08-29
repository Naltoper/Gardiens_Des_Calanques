/*
 * GDC élèves — service worker dédié au Web Push.
 *
 * Ce fichier ne fait QUE deux choses :
 *   1. Afficher une notification système native quand un push arrive
 *      (`push`), avec l'icône, le badge et le tag de l'app.
 *   2. Ouvrir / focus l'app sur le bon écran quand on tape la notification
 *      (`notificationclick`).
 *
 * Il n'intercepte JAMAIS `fetch` : l'app est une SPA, le cache est géré par
 * Expo/Metro côté build, pas par ce service worker.
 */
const SW_VERSION = 'gdc-push-v2026-08-29';

const DEFAULT_TITLE = 'Gardiens des Calanques';
const DEFAULT_BODY = 'Tu as reçu une nouvelle notification.';
const DEFAULT_URL = '/suivis';

/** Icône couleur affichée dans le tiroir de notifications / le grand aperçu. */
const ICON_URL = '/icons/icon-512.png';
/** Icône monochrome (silhouette blanche) utilisée par Android dans la barre de statut. */
const BADGE_URL = '/notif-icon.png';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function absoluteUrl(path) {
  try {
    return new URL(path, self.location.origin).href;
  } catch {
    return path;
  }
}

function parsePushPayload(event) {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch {
    return { body: event.data.text() };
  }
}

self.addEventListener('push', (event) => {
  const payload = parsePushPayload(event);

  const title = payload.title || DEFAULT_TITLE;
  const targetUrl = payload.url || DEFAULT_URL;
  /** Le tag évite d'empiler 10 notifications pour la même conversation. */
  const tag = payload.tag || 'gdc-notification';

  /**
   * Ces options sont celles attendues par Chrome/Android pour traiter la
   * notification comme une notification "app native" déléguée à la TWA
   * (et non comme une alerte générique "via Chrome") :
   *  - icon / badge : ressources de l'app, jamais celles de Chrome.
   *  - tag + renotify : regroupe proprement les messages d'une même
   *    conversation au lieu d'empiler des doublons "spammy".
   *  - data.url : écran cible ouvert au clic (ex: /chat/<id>, /suivis).
   */
  const options = {
    body: payload.body || DEFAULT_BODY,
    icon: absoluteUrl(ICON_URL),
    badge: absoluteUrl(BADGE_URL),
    tag,
    renotify: true,
    requireInteraction: false,
    vibrate: [120, 80, 120],
    timestamp: Date.now(),
    data: {
      url: targetUrl,
      version: SW_VERSION,
    },
    actions: [{ action: 'open', title: 'Ouvrir' }],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetPath = event.notification.data?.url || DEFAULT_URL;
  const destination = absoluteUrl(targetPath);

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of windows) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) {
            try {
              await client.navigate(destination);
            } catch {
              /* Certaines TWA / anciens WebView refusent client.navigate(). */
            }
          }
          return;
        }
      }

      await self.clients.openWindow(destination);
    })(),
  );
});
