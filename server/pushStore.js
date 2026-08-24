const crypto = require('crypto');

const SUPABASE_URL = 'https://lgsspvcxayanodmvgkzb.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3NwdmN4YXlhbm9kbXZna3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTI4MTksImV4cCI6MjA4Mzg4ODgxOX0.YNaDaUcRyjLnn0J8mN3Z3fCzNVH4iGWEJPwNc5rpGDw';

const BUCKET = 'report-photos';
const MAX_SUBSCRIPTIONS = 8;
const TABLE_CANDIDATES = ['push_subscriptions', 'eleve_push_subscriptions'];

/** Cached only on hit so a later SQL apply is picked up on the next request. */
let cachedTableName;

function restHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

async function rest(path, init = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: restHeaders(init.headers || {}),
  });
}

function isMissingTable(status, body) {
  return status === 404 || status === 400
    ? /PGRST205|schema cache|does not exist|Could not find the table/i.test(body || '')
    : false;
}

async function detectTable() {
  if (cachedTableName) return cachedTableName;
  for (const name of TABLE_CANDIDATES) {
    const response = await rest(`/rest/v1/${name}?select=endpoint&limit=1`, {
      headers: { Accept: 'application/json' },
    });
    const body = await response.text();
    if (isMissingTable(response.status, body)) continue;
    if (response.ok || response.status === 200 || response.status === 206) {
      cachedTableName = name;
      return name;
    }
    // Table exists but RLS/privileges blocked the probe — still try it for writes.
    if (!isMissingTable(response.status, body) && response.status !== 404) {
      cachedTableName = name;
      return name;
    }
  }
  return null;
}

function userHash(userToken) {
  return crypto.createHash('sha256').update(`gdc-push:v1:${userToken}`).digest('hex');
}

function slotPath(userToken, index) {
  return `gdc-push/${userHash(userToken)}/s${index}.bin`;
}

async function readJson(path) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;
  const response = await fetch(url, { headers: restHeaders() });
  if (response.status === 404 || response.status === 400 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`storage read ${response.status}`);
  }
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function insertJson(path, value) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;
  const body = Buffer.from(JSON.stringify(value), 'utf8');
  const response = await fetch(url, {
    method: 'POST',
    headers: restHeaders({
      'Content-Type': 'application/octet-stream',
    }),
    body,
  });
  if (response.status === 409 || response.status === 400) {
    return false;
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`storage write ${response.status}: ${text}`);
  }
  return true;
}

function normalizeSubscription(value) {
  const endpoint = value?.endpoint;
  const p256dh = value?.keys?.p256dh || value?.p256dh;
  const auth = value?.keys?.auth || value?.auth;
  if (!endpoint || !p256dh || !auth) return null;
  return {
    endpoint,
    keys: { p256dh, auth },
  };
}

async function loadSlots(userToken) {
  const slots = await Promise.all(
    Array.from({ length: MAX_SUBSCRIPTIONS }, async (_, index) => ({
      index,
      data: normalizeSubscription(await readJson(slotPath(userToken, index))),
    })),
  );
  return slots;
}

async function loadFromTable(userToken) {
  const table = await detectTable();
  if (!table) return null;
  const response = await rest(
    `/rest/v1/${table}?user_token=eq.${encodeURIComponent(userToken)}&select=endpoint,p256dh,auth`,
    { headers: { Accept: 'application/json' } },
  );
  const text = await response.text();
  if (isMissingTable(response.status, text)) {
    cachedTableName = undefined;
    return null;
  }
  if (!response.ok) {
    console.warn('[pushStore] table load', table, response.status, text.slice(0, 300));
    return [];
  }
  try {
    const rows = JSON.parse(text);
    return (Array.isArray(rows) ? rows : []).map(normalizeSubscription).filter(Boolean);
  } catch {
    return [];
  }
}

async function loadFromStorage(userToken) {
  try {
    return (await loadSlots(userToken)).map((slot) => slot.data).filter(Boolean);
  } catch (error) {
    console.warn('[pushStore] storage load', error);
    return [];
  }
}

