const crypto = require('crypto');

const SUPABASE_URL = 'https://lgsspvcxayanodmvgkzb.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3NwdmN4YXlhbm9kbXZna3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTI4MTksImV4cCI6MjA4Mzg4ODgxOX0.YNaDaUcRyjLnn0J8mN3Z3fCzNVH4iGWEJPwNc5rpGDw';

const BUCKET = 'report-photos';
const MAX_SUBSCRIPTIONS = 8;

function restHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
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
  if (!value?.endpoint || !value?.keys?.p256dh || !value?.keys?.auth) return null;
  return {
    endpoint: value.endpoint,
    keys: {
      p256dh: value.keys.p256dh,
      auth: value.keys.auth,
    },
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

async function loadSubscriptions(userToken) {
  try {
    return (await loadSlots(userToken))
      .map((slot) => slot.data)
      .filter(Boolean);
  } catch (error) {
    console.warn('[pushStore] load', error);
    return [];
  }
}

async function upsertSubscription(userToken, subscription) {
  const normalized = normalizeSubscription(subscription);
  if (!userToken || !normalized) {
    throw new Error('invalid subscription');
  }

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

async function removeSubscription(userToken, subscription) {
  // Storage RLS blocks updates/deletes; stale endpoints are ignored at send time.
  const current = await loadSubscriptions(userToken);
  return current.filter((item) => item.endpoint !== subscription?.endpoint).length;
}

async function fetchReportUserToken(reportId) {
  const url = `${SUPABASE_URL}/rest/v1/reports?id=eq.${encodeURIComponent(reportId)}&select=id,user_token`;
  const response = await fetch(url, {
    headers: restHeaders({ Accept: 'application/json' }),
  });
  if (!response.ok) {
    throw new Error(`reports ${response.status}`);
  }
  const rows = await response.json();
  return rows?.[0]?.user_token || null;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-webhook-secret');
}

module.exports = {
  fetchReportUserToken,
  loadSubscriptions,
  removeSubscription,
  setCors,
  upsertSubscription,
};
