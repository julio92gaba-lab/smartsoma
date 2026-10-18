const BATCH_SIZE = 30;
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const filePath = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp|mp4|mov|webm)$/i;

async function matchesSecret(received, expected) {
  if (typeof expected !== 'string' || expected.length < 32 || received.length > 256) return false;
  const encode = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest('SHA-256', encode.encode(received)),
    crypto.subtle.digest('SHA-256', encode.encode(expected))
  ]);
  const a = new Uint8Array(left), b = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}

function reply(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

export function createCleanupHandler({ makeClient, getEnv, now = () => Date.now() }) {
  return async function handle(req) {
    if (req.method !== 'POST') return reply(405, { error: 'Método não permitido' });
    try {
      if (!await matchesSecret(req.headers.get('x-support-cleanup-secret') || '', getEnv('SUPPORT_CLEANUP_SECRET'))) {
        return reply(401, { error: 'Não autorizado' });
      }
      const client = makeClient();
      if (!client) return reply(503, { error: 'Limpeza indisponível' });
      const cutoff = new Date(now() - RETENTION_MS).toISOString();
      const { data, error } = await client.from('support_contacts')
        .select('id,user_id,attachment_path').lt('created_at', cutoff).order('created_at').limit(BATCH_SIZE);
      if (error || !Array.isArray(data)) return reply(503, { error: 'Limpeza indisponível' });
      let completed = 0, failed = 0;
      for (const row of data) {
        if (row.attachment_path) {
          const expectedPrefix = `${row.user_id}/${row.id}.`;
          if (!filePath.test(row.attachment_path) || !row.attachment_path.startsWith(expectedPrefix)) { failed++; continue; }
          const removed = await client.storage.from('support-attachments').remove([row.attachment_path]);
          if (removed.error) { failed++; continue; }
        }
        const deleted = await client.from('support_contacts').delete().eq('id', row.id).lt('created_at', cutoff);
        if (deleted.error) { failed++; continue; }
        completed++;
      }
      return reply(failed ? 503 : 200, { completed, failed, mayHaveMore: data.length === BATCH_SIZE });
    } catch {
      return reply(503, { error: 'Limpeza indisponível' });
    }
  };
}
