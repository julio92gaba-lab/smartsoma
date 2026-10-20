// Legacy Vercel endpoint: forward signed deliveries to the single Supabase
// handler. Keep it only during the dashboard cutover; it contains no billing
// rules and cannot independently grant access.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const supabaseUrl = process.env.SUPABASE_URL;
  const signature = req.headers['creem-signature'];
  if (!supabaseUrl || typeof signature !== 'string') return res.status(401).json({ error: 'Unauthorized' });
  let raw = '';
  try {
    raw = await new Promise((resolve, reject) => {
      req.on('data', chunk => {
        raw += chunk;
        if (Buffer.byteLength(raw, 'utf8') > 65536) reject(new Error('Payload too large'));
      });
      req.on('end', () => resolve(raw));
      req.on('error', reject);
    });
    const response = await fetch(`${supabaseUrl}/functions/v1/creem-webhook`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'creem-signature': signature }, body: raw
    });
    return res.status(response.status).send(await response.text());
  } catch {
    return res.status(502).json({ error: 'Webhook unavailable' });
  }
};
module.exports.config = { api: { bodyParser: false } };
