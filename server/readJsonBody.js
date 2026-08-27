async function readJsonBody(req) {
  const raw = req.body;
  if (raw && typeof raw === 'object' && !Buffer.isBuffer(raw) && !Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw === 'string') {
    return raw ? JSON.parse(raw) : {};
  }
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

function endpointHost(endpoint) {
  try {
    return new URL(endpoint).host;
  } catch {
    return 'invalid';
  }
}

module.exports = { endpointHost, readJsonBody };
