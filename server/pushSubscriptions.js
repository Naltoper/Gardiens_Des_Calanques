/**
 * Accès Supabase côté serveur pour `api/send-notification.js` et
 * `api/register-push-subscription.js`.
 *
 * On utilise la **service role key** (jamais exposée au client) pour lire,
 * écrire et supprimer les abonnements : la table `push_subscriptions`
 * n'accorde plus AUCUN droit à la clé anonyme (voir la migration Supabase
 * `..._lockdown.sql`), donc ce module est le SEUL endroit qui touche cette
 * table.
 */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lgsspvcxayanodmvgkzb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const TABLE = 'push_subscriptions';

function assertServiceRoleConfigured() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY manquante côté Vercel — impossible de lire push_subscriptions.',
    );
  }
}

function adminHeaders(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  };
}

async function adminRest(path, init = {}) {
  assertServiceRoleConfigured();
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: adminHeaders(init.headers || {}),
  });
}

function normalizeSubscription(row) {
  if (!row?.endpoint || !row?.p256dh || !row?.auth) return null;
  return {
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
  };
}

/** Toutes les subscriptions actives pour un `user_token` (`uf-...`). */
async function loadSubscriptionsForUser(userToken) {
  const token = String(userToken || '').trim();
  if (!token) return [];

  const response = await adminRest(
    `/rest/v1/${TABLE}?user_token=eq.${encodeURIComponent(token)}&select=endpoint,p256dh,auth`,
    { headers: { Accept: 'application/json' } },
  );
  const text = await response.text();
  if (!response.ok) {
    console.warn('[gdc-push:store] loadSubscriptionsForUser', response.status, text.slice(0, 300));
    return [];
  }
  try {
    const rows = JSON.parse(text);
    return (Array.isArray(rows) ? rows : []).map(normalizeSubscription).filter(Boolean);
  } catch {
    return [];
  }
}

/** Supprime un abonnement devenu invalide (réponse 404/410 du push service). */
async function deleteSubscriptionByEndpoint(endpoint) {
  if (!endpoint) return;
  try {
    await adminRest(`/rest/v1/${TABLE}?endpoint=eq.${encodeURIComponent(endpoint)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
  } catch (error) {
    console.warn('[gdc-push:store] deleteSubscriptionByEndpoint', error);
  }
}

/**
 * Crée / met à jour un abonnement (upsert par `endpoint`), appelé par
 * `api/register-push-subscription.js`. C'est la SEULE façon d'écrire dans
 * `push_subscriptions` : le client n'a plus aucun droit direct sur la table
 * (voir la migration `..._lockdown.sql`), donc pas de RLS/GRANT à maintenir
 * côté anon pour cette opération.
 */
async function upsertSubscription(userToken, subscription) {
  const token = String(userToken || '').trim();
  const endpoint = subscription?.endpoint;
  const p256dh = subscription?.keys?.p256dh;
  const auth = subscription?.keys?.auth;
  if (!token || !endpoint || !p256dh || !auth) {
    throw new Error('invalid_subscription');
  }

  const response = await adminRest(`/rest/v1/${TABLE}?on_conflict=endpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      user_token: token,
      endpoint,
      p256dh,
      auth,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`upsert push_subscriptions ${response.status}: ${text.slice(0, 300)}`);
  }
}

/** Supprime l'abonnement d'un élève précis (bouton "désactiver" côté client). */
async function removeSubscriptionForUser(userToken, endpoint) {
  const token = String(userToken || '').trim();
  if (!token || !endpoint) return;
  await adminRest(
    `/rest/v1/${TABLE}?user_token=eq.${encodeURIComponent(token)}&endpoint=eq.${encodeURIComponent(endpoint)}`,
    { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
  );
}

/** Retrouve le `user_token` propriétaire d'un signalement (pour les notifs de chat). */
async function fetchReportUserToken(reportId) {
  const id = String(reportId || '').trim();
  if (!id) return null;

  const response = await adminRest(
    `/rest/v1/reports?id=eq.${encodeURIComponent(id)}&select=user_token`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) return null;
  const rows = await response.json();
  return rows?.[0]?.user_token || null;
}

async function probeStore() {
  try {
    assertServiceRoleConfigured();
    const response = await adminRest(`/rest/v1/${TABLE}?select=endpoint&limit=1`, {
      headers: { Accept: 'application/json' },
    });
    return { ok: response.ok, status: response.status, table: TABLE };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-webhook-secret');
}

module.exports = {
  deleteSubscriptionByEndpoint,
  fetchReportUserToken,
  loadSubscriptionsForUser,
  probeStore,
  removeSubscriptionForUser,
  setCors,
  upsertSubscription,
};
