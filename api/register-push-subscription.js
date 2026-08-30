/**
 * POST /api/register-push-subscription
 *
 * Seul point d'écriture de la table `push_subscriptions`. Le client
 * (`hooks/usePushNotifications.ts`) ne touche plus jamais Supabase
 * directement pour ça : il envoie `{ user_token, action, subscription }`
 * ici, et c'est ce serveur — avec la **service role key** — qui fait
 * l'upsert / la suppression.
 *
 * Pourquoi ce changement : faire l'upsert depuis le client avec la clé
 * `anon` obligeait à maintenir en parallèle des GRANT + policies RLS
 * précises sur `push_subscriptions`. Le moindre oubli (table recréée sans
 * les GRANT, policy supprimée par erreur, etc.) fait échouer l'upsert avec
 * `42501 permission denied for table push_subscriptions`. En passant par un
 * endpoint service-role, il n'y a plus aucune permission anonyme à
 * maintenir sur cette table : voir la migration `..._lockdown.sql`.
 */
const {
  removeSubscriptionForUser,
  setCors,
  upsertSubscription,
} = require('../server/pushSubscriptions');

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
    const body = await readJsonBody(req);
    const userToken = String(body.user_token || '').trim();
    const subscription = body.subscription;
    const action = body.action === 'unsubscribe' ? 'unsubscribe' : 'subscribe';

    if (!userToken || !subscription?.endpoint) {
      res.status(400).json({ error: 'missing_subscription' });
      return;
    }

    if (action === 'unsubscribe') {
      await removeSubscriptionForUser(userToken, subscription.endpoint);
      res.status(200).json({ ok: true, action });
      return;
    }

    await upsertSubscription(userToken, subscription);
    res.status(200).json({ ok: true, action });
  } catch (error) {
    console.error('[register-push-subscription]', error);
    res.status(500).json({
      error: 'register_failed',
      message: String(error?.message || error),
    });
  }
};
