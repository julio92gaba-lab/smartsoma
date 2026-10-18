const { test } = require('node:test');
const assert = require('node:assert/strict');

const USER_ID = '123e4567-e89b-42d3-a456-426614174000';
const MESSAGE_ID = '123e4567-e89b-42d3-a456-426614174001';
const handlerModule = import('../supabase/functions/support-contact/handler.mjs');

function fixture(options = {}) {
  const rows = new Map(), files = new Map(), emails = [];
  const client = {
    auth: { getUser: async token => token === 'valid' ?
      { data: { user: { id: USER_ID, email: 'utilizador@example.com' } }, error: null } :
      { data: { user: null }, error: { message: 'invalid' } } },
    rpc: async () => ({ data: options.rateLimit !== false, error: null }),
    storage: { from(bucket) {
      assert.equal(bucket, 'support-attachments');
      return {
        async upload(path, contents) { if (files.has(path)) return { error: 'exists' }; files.set(path, contents); return { error: null }; },
        async remove(paths) { paths.forEach(path => files.delete(path)); return { error: null }; }
      };
    } },
    from(table) {
      assert.equal(table, 'support_contacts');
      return {
        select() { return { eq(key, id) { return { async maybeSingle() { return { data: rows.get(id) || null, error: null }; } }; } }; },
        async insert(row) { rows.set(row.id, { ...row }); return { error: null }; },
        update(values) { return { eq(key, id) { return { async eq() { Object.assign(rows.get(id), values); return { error: null }; } }; } }; }
      };
    }
  };
  let emailAvailable = options.emailAvailable !== false;
  return {
    rows, files, emails,
    enableEmail() { emailAvailable = true; },
    async handle(request) {
      const { createSupportHandler } = await handlerModule;
      return createSupportHandler({
        makeClient: () => client, getEnv: () => 'fake-key',
        sendFetch: async (url, requestOptions) => { emails.push({ url, ...requestOptions }); return { ok: emailAvailable }; }
      })(request);
    }
  };
}

function request({ token = 'valid', origin = 'https://smartsoma.pt', attachment, extra } = {}) {
  const body = new FormData();
  body.append('id', MESSAGE_ID);
  body.append('name', 'Nome Teste');
  body.append('subject', 'Assunto privado');
  body.append('message', 'Mensagem privada');
  if (attachment) body.append('attachment', attachment, 'ficheiro');
  if (extra) body.append(extra[0], extra[1]);
  return new Request('https://example.invalid/support-contact', {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, Origin: origin }, body
  });
}

test('contact accepts only permitted origins and valid sessions', async () => {
  const f = fixture();
  const preflight = await f.handle(new Request('https://example.invalid', { method: 'OPTIONS', headers: { Origin: 'https://localhost' } }));
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://localhost');
  assert.equal((await f.handle(request({ origin: 'https://evil.invalid' }))).status, 403);
  assert.equal((await f.handle(request({ token: 'invalid' }))).status, 401);
  assert.equal(f.rows.size, 0);
});

test('contact stores authenticated email and sends only a generic notification', async () => {
  const f = fixture();
  const response = await f.handle(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(f.rows.get(MESSAGE_ID).sender_email, 'utilizador@example.com');
  const email = JSON.parse(f.emails[0].body);
  assert.deepEqual(email.to, ['contacto@smartsoma.pt']);
  assert.match(email.text, new RegExp(MESSAGE_ID));
  assert.doesNotMatch(f.emails[0].body, /Nome Teste|utilizador@example.com|Assunto privado|Mensagem privada/);
  assert.ok(f.rows.get(MESSAGE_ID).notification_sent_at);
});

test('contact validates attachment signatures and stores supported files privately', async () => {
  const f = fixture();
  const valid = new Blob([Uint8Array.from([0xff, 0xd8, 0xff, 0x00])], { type: 'image/jpeg' });
  assert.equal((await f.handle(request({ attachment: valid }))).status, 200);
  assert.equal(f.rows.get(MESSAGE_ID).attachment_path, `${USER_ID}/${MESSAGE_ID}.jpg`);
  assert.equal(f.files.size, 1);
  const invalid = fixture();
  assert.equal((await invalid.handle(request({ attachment: new Blob(['not an image'], { type: 'image/jpeg' }) }))).status, 400);
  assert.equal(invalid.files.size, 0);
  assert.equal((await invalid.handle(request({ extra: ['unexpected', 'value'] }))).status, 400);
  assert.equal((await invalid.handle(request({ extra: ['subject', 'duplicate'] }))).status, 400);
  const tooLarge = new Blob([new Uint8Array(10 * 1024 * 1024 + 1)], { type: 'image/jpeg' });
  assert.equal((await invalid.handle(request({ attachment: tooLarge }))).status, 400);
  const unsupported = new Blob(['file'], { type: 'application/octet-stream' });
  assert.equal((await invalid.handle(request({ attachment: unsupported }))).status, 400);
  assert.equal(invalid.rows.size, 0);
});

test('contact rate limit and request size reject before saving', async () => {
  const limited = fixture({ rateLimit: false });
  assert.equal((await limited.handle(request())).status, 429);
  assert.equal(limited.rows.size, 0);
  const oversized = fixture();
  const response = await oversized.handle(new Request('https://example.invalid', {
    method: 'POST', headers: { Authorization: 'Bearer valid', Origin: 'https://smartsoma.pt', 'Content-Length': String(11 * 1024 * 1024) }, body: 'x'
  }));
  assert.equal(response.status, 413);
  assert.equal(oversized.rows.size, 0);
});

test('retry after notification failure reuses the message and attachment', async () => {
  const f = fixture({ emailAvailable: false });
  const attachment = new Blob([Uint8Array.from([0xff, 0xd8, 0xff])], { type: 'image/jpeg' });
  assert.equal((await f.handle(request({ attachment }))).status, 503);
  assert.equal(f.rows.size, 1);
  assert.equal(f.files.size, 1);
  f.enableEmail();
  assert.equal((await f.handle(request({ attachment }))).status, 200);
  assert.equal(f.rows.size, 1);
  assert.equal(f.files.size, 1);
  assert.equal(f.emails[0].headers['Idempotency-Key'], `support/${MESSAGE_ID}`);
  assert.equal(f.emails[1].headers['Idempotency-Key'], `support/${MESSAGE_ID}`);
  assert.equal((await f.handle(request({ attachment }))).status, 200);
  assert.equal(f.emails.length, 2);
});
