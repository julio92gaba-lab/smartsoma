const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');

// Baseline após as alterações aprovadas de avatar, sincronização e acesso offline.
test('authentication, cloud persistence and billing endpoints match the approved baseline',()=>{
  const expected={
    'cloud-init.js':'c18f505376996eb5d644f28774f9144fe0ac6ec0fe9ea3f18c35e5d77d8c378d',
    'login.html':'a39520ad9756e4cb538bb6562094b069f1040d7a284a38157a7747e376c4ba1f',
    'api/delete-account.js':'57f169bc259663ba260f46b4e15228e056480b08d43dca0b6ad38b221074c60c',
    'api/webhook.js':'7d93936fb8f016c3328f6b845cc1075819b5fdaa57bf2e88d15b2eada709d7ae',
    'supabase/functions/creem-checkout/index.ts':'c341a62155cb7600e48f7c40eb52b8c1e4a26d06d0ea1464441a0f3012322c16',
    'supabase/functions/creem-webhook/index.ts':'138af3b728b872d06acd82efaa12f73bd99ae9ccd8eb5394a263b1ead9eea953'
  };
  for(const [path,checksum] of Object.entries(expected)) {
    let source=fs.readFileSync(path,'utf8');
    // Explicitly approved Google account-selector fix, released before this UI correction.
    if(path==='login.html') source=source.replace(", queryParams: { prompt: 'select_account' }",'');
    assert.equal(hash(source),checksum,path);
  }
});

test('all inline auth, subscription and account scripts retain baseline source',()=>{
  const html=fs.readFileSync('app.html','utf8');
  const scripts=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/\r\n/g,'\n'));
  assert.equal(hash(JSON.stringify(scripts)),'4baccbb5517dee04c18ce6c956959de312ffa62fb034c654a81c9b7906580cca');
});
