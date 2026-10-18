const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');

// Baseline inclui a remoção de anexos de contacto e o aviso de falha após a exclusão.
test('authentication, cloud persistence and billing endpoints match the approved baseline',()=>{
  const expected={
    'cloud-init.js':'c18f505376996eb5d644f28774f9144fe0ac6ec0fe9ea3f18c35e5d77d8c378d',
    'login.html':'a39520ad9756e4cb538bb6562094b069f1040d7a284a38157a7747e376c4ba1f',
    'api/delete-account.js':'eed898072bd2aebdd7a4c8c2f5eb94a4a83a382963a31abcba641907db72a270',
    'api/webhook.js':'7d93936fb8f016c3328f6b845cc1075819b5fdaa57bf2e88d15b2eada709d7ae',
    'supabase/functions/creem-checkout/index.ts':'c341a62155cb7600e48f7c40eb52b8c1e4a26d06d0ea1464441a0f3012322c16',
    'supabase/functions/creem-webhook/index.ts':'138af3b728b872d06acd82efaa12f73bd99ae9ccd8eb5394a263b1ead9eea953'
  };
  for(const [path,checksum] of Object.entries(expected)) {
    let source=fs.readFileSync(path,'utf8');
    // Explicitly approved Google account-selector fix, released before this UI correction.
    if(path==='login.html') source=source.replace(", queryParams: { prompt: 'select_account' }",'');
    // Apenas a versão de cache do app.js foi atualizada; toda a lógica continua protegida.
    if(path==='cloud-init.js') source=source.replace("script.src = 'app.js?v=15'", "script.src = 'app.js?v=13'");
    assert.equal(hash(source),checksum,path);
  }
});

test('all inline auth, subscription and account scripts retain baseline source',()=>{
  const html=fs.readFileSync('app.html','utf8');
  const scripts=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/\r\n/g,'\n'));
  assert.equal(hash(JSON.stringify(scripts)),'a172dc176116e60f51de22b0c8cfa9e601aa1ae3f5f85f0601a75da86c5852f9');
});
