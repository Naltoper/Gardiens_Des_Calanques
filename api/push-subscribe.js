const { removeSubscription, setCors, upsertSubscription } = require('../server/pushStore');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const userToken = String(body.user_token || '').trim();
    const subscription = body.subscription;
    const action = body.action === 'unsubscribe' ? 'unsubscribe' : 'subscribe';

    if (!userToken || !subscription?.endpoint) {
      res.status(400).json({ error: 'missing_subscription' });
      return;
    }

    const count =
      action === 'unsubscribe'
        ? await removeSubscription(userToken, subscription)
        : await upsertSubscription(userToken, subscription);

    res.status(200).json({ ok: true, count });
  } catch (error) {
    console.error('[push-subscribe]', error);
    res.status(500).json({ error: 'subscribe_failed' });
  }
};
