/**
 * POST /api/send-notification
 *
 * Point d'entrée UNIQUE pour envoyer un Web Push aux élèves. Deux façons de
 * l'appeler :
 *
 * 1. Webhook Database Supabase sur `messages` (INSERT) — voir
 *    docs/PUSH-NOTIFICATIONS.md. Supabase poste `{ type, table, record }`.
 * 2. Appel direct depuis le client (roue de secours, voir
 *    `utils/notifyChat.ts`) avec `{ kind: 'chat_message', record }`.
 *
 * Dans les deux cas on résout le `user_token` du signalement, on charge ses
 * abonnements dans `push_subscriptions` (via la service role key) et on
 * envoie la notification avec `web-push` (VAPID).
 */
const webpush = require('web-push');
const {
  deleteSubscriptionByEndpoint,
  fetchReportForPush,
  loadSubscriptionsForUser,
  probeStore,
  setCors,
} = require('../server/pushSubscriptions');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:gdc@lyceedescalanques.fr';

async function readJsonBody(req) {
  const raw = req.body;
  if (raw && typeof raw === 'object' && !Buffer.isBuffer(raw)) return raw;
  if (typeof raw === 'string') return raw ? JSON.parse(raw) : {};
  if (Buffer.isBuffer(raw)) {
    const text = raw.toString('utf8');
    return text ? JSON.parse(text) : {};
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

function extractRecord(body) {
  const nested =
    body?.record || body?.new || body?.payload?.record || body?.payload?.new;
  return nested && typeof nested === 'object' ? nested : body;
}

/**
 * `kind` distingue le TYPE de notification à construire (`chat_message` vs
 * générique) — à ne pas confondre avec `type`, qui est l'opération CRUD
 * (`INSERT`/`UPDATE`/`DELETE`) envoyée par les Database Webhooks Supabase.
 */
function resolveKind(body, record) {
  if (body?.kind) return String(body.kind);
  if (record?.report_id && 'sender_role' in record) return 'chat_message';
  return 'generic';
}

function authorize(req) {
  const secret = process.env.PUSH_WEBHOOK_SECRET;
  if (!secret) return true;
  const header =
    req.headers['x-webhook-secret'] ||
    String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return header === secret;
}

/**
 * Valide une URL d'image optionnelle avant de l'inclure dans le payload.
 * Ne lève jamais : une valeur invalide/absente renvoie simplement `null`,
 * pour que l'aperçu photo (purement cosmétique) ne puisse jamais empêcher
 * l'envoi de la notification elle-même.
 */
function safeImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

/** Construit le payload envoyé au service worker selon le type d'événement. */
function buildNotificationPayload(kind, record, imageUrl) {
  const image = safeImageUrl(imageUrl ?? record?.image_url ?? record?.image);

  if (kind === 'chat_message') {
    const reportId = String(record?.report_id || '').trim();
    const payload = {
      title: 'Nouveau message',
      body: 'La cellule a répondu à ton signalement.',
      url: `/chat/${reportId}`,
      tag: `gdc-chat-${reportId}`,
    };
    if (image) payload.image = image;
    return payload;
  }

  // Notification générique : le body peut fournir directement title/body/url/tag.
  const payload = {
    title: record?.title || 'Gardiens des Calanques',
    body: record?.body || 'Tu as reçu une nouvelle notification.',
    url: record?.url || '/suivis',
    tag: record?.tag || 'gdc-notification',
  };
  if (image) payload.image = image;
  return payload;
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const store = await probeStore();
    res.status(200).json({
      ok: true,
      configured: Boolean(VAPID_PRIVATE_KEY && VAPID_PUBLIC_KEY),
      webhook_secret_required: Boolean(process.env.PUSH_WEBHOOK_SECRET),
      store,
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (!authorize(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  if (!VAPID_PRIVATE_KEY || !VAPID_PUBLIC_KEY) {
    console.error('[send-notification] VAPID keys missing');
    res.status(500).json({ error: 'push_not_configured' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const record = extractRecord(body);
    const kind = resolveKind(body, record);

    // Un webhook Supabase sur `messages` ne doit déclencher un push qu'à l'INSERT.
    const crudEvent = String(body?.type || 'INSERT').toUpperCase();
    if (crudEvent === 'UPDATE' || crudEvent === 'DELETE') {
      res.status(200).json({ ok: true, skipped: 'not_insert' });
      return;
    }

    const senderRole = String(record?.sender_role || '').trim().toLowerCase();
    if (kind === 'chat_message' && senderRole === 'user') {
      res.status(200).json({ ok: true, skipped: 'user_message' });
      return;
    }

    let userToken = String(record?.user_token || '').trim();
    const reportId = String(record?.report_id || '').trim();
    // L'aperçu photo est un "bonus" : une erreur ici ne doit jamais
    // empêcher de résoudre le user_token ni d'envoyer la notification.
    let reportImageUrl = null;
    if (reportId) {
      try {
        const reportInfo = await fetchReportForPush(reportId);
        if (!userToken) userToken = reportInfo.userToken || '';
        reportImageUrl = reportInfo.imageUrl;
      } catch (error) {
        console.warn('[send-notification] fetchReportForPush a échoué, on continue sans image', error);
      }
    }

    if (!userToken) {
      res.status(200).json({ ok: true, skipped: 'no_user_token' });
      return;
    }

    const subscriptions = await loadSubscriptionsForUser(userToken);
    if (subscriptions.length === 0) {
      res.status(200).json({ ok: true, skipped: 'no_subscriptions', user_token: userToken });
      return;
    }

    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    const payload = JSON.stringify(buildNotificationPayload(kind, record, reportImageUrl));

    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webpush.sendNotification(subscription, payload, { TTL: 60 * 60 * 24, urgency: 'high' }),
      ),
    );

    let sent = 0;
    let failed = 0;
    await Promise.all(
      results.map(async (result, index) => {
        if (result.status === 'fulfilled') {
          sent += 1;
          return;
        }
        failed += 1;
        const statusCode = result.reason?.statusCode;
        console.warn('[send-notification] send failed', statusCode, result.reason?.body || result.reason?.message);
        if (statusCode === 404 || statusCode === 410) {
          await deleteSubscriptionByEndpoint(subscriptions[index]?.endpoint);
        }
      }),
    );

    res.status(200).json({ ok: true, sent, failed, user_token: userToken, subscriptions: subscriptions.length });
  } catch (error) {
    console.error('[send-notification]', error);
    res.status(500).json({ error: 'send_notification_failed', message: String(error?.message || error) });
  }
};
