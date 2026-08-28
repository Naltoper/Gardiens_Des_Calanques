const webpush = require('web-push');
const {
  deleteEndpoint,
  fetchReportUserToken,
  loadSubscriptions,
  probeStore,
  setCors,
} = require('../server/pushStore');
const { readJsonBody } = require('../server/readJsonBody');

const FALLBACK_PUBLIC =
  'BH-0HJVlx4l2xkMqp7BzklEooka1P6_VD3_eIIBgPUZmNc9wEGEVQ0LO2w0cO2J6GoNn391luJhXRFHt4u6mD1M';

function resolveVapidPublic() {
  if (process.env.VAPID_PUBLIC_KEY) {
    return { key: process.env.VAPID_PUBLIC_KEY, source: 'VAPID_PUBLIC_KEY' };
  }
  if (process.env.EXPO_PUBLIC_VAPID_KEY) {
    return { key: process.env.EXPO_PUBLIC_VAPID_KEY, source: 'EXPO_PUBLIC_VAPID_KEY' };
  }
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    return { key: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, source: 'NEXT_PUBLIC_VAPID_PUBLIC_KEY' };
  }
  return { key: FALLBACK_PUBLIC, source: 'fallback' };
}

const vapidPublic = resolveVapidPublic();
const VAPID_PUBLIC_KEY = vapidPublic.key;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:gdc@lyceedescalanques.fr';

function extractRecord(body) {
  if (!body || typeof body !== 'object') return null;
  const nested =
    body.record ||
    body.new ||
    body.payload?.record ||
    body.payload?.new ||
    (Array.isArray(body.payload) ? body.payload[0] : null);
  if (nested && typeof nested === 'object') return nested;
  if (body.report_id) return body;
  return body;
}

function eventType(body) {
  return String(body?.type || body?.event || body?.eventType || 'INSERT').toUpperCase();
}

function vapidStatus() {
  return {
    public_source: vapidPublic.source,
    public_prefix: VAPID_PUBLIC_KEY.slice(0, 8),
    public_length: VAPID_PUBLIC_KEY.length,
    private_configured: Boolean(VAPID_PRIVATE_KEY),
    private_length: VAPID_PRIVATE_KEY.length,
    subject: VAPID_SUBJECT,
    next_public_present: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    expo_public_present: Boolean(process.env.EXPO_PUBLIC_VAPID_KEY),
  };
}

function authorize(req) {
  const secret = process.env.PUSH_WEBHOOK_SECRET;
  if (!secret) return true;
  const header =
    req.headers['x-webhook-secret'] ||
    String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return header === secret;
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method === 'GET') {
    let store = { mode: 'unknown' };
    try {
      store = await probeStore();
    } catch (error) {
      store = { mode: 'error', message: String(error?.message || error) };
    }
    res.status(200).json({
      ok: true,
      configured: Boolean(VAPID_PRIVATE_KEY),
      store,
      webhook_secret_required: Boolean(process.env.PUSH_WEBHOOK_SECRET),
      vapid: vapidStatus(),
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

  try {
    const body = await readJsonBody(req);
    const type = eventType(body);
    if (type === 'UPDATE' || type === 'DELETE') {
      res.status(200).json({ ok: true, skipped: 'not_insert' });
      return;
    }

    const record = extractRecord(body);
    const senderRole = String(record?.sender_role || '').trim().toLowerCase();
    const reportId = String(record?.report_id || '').trim();

    if (!reportId) {
      console.warn('[notify-chat] missing report_id', JSON.stringify(body).slice(0, 400));
      res.status(400).json({ error: 'missing_report_id' });
      return;
    }
    // Only skip explicit student messages. Empty / admin / staff / intervenant all notify.
    if (senderRole === 'user') {
      res.status(200).json({ ok: true, skipped: 'user_message' });
      return;
    }
    if (!VAPID_PRIVATE_KEY) {
      console.error('[notify-chat] VAPID_PRIVATE_KEY missing');
      res.status(500).json({ error: 'push_not_configured' });
      return;
    }

    const userToken = await fetchReportUserToken(reportId);
    console.info('[gdc-push:notify] report', reportId, 'sender', senderRole || '(vide)', 'user_token', userToken || '(none)');
    if (!userToken) {
      console.warn('[notify-chat] no user_token for report', reportId);
      res.status(200).json({ ok: true, skipped: 'no_user_token', report_id: reportId });
      return;
    }

    const subscriptions = await loadSubscriptions(userToken);
    console.info('[gdc-push:notify] subscriptions', subscriptions.length, 'for', userToken);
    if (subscriptions.length === 0) {
      console.warn('[notify-chat] no subscriptions for', userToken);
      res.status(200).json({ ok: true, skipped: 'no_subscriptions', report_id: reportId });
      return;
    }

    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const payload = JSON.stringify({
      title: 'Nouveau message',
      body: 'La cellule a répondu à ton signalement.',
      url: `/chat/${reportId}`,
      tag: `gdc-chat-${reportId}`,
    });

    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
          payload,
          {
            TTL: 60 * 60 * 24,
            urgency: 'high',
          },
        ),
      ),
    );

    let sent = 0;
    let failed = 0;
    for (let index = 0; index < results.length; index += 1) {
      const item = results[index];
      if (item.status === 'fulfilled') {
        sent += 1;
        console.info('[gdc-push:notify] send OK');
        continue;
      }
      failed += 1;
      const statusCode = item.reason?.statusCode;
      console.warn(
        '[notify-chat] send failed',
        statusCode || '',
        item.reason?.body || item.reason?.message || item.reason,
      );
      if (statusCode === 404 || statusCode === 410) {
        await deleteEndpoint(subscriptions[index]?.endpoint);
      }
    }

    res.status(200).json({
      ok: true,
      sent,
      failed,
      report_id: reportId,
      subscriptions: subscriptions.length,
    });
  } catch (error) {
    console.error('[notify-chat]', error);
    res.status(500).json({ error: 'notify_failed' });
  }
};
