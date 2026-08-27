const { removeSubscription, setCors, upsertSubscription, probeStore } = require('../server/pushStore');
const { endpointHost, readJsonBody } = require('../server/readJsonBody');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method === 'GET') {
    try {
      const store = await probeStore();
      console.info('[gdc-push:subscribe] GET health', store);
      res.status(200).json({ ok: true, store });
    } catch (error) {
      console.error('[gdc-push:subscribe] GET health failed', error);
      res.status(500).json({ ok: false, error: String(error?.message || error) });
    }
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const userToken = String(body.user_token || '').trim();
    const reportId = String(body.report_id || '').trim();
    const subscription = body.subscription;
    const action = body.action === 'unsubscribe' ? 'unsubscribe' : 'subscribe';

    console.info('[gdc-push:subscribe] POST', {
      action,
      user_token: userToken || '(vide)',
      report_id: reportId || null,
      endpoint_host: subscription?.endpoint ? endpointHost(subscription.endpoint) : null,
      has_p256dh: Boolean(subscription?.keys?.p256dh || subscription?.p256dh),
      has_auth: Boolean(subscription?.keys?.auth || subscription?.auth),
    });

    if (!userToken || !subscription?.endpoint) {
      console.warn('[gdc-push:subscribe] missing_subscription', {
        has_token: Boolean(userToken),
        has_endpoint: Boolean(subscription?.endpoint),
      });
      res.status(400).json({ error: 'missing_subscription' });
      return;
    }

    const result =
      action === 'unsubscribe'
        ? await removeSubscription(userToken, subscription)
        : await upsertSubscription(userToken, subscription, reportId);

    console.info('[gdc-push:subscribe] OK', result);
    res.status(200).json({
      ok: true,
      ...result,
      user_token: userToken,
      endpoint_host: endpointHost(subscription.endpoint),
    });
  } catch (error) {
    console.error('[gdc-push:subscribe] FAILED', error);
    res.status(500).json({
      error: 'subscribe_failed',
      message: String(error?.message || error),
    });
  }
};
