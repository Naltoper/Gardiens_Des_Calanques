/* GDC élèves — push-only service worker. Do not intercept fetch (SPA). */
const SW_VERSION = 'gdc-push-6';

self.addEventListener('install', (event) => {
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

function isHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const parsed = new URL(value, self.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'Gardiens des Calanques';
  const icon = absoluteUrl(payload.icon || '/icons/icon-192.png');
  const badge = absoluteUrl(payload.badge || '/notif-icon.png');
  const options = {
    body: payload.body || 'Tu as reçu un nouveau message.',
    icon,
    badge,
    tag: payload.tag || 'gdc-chat',
    renotify: true,
    vibrate: [120, 80, 120],
    data: {
      url: payload.url || payload.data?.url || '/suivis',
      version: SW_VERSION,
    },
  };

  const photo = payload.image || payload.imageUrl || payload.photo_url;
  if (isHttpUrl(photo)) {
    options.image = absoluteUrl(photo);
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/suivis';
  const dest = absoluteUrl(target);

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
              await client.navigate(dest);
            } catch {
              /* TWA / older WebViews may reject navigate() */
            }
          }
          return;
        }
      }
      await self.clients.openWindow(dest);
    })(),
  );
});
