const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');

// Baseline após a integração explicitamente aprovada do avatar com o Storage.
test('authentication, cloud persistence and billing endpoints match the approved baseline',()=>{
  const expected={
    'cloud-init.js':'55a85baa5c2d041cb221c89600cf46d386a128c4de8a3e57f192c20351a17e8b',
    'login.html':'25f0a6c9e27d620c5ce104fe2f0136d649d51646549938f08bf924ac9df5db8c',
    'api/delete-account.js':'bc9e8a39a30ccb32229a9b568d69ffb883605189c667ffd5a80a341d04dda3d5',
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
  assert.equal(hash(JSON.stringify(scripts)),'4cf4e982371f8075fdd9993bf5835adf6fdb7135f2b7d920c6ae6702dda7b924');
});
