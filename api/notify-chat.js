const webpush = require('web-push');
const { fetchReportUserToken, loadSubscriptions, setCors } = require('../server/pushStore');

const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  process.env.EXPO_PUBLIC_VAPID_KEY ||
  'BH-0HJVlx4l2xkMqp7BzklEooka1P6_VD3_eIIBgPUZmNc9wEGEVQ0LO2w0cO2J6GoNn391luJhXRFHt4u6mD1M';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:gdc@lyceedescalanques.fr';

function extractRecord(body) {
  if (!body || typeof body !== 'object') return null;
  return body.record || body.new || body.payload?.record || body;
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
    res.status(200).json({
      ok: true,
      configured: Boolean(VAPID_PRIVATE_KEY),
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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const record = extractRecord(body);
    const senderRole = String(record?.sender_role || '');
    const reportId = String(record?.report_id || '').trim();

    if (!reportId) {
      res.status(400).json({ error: 'missing_report_id' });
      return;
    }
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
    if (!userToken) {
      res.status(200).json({ ok: true, skipped: 'no_user_token' });
      return;
    }

    const subscriptions = await loadSubscriptions(userToken);
    if (subscriptions.length === 0) {
      res.status(200).json({ ok: true, skipped: 'no_subscriptions' });
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
        ),
      ),
    );

    const sent = results.filter((item) => item.status === 'fulfilled').length;
    const failed = results.length - sent;
    res.status(200).json({ ok: true, sent, failed });
  } catch (error) {
    console.error('[notify-chat]', error);
    res.status(500).json({ error: 'notify_failed' });
  }
};
