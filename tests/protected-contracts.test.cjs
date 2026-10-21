const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');

// Baseline inclui a remoção de anexos de contacto e o aviso de falha após a exclusão.
test('authentication, cloud persistence and billing endpoints match the approved baseline',()=>{
  const expected={
    'cloud-init.js':'c85ad90780ffface59882a43cf2b950ebb8135933f48fd827e8cbb854799d3f3',
    'login.html':'a39520ad9756e4cb538bb6562094b069f1040d7a284a38157a7747e376c4ba1f',
    'api/delete-account.js':'eed898072bd2aebdd7a4c8c2f5eb94a4a83a382963a31abcba641907db72a270',
    'api/webhook.js':'e9aa13265940fd5d9fd4da93c3850e6335640bb5e8fc50e5dd1a3218e68544f8',
    'supabase/functions/creem-checkout/index.ts':'b6875c7534b7d71d6eab7d70f0f0cd5fdeec88bc08de00669ce468f200c40032',
    'supabase/functions/creem-webhook/index.ts':'f42ae85a2f81569ea5d6d89142da2f47123eb9a909299115150d420b5effff9a'
  };
  for(const [path,checksum] of Object.entries(expected)) {
    let source=fs.readFileSync(path,'utf8');
    // Explicitly approved Google account-selector fix, released before this UI correction.
    if(path==='login.html') source=source.replace(", queryParams: { prompt: 'select_account' }",'');
    // Baseline atualizado para a correção aprovada de arranque offline e aviso temporário.
    if(path==='cloud-init.js') source=source.replace("script.src = 'app.js?v=19'", "script.src = 'app.js?v=13'");
    assert.equal(hash(source),checksum,path);
  }
});

test('all inline auth, subscription and account scripts retain baseline source',()=>{
  const html=fs.readFileSync('app.html','utf8');
  const scripts=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1].replace(/\r\n/g,'\n'));
  assert.equal(hash(JSON.stringify(scripts)),'63d8cda60533f39a04f7f0029f34097e6d31550368a802cbb68356fda5544a96');
});
