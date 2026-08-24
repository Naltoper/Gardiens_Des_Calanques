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

function subscriptionObjectPath(userToken) {
  const hash = crypto.createHash('sha256').update(`gdc-push:v1:${userToken}`).digest('hex');
  return `gdc-push/${hash}.json`;
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

async function writeJson(path, value) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;
  const body = Buffer.from(JSON.stringify(value), 'utf8');
  const response = await fetch(url, {
    method: 'POST',
    headers: restHeaders({
      'Content-Type': 'application/octet-stream',
      'x-upsert': 'true',
    }),
    body,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`storage write ${response.status}: ${text}`);
  }
}

async function loadSubscriptions(userToken) {
  try {
    const data = await readJson(subscriptionObjectPath(userToken));
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.subscriptions)) return data.subscriptions;
    return [];
  } catch (error) {
    console.warn('[pushStore] load', error);
    return [];
  }
}

async function saveSubscriptions(userToken, subscriptions) {
  await writeJson(subscriptionObjectPath(userToken), {
    user_token: userToken,
    updated_at: new Date().toISOString(),
    subscriptions: subscriptions.slice(-MAX_SUBSCRIPTIONS),
  });
}

function sameSubscription(a, b) {
  return a?.endpoint && a.endpoint === b?.endpoint;
}

async function upsertSubscription(userToken, subscription) {
  if (!userToken || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    throw new Error('invalid subscription');
  }
  const current = await loadSubscriptions(userToken);
  const next = current.filter((item) => !sameSubscription(item, subscription));
  next.push({
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    created_at: new Date().toISOString(),
  });
  await saveSubscriptions(userToken, next);
  return next.length;
}

async function removeSubscription(userToken, subscription) {
  const current = await loadSubscriptions(userToken);
  const next = current.filter((item) => !sameSubscription(item, subscription));
  await saveSubscriptions(userToken, next);
  return next.length;
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
