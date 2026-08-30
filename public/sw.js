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
 *
 * RÈGLE D'OR de l'écouteur `push` : `showNotification()` doit TOUJOURS être
 * appelé, quoi qu'il arrive. Un payload JSON invalide, une URL d'image
 * cassée ou n'importe quelle autre exception ne doivent jamais faire
 * disparaître silencieusement la notification (observé sur Android TWA
 * après l'ajout de l'aperçu photo : une `image` invalide faisait échouer
 * `showNotification()` et... rien ne s'affichait, sans log ni erreur visible
 * côté client). D'où les deux niveaux de `try/catch` ci-dessous.
 */
const SW_VERSION = 'gdc-push-v6';

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
    try {
      return { body: event.data.text() };
    } catch {
      return {};
    }
  }
}

function safeString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

/**
 * Valide une URL d'image optionnelle (aperçu photo d'un signalement). Refuse
 * silencieusement (retourne `null`) tout ce qui n'est pas une URL http(s)
 * bien formée — jamais d'exception qui remonterait jusqu'à `push`.
 */
function safeImageUrl(value) {
  const raw = safeString(value);
  if (!raw) return null;
  try {
    const url = new URL(raw, self.location.origin);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Options de base, toujours valides, utilisées comme point de départ ET comme filet de secours. */
function baseNotificationOptions() {
  return {
    body: DEFAULT_BODY,
    icon: absoluteUrl(ICON_URL),
    badge: absoluteUrl(BADGE_URL),
    tag: 'gdc-notification',
    renotify: true,
    requireInteraction: false,
    vibrate: [120, 80, 120],
    timestamp: Date.now(),
    data: { url: DEFAULT_URL, version: SW_VERSION },
    actions: [{ action: 'open', title: 'Ouvrir' }],
  };
}

/**
 * Construit (titre, options) à partir du payload push. Ne lève jamais :
 * toute valeur invalide ou manquante retombe sur les défauts sûrs.
 */
function buildNotification(event) {
  const options = baseNotificationOptions();
  let title = DEFAULT_TITLE;

  try {
    const payload = parsePushPayload(event);

    title = safeString(payload.title) || DEFAULT_TITLE;
    options.body = safeString(payload.body) || DEFAULT_BODY;
    /** Le tag évite d'empiler 10 notifications pour la même conversation. */
    options.tag = safeString(payload.tag) || 'gdc-notification';
    options.data = {
      url: safeString(payload.url) || DEFAULT_URL,
      version: SW_VERSION,
    };

    // L'aperçu photo est purement cosmétique : s'il est absent ou invalide,
    // on affiche simplement la notification sans image plutôt que de risquer
    // de la faire échouer.
    const image = safeImageUrl(payload.image);
    if (image) {
      options.image = image;
    }
  } catch (error) {
    console.warn('[gdc-push] payload push invalide, notification par défaut utilisée', error);
  }

  return { title, options };
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      const { title, options } = buildNotification(event);

      /**
       * Ces options sont celles attendues par Chrome/Android pour traiter la
       * notification comme une notification "app native" déléguée à la TWA
       * (et non comme une alerte générique "via Chrome") :
       *  - icon / badge : ressources de l'app, jamais celles de Chrome.
       *  - tag + renotify : regroupe proprement les messages d'une même
       *    conversation au lieu d'empiler des doublons "spammy".
       *  - data.url : écran cible ouvert au clic (ex: /chat/<id>, /suivis).
       */
      try {
        await self.registration.showNotification(title, options);
      } catch (error) {
        // Dernier filet : si showNotification() rejette quand même (ex: une
        // `image` que le navigateur refuse malgré la validation ci-dessus),
        // on retente avec des options minimales sans jamais avaler l'erreur
        // en silence — la notification doit sortir dans tous les cas.
        console.error('[gdc-push] showNotification() a échoué, repli minimal', error);
        const fallback = baseNotificationOptions();
        delete fallback.actions;
        await self.registration.showNotification(DEFAULT_TITLE, fallback);
      }
    })(),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetPath = event.notification.data?.url || DEFAULT_URL;
  const destination = absoluteUrl(targetPath);

  event.waitUntil(
    (async () => {
      try {
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
      } catch (error) {
        console.warn('[gdc-push] notificationclick a échoué', error);
      }
    })(),
  );
});
