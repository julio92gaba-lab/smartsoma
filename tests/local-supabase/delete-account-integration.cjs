// Executado apenas dentro de uma rede Docker interna com dados fictícios.
const http = require('node:http');
const assert = require('node:assert/strict');
const { createClient } = require('@supabase/supabase-js');

const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtZGVtbyIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.EW0RBemI241BjQj38l19QY_3riOftUISMWD6DA_rtQg';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.p7COhAKy2WuULTiu3vp4_zqBaRJ91ZV5o3sJ1YCMYIc';
const origin = 'http://127.0.0.1:18080';
const realFetch = global.fetch;
let creemFails = false;
let storageFails = false;
let authDeleteFails = false;
global.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url);
  if (url.hostname === 'api.creem.io') return new Response('', {status:creemFails ? 500 : 200});
  if (url.origin !== origin) throw new Error('Rede externa bloqueada no teste');
  if (storageFails && url.pathname.startsWith('/storage/v1/object/') && init.method === 'DELETE')
    return new Response(JSON.stringify({message:'Falha simulada'}), {status:500});
  if (authDeleteFails && url.pathname.startsWith('/auth/v1/admin/users/') && init.method === 'DELETE')
    return new Response(JSON.stringify({message:'Falha simulada'}), {status:500});
  return realFetch(input, init);
};

const gateway = http.createServer((req,res) => {
  const routes = [['/auth/v1','auth',9999],['/storage/v1','storage',5000],['/rest/v1','rest',3000]];
  const route = routes.find(([prefix]) => req.url.startsWith(prefix));
  if (!route) {res.writeHead(404);return res.end();}
  const proxy = http.request({hostname:route[1],port:route[2],path:req.url.slice(route[0].length) || '/',method:req.method,headers:req.headers}, upstream => {
    res.writeHead(upstream.statusCode,upstream.headers); upstream.pipe(res);
  });
  proxy.on('error',error => {res.writeHead(502);res.end(error.message);}); req.pipe(proxy);
});

async function main() {
  await new Promise(resolve => gateway.listen(18080,'127.0.0.1',resolve));
  process.env.SUPABASE_URL=origin; process.env.SUPABASE_SECRET_KEY=adminKey; process.env.CREEM_API_KEY='ficticia';
  const handler=require('../../api/delete-account');
  const admin=createClient(origin,adminKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {error:bucketError}=await admin.storage.getBucket('avatars');
  if (bucketError) throw bucketError;
  const runId=Date.now();
  async function user(index, active) {
    const email='teste'+runId+'-'+index+'@example.com', password='SenhaFicticia123!';
    const created=await admin.auth.admin.createUser({email,password,email_confirm:true});
    if(created.error) throw created.error;
    const client=createClient(origin,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
    const login=await client.auth.signInWithPassword({email,password}); if(login.error)throw login.error;
    const id=created.data.user.id;
    const photo=await client.storage.from('avatars').upload(id+'/avatar.jpg',Buffer.from('foto ficticia'),{contentType:'image/jpeg'});
    if(photo.error) throw photo.error;
    for(const result of [
      await admin.from('user_data').insert({user_id:id,key:'teste',value:'dados ficticios'}),
      await admin.from('subscriptions').insert({user_id:id,status:active?'active':'inactive',creem_subscription_id:active?'ficticia':null})
    ]) if(result.error)throw result.error;
    return {id,token:login.data.session.access_token};
  }
  async function remove(u) {
    const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await handler({method:'POST',headers:{authorization:'Bearer '+u.token}},res); return res;
  }
  async function exists(u) {
    const result=await admin.from('user_data').select('user_id').eq('user_id',u.id);
    if(result.error)throw result.error; return result.data.length;
  }
  const first=await user(1,true), other=await user(2,false);
  creemFails=true; assert.equal((await remove(first)).code,500); assert.equal(await exists(first),1);
  creemFails=false; storageFails=true; assert.equal((await remove(first)).code,500); assert.equal(await exists(first),1);
  storageFails=false; authDeleteFails=true; assert.equal((await remove(first)).code,500); assert.equal(await exists(first),1);
  authDeleteFails=false; assert.equal((await remove(first)).code,200);
  assert.equal(await exists(first),0); assert.equal(await exists(other),1);
  const removed=await admin.auth.admin.getUserById(first.id); assert.ok(removed.error);
  const files=await admin.storage.from('avatars').list(first.id); if(files.error)throw files.error;
  assert.equal(files.data.length,0);
  const remaining=await admin.from('subscriptions').select('user_id').eq('user_id',first.id);
  if(remaining.error)throw remaining.error; assert.equal(remaining.data.length,0);
  console.log('Integração isolada: Auth, Storage e dados validados; Creem simulado.');
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>gateway.close());
