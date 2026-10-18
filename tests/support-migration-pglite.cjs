// Isolated in-memory PostgreSQL with minimal Supabase schema stubs; no network or real data.
// SMARTSOMA_PGLITE_PATH must point to a temporary installation of @electric-sql/pglite.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PGlite } = require(process.env.SMARTSOMA_PGLITE_PATH);

async function main() {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE ROLE anon;
      CREATE ROLE authenticated;
      CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY);
      CREATE SCHEMA storage;
      CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    `);
    await db.exec(fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261018091754_support_contact.sql'), 'utf8'));
    const bucket = await db.query("SELECT public, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = 'support-attachments'");
    assert.equal(bucket.rows[0].public, false);
    assert.equal(Number(bucket.rows[0].file_size_limit), 10485760);
    assert.equal(bucket.rows[0].allowed_mime_types.includes('application/octet-stream'), false);
    await db.exec("INSERT INTO auth.users(id) VALUES ('123e4567-e89b-42d3-a456-426614174000')");
    await db.exec(`INSERT INTO public.support_contacts(id,user_id,sender_name,sender_email,subject,message)
      VALUES ('123e4567-e89b-42d3-a456-426614174001','123e4567-e89b-42d3-a456-426614174000','Teste','teste@example.invalid','Assunto','Mensagem')`);
    await assert.rejects(db.exec(`INSERT INTO public.support_contacts(id,user_id,sender_name,sender_email,subject,message)
      VALUES ('123e4567-e89b-42d3-a456-426614174002','123e4567-e89b-42d3-a456-426614174000','Teste','teste@example.invalid','','Mensagem')`), /check constraint/i);
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`SET ROLE ${role}`);
      await assert.rejects(db.query('SELECT * FROM public.support_contacts'), /permission denied/i);
      await db.exec('RESET ROLE');
    }
    await db.exec('SET ROLE service_role');
    assert.equal((await db.query('SELECT id FROM public.support_contacts')).rows.length, 1);
    await db.exec('RESET ROLE');
    await db.query('DELETE FROM auth.users WHERE id = $1', ['123e4567-e89b-42d3-a456-426614174000']);
    assert.equal((await db.query('SELECT id FROM public.support_contacts')).rows.length, 0);
    console.log('PASS migration: bucket privado, validação, permissões e eliminação em cascata.');
  } finally {
    await db.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
