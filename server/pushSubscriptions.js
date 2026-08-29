/**
 * Accès Supabase côté serveur pour `api/send-notification.js`.
 *
 * On utilise la **service role key** (jamais exposée au client) pour lire /
 * supprimer les abonnements : la table `push_subscriptions` n'autorise plus
 * la lecture avec la clé anonyme (voir la migration Supabase), donc ce
 * module est le SEUL endroit qui peut lister les abonnements d'un élève.
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
  setCors,
};
