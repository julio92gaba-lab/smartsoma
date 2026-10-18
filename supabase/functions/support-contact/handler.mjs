const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 256 * 1024;
const origins = new Set(['https://smartsoma.pt', 'https://www.smartsoma.pt', 'https://localhost']);
const extensions = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm'
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function headers(origin) {
  return {
    ...(origins.has(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json'
  };
}
function json(origin, status, body) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) });
}
function textField(form, key, limit) {
  const items = form.getAll(key);
  if (items.length !== 1 || typeof items[0] !== 'string') return null;
  const value = items[0].trim();
  return value.length > 0 && value.length <= limit ? value : null;
}
function hasSignature(bytes, type) {
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === 'image/png') return [137,80,78,71,13,10,26,10].every((byte, i) => bytes[i] === byte);
  if (type === 'image/webp') return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
  if (type === 'video/mp4' || type === 'video/quicktime') return ascii(4, 8) === 'ftyp';
  if (type === 'video/webm') return [0x1a,0x45,0xdf,0xa3].every((byte, i) => bytes[i] === byte);
  return false;
}
async function boundedForm(req) {
  if (Number(req.headers.get('content-length') || 0) > MAX_REQUEST_BYTES || !req.body) return null;
  const reader = req.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.length;
      if (length > MAX_REQUEST_BYTES) { await reader.cancel(); return null; }
      chunks.push(part.value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    return await new Request(req.url, { method: 'POST', headers: req.headers, body }).formData();
  } catch { return null; }
}

export function createSupportHandler({ makeClient, getEnv, sendFetch = fetch }) {
  return async function handle(req) {
    const origin = req.headers.get('origin') || '';
    if (origin && !origins.has(origin)) return json(origin, 403, { error: 'Origem não permitida' });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers(origin) });
    if (req.method !== 'POST') return json(origin, 405, { error: 'Método não permitido' });
    const authorization = req.headers.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return json(origin, 401, { error: 'Sessão inválida' });
    try {
      const apiKey = getEnv('RESEND_CONTACT_API_KEY');
      const client = makeClient();
      if (!apiKey || !client) return json(origin, 503, { error: 'Contacto temporariamente indisponível' });
      const auth = await client.auth.getUser(token);
      const user = auth.data?.user;
      if (auth.error || !user || !uuid.test(user.id) || typeof user.email !== 'string' || user.email.length > 254) {
        return json(origin, 401, { error: 'Sessão inválida' });
      }
      const limit = await client.rpc('consume_rate_limit', {
        p_scope: 'support-contact-user', p_identifier: user.id, p_limit: 10, p_window_seconds: 3600
      });
      if (limit.error) return json(origin, 503, { error: 'Contacto temporariamente indisponível' });
      if (limit.data !== true) return json(origin, 429, { error: 'Demasiadas tentativas. Tenta mais tarde.' });
      const form = await boundedForm(req);
      if (!form) return json(origin, 413, { error: 'Pedido inválido ou demasiado grande' });
      const id = textField(form, 'id', 36), name = textField(form, 'name', 120);
      const subject = textField(form, 'subject', 120), message = textField(form, 'message', 5000);
      const files = form.getAll('attachment');
      if (!id || !uuid.test(id) || !name || !subject || !message || files.length > 1 ||
          [...form.keys()].some(key => !['id','name','subject','message','attachment'].includes(key))) {
        return json(origin, 400, { error: 'Preenche os campos corretamente' });
      }
      const file = files[0];
      let fileBytes = null, path = null;
      if (file) {
        if (typeof file === 'string' || !extensions[file.type] || !file.size || file.size > MAX_FILE_BYTES) {
          return json(origin, 400, { error: 'Anexo inválido ou superior a 10 MB' });
        }
        fileBytes = new Uint8Array(await file.arrayBuffer());
        if (!hasSignature(fileBytes, file.type)) return json(origin, 400, { error: 'Formato do anexo inválido' });
        path = `${user.id}/${id}.${extensions[file.type]}`;
      }
      const prior = await client.from('support_contacts').select('id,user_id,notification_sent_at').eq('id', id).maybeSingle();
      if (prior.error) return json(origin, 503, { error: 'Contacto temporariamente indisponível' });
      if (prior.data && prior.data.user_id !== user.id) return json(origin, 409, { error: 'Pedido inválido' });
      if (prior.data?.notification_sent_at) return json(origin, 200, { ok: true });
      if (!prior.data) {
        if (fileBytes) {
          const upload = await client.storage.from('support-attachments').upload(path, fileBytes, { contentType: file.type, upsert: false });
          if (upload.error) return json(origin, 503, { error: 'Não foi possível guardar o anexo' });
        }
        const inserted = await client.from('support_contacts').insert({
          id, user_id: user.id, sender_name: name, sender_email: user.email,
          subject, message, attachment_path: path
        });
        if (inserted.error) {
          if (path) await client.storage.from('support-attachments').remove([path]);
          return json(origin, 503, { error: 'Não foi possível guardar a mensagem' });
        }
      }
      // O email é apenas um aviso: não envia os dados pessoais nem os anexos ao Resend.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      let response;
      try {
        response = await sendFetch('https://api.resend.com/emails', {
          method: 'POST', signal: controller.signal,
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `support/${id}` },
          body: JSON.stringify({
            from: 'SmartSoma <contacto@smartsoma.pt>', to: ['contacto@smartsoma.pt'],
            subject: 'SmartSoma: novo contacto',
            text: `Recebeste um novo pedido de contacto. Consulta a tabela support_contacts e os anexos privados no Supabase. Referência: ${id}`
          })
        });
      } finally { clearTimeout(timer); }
      if (!response.ok) return json(origin, 503, { error: 'Mensagem guardada, mas não foi possível confirmar o aviso. Tenta novamente ou escreve para contacto@smartsoma.pt.' });
      await client.from('support_contacts').update({ notification_sent_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id);
      return json(origin, 200, { ok: true });
    } catch {
      return json(origin, 503, { error: 'Não foi possível confirmar o envio. Tenta novamente ou escreve para contacto@smartsoma.pt.' });
    }
  };
}