async function loadSubscriptions(userToken) {
  const token = String(userToken || '').trim();
  if (!token) return [];
  const fromTable = await loadFromTable(token);
  const fromStorage = await loadFromStorage(token);
  const merged = new Map();
  for (const subscription of [...(fromTable || []), ...fromStorage]) {
    if (subscription?.endpoint) merged.set(subscription.endpoint, subscription);
  }
  return [...merged.values()];
}

async function upsertInTable(userToken, normalized, reportId) {
  const table = await detectTable();
  if (!table) return null;
  const row = {
    user_token: userToken,
    endpoint: normalized.endpoint,
    p256dh: normalized.keys.p256dh,
    auth: normalized.keys.auth,
    updated_at: new Date().toISOString(),
  };
  if (table === 'push_subscriptions' && reportId) {
    row.report_id = reportId;
  }
  const response = await rest(`/rest/v1/${table}?on_conflict=endpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
      Accept: 'application/json',
    },
    body: JSON.stringify(row),
  });
  const text = await response.text();
  if (isMissingTable(response.status, text)) {
    cachedTableName = undefined;
    return null;
  }
  if (!response.ok) {
    throw new Error(`table upsert ${table} ${response.status}: ${text.slice(0, 400)}`);
  }
  const loaded = await loadFromTable(userToken);
  return loaded ? loaded.length : 1;
}

async function upsertInStorage(userToken, normalized) {
  const slots = await loadSlots(userToken);
  if (slots.some((slot) => slot.data?.endpoint === normalized.endpoint)) {
    return slots.filter((slot) => slot.data).length;
  }
  const empty = slots.find((slot) => !slot.data);
  if (!empty) {
    throw new Error('subscription_slots_full');
  }
  const wrote = await insertJson(slotPath(userToken, empty.index), {
    ...normalized,
    created_at: new Date().toISOString(),
  });
  if (!wrote) {
    throw new Error('subscription_slot_busy');
  }
  return slots.filter((slot) => slot.data).length + 1;
}

async function upsertSubscription(userToken, subscription, reportId) {
  const token = String(userToken || '').trim();
  const normalized = normalizeSubscription(subscription);
  if (!token || !normalized) {
    throw new Error('invalid subscription');
  }
  const fromTable = await upsertInTable(token, normalized, reportId ? String(reportId).trim() : '');
  if (fromTable != null) return fromTable;
  return upsertInStorage(token, normalized);
}

async function removeFromTable(userToken, endpoint) {
  const table = await detectTable();
  if (!table || !endpoint) return null;
  const response = await rest(
    `/rest/v1/${table}?endpoint=eq.${encodeURIComponent(endpoint)}`,
    { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
  );
  const text = await response.text();
  if (isMissingTable(response.status, text)) {
    cachedTableName = undefined;
    return null;
  }
  const loaded = await loadFromTable(userToken);
  return loaded ? loaded.length : 0;
}

async function removeSubscription(userToken, subscription) {
  const token = String(userToken || '').trim();
  const endpoint = subscription?.endpoint;
  const fromTable = await removeFromTable(token, endpoint);
  if (fromTable != null) return fromTable;
  const current = await loadFromStorage(token);
  return current.filter((item) => item.endpoint !== endpoint).length;
}

async function deleteEndpoint(endpoint) {
  if (!endpoint) return;
  const table = await detectTable();
  if (!table) return;
  await rest(`/rest/v1/${table}?endpoint=eq.${encodeURIComponent(endpoint)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  }).catch((error) => {
    console.warn('[pushStore] delete stale', error);
  });
}

async function fetchReportUserToken(reportId) {
  const id = String(reportId || '').trim();
  if (!id) return null;
  const response = await rest(
    `/rest/v1/reports?id=eq.${encodeURIComponent(id)}&select=id,user_token`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) {
    throw new Error(`reports ${response.status}`);
  }
  const rows = await response.json();
  return rows?.[0]?.user_token || null;
}

async function probeStore() {
  const table = await detectTable();
  if (table) {
    return { mode: 'table', table };
  }
  return { mode: 'storage', table: null, bucket: BUCKET, prefix: 'gdc-push/' };
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-webhook-secret');
}

module.exports = {
  deleteEndpoint,
  fetchReportUserToken,
  loadSubscriptions,
  probeStore,
  removeSubscription,
  setCors,
  upsertSubscription,
};
