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

/**
 * Extraction agnostique du payload : le trigger Postgres (`net.http_post`)
 * envoie `{ record: { report_id, sender_role, ... } }`, tandis que certains
 * appels directs (frontend intervenant, tests) envoient un payload plat.
 */
function extractRecord(body) {
  if (!body || typeof body !== 'object') return {};
  const record =
    body.record ||
    body.new ||
    body.payload?.record ||
    body.payload?.new ||
    (Array.isArray(body.payload) ? body.payload[0] : null) ||
    body;
  return record && typeof record === 'object' ? record : {};
}

function extractReportId(record, body) {
  return String(record?.report_id || record?.reportId || body?.report_id || body?.reportId || '').trim();
}

function extractSenderRole(record, body) {
  return String(record?.sender_role || record?.senderRole || body?.sender_role || body?.senderRole || '')
    .trim()
    .toLowerCase();
}

function eventType(body) {
  return String(body?.type || body?.event || body?.eventType || 'INSERT').toUpperCase();
}

/** Rôles "staff" qui déclenchent toujours une notification vers l'élève. */
const STAFF_ROLES = new Set(['admin', 'intervenant', 'agent', 'assistant']);
/** Seuls ces rôles (l'élève lui-même) ne déclenchent PAS de notification. */
const STUDENT_ROLES = new Set(['user', 'eleve']);

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
    console.log('[notify-chat] step 1/6 payload brut reçu', JSON.stringify(body).slice(0, 500));

    const type = eventType(body);
    if (type === 'UPDATE' || type === 'DELETE') {
      console.log('[notify-chat] event type ignoré', type);
      res.status(200).json({ ok: true, skipped: 'not_insert' });
      return;
    }

    // Étape 1 : extraction agnostique (trigger `record` / `new` VS payload plat).
    const record = extractRecord(body);
    const reportId = extractReportId(record, body);
    const senderRole = extractSenderRole(record, body);
    console.log('[notify-chat] step 2/6 extraction', {
      has_record_key: Boolean(body?.record),
      has_new_key: Boolean(body?.new),
      report_id: reportId || '(vide)',
      sender_role: senderRole || '(vide)',
    });

    if (!reportId) {
      console.warn('[notify-chat] missing report_id', JSON.stringify(body).slice(0, 400));
      res.status(400).json({ error: 'missing_report_id' });
      return;
    }

    // Étape 2 : n'exclure QUE les messages envoyés par l'élève lui-même.
    // 'admin', 'intervenant', 'agent', 'assistant' (et tout rôle staff
    // inconnu / vide) déclenchent tous la notification.
    if (STUDENT_ROLES.has(senderRole)) {
      console.log('[notify-chat] step 3/6 skip : message envoyé par l’élève', senderRole);
      res.status(200).json({ ok: true, skipped: 'user_message' });
      return;
    }
    console.log(
      '[notify-chat] step 3/6 rôle autorisé à notifier',
      senderRole || '(vide)',
      STAFF_ROLES.has(senderRole) ? '(staff connu)' : '(rôle inconnu, notifié par défaut)',
    );

    if (!VAPID_PRIVATE_KEY) {
      console.error('[notify-chat] VAPID_PRIVATE_KEY manquante — impossible d’envoyer les push');
      res.status(500).json({ error: 'push_not_configured' });
      return;
    }

    // Étape 3 : report_id -> user_token (table `reports`).
    const userToken = await fetchReportUserToken(reportId);
    console.log('[notify-chat] step 4/6 user_token résolu', {
      report_id: reportId,
      sender_role: senderRole || '(vide)',
      user_token: userToken || '(none)',
    });
    if (!userToken) {
      console.warn('[notify-chat] no user_token for report', reportId);
      res.status(200).json({ ok: true, skipped: 'no_user_token', report_id: reportId });
      return;
    }

    // Étape 4 : user_token -> souscriptions push_subscriptions (jamais par report_id,
    // report_id peut être NULL dans push_subscriptions).
    const subscriptions = await loadSubscriptions(userToken);
    console.log(
      '[notify-chat] step 5/6 souscriptions trouvées pour user_token',
      userToken,
      ':',
      subscriptions.length,
    );
    if (subscriptions.length === 0) {
      console.warn('[notify-chat] no subscriptions for', userToken);
      res.status(200).json({ ok: true, skipped: 'no_subscriptions', report_id: reportId });
      return;
    }

    try {
      webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    } catch (error) {
      console.error('[notify-chat] setVapidDetails a échoué', vapidStatus(), error?.message || error);
      res.status(500).json({ error: 'vapid_setup_failed', message: String(error?.message || error) });
      return;
    }

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
      const endpointHost = (() => {
        try {
          return new URL(subscriptions[index]?.endpoint).host;
        } catch {
          return 'invalid';
        }
      })();
      if (item.status === 'fulfilled') {
        sent += 1;
        console.log('[notify-chat] step 6/6 push envoyé OK ->', endpointHost);
        continue;
      }
      failed += 1;
      const statusCode = item.reason?.statusCode;
      console.error(
        '[notify-chat] step 6/6 push ECHEC VAPID/webpush ->',
        endpointHost,
        'status',
        statusCode || '(n/a)',
        item.reason?.body || item.reason?.message || item.reason,
      );
      if (statusCode === 404 || statusCode === 410) {
        console.log('[notify-chat] endpoint expiré, suppression', endpointHost);
        await deleteEndpoint(subscriptions[index]?.endpoint);
      }
    }

    console.log('[notify-chat] step 6/6 bilan', {
      report_id: reportId,
      user_token: userToken,
      subscriptions: subscriptions.length,
      sent,
      failed,
    });

    res.status(200).json({
      ok: true,
      sent,
      failed,
      report_id: reportId,
      subscriptions: subscriptions.length,
    });
  } catch (error) {
    console.error('[notify-chat] erreur fatale', error);
    res.status(500).json({ error: 'notify_failed', message: String(error?.message || error) });
  }
};
