const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

function handlerFor(options = {}) {
  const calls = [];
  const client = {
    rpc: async () => ({data:true,error:null}),
    auth: {
      getUser: async () => ({data:{user:{id:'fake-user'}},error:null}),
      admin: {deleteUser: async id => {calls.push(['auth',id]);return {error:options.authError || null};}}
    },
    from(table) {
      assert.equal(table,'subscriptions');
      return {select(){return this;},eq(){return this;},async maybeSingle(){return {data:options.subscription || null,error:null};}};
    },
    storage: {from(bucket) {
      assert.equal(bucket,'avatars');
      return {async remove(paths){calls.push(['storage',paths]);return {error:options.storageError || null};}};
    }}
  };
  const oldLoad=Module._load, oldFetch=global.fetch;
  const env=['SUPABASE_URL','SUPABASE_SECRET_KEY','CREEM_API_KEY'].map(k=>[k,process.env[k]]);
  process.env.SUPABASE_URL='https://example.invalid'; process.env.SUPABASE_SECRET_KEY='fake'; process.env.CREEM_API_KEY='fake';
  Module._load=function(request,...args){return request==='@supabase/supabase-js' ? {createClient:()=>client} : oldLoad.call(this,request,...args);};
  const path=require.resolve('../api/delete-account'); delete require.cache[path];
  const handler=require(path); Module._load=oldLoad;
  global.fetch=async()=>{calls.push(['creem']);return {ok:!options.creemError,status:500,text:async()=>''};};
  return {handler,calls,cleanup(){global.fetch=oldFetch;for(const [k,v] of env){if(v===undefined)delete process.env[k];else process.env[k]=v;}delete require.cache[path];}};
}

async function run(options) {
  const fixture=handlerFor(options);
  const response={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  try {await fixture.handler({method:'POST',headers:{authorization:'Bearer fictitious'}},response);return {response,calls:fixture.calls};}
  finally {fixture.cleanup();}
}

test('deletion removes only the user avatar before atomic Auth deletion',async()=>{
  const result=await run();
  assert.equal(result.response.code,200);
  assert.deepEqual(result.calls,[['storage',['fake-user/avatar.jpg']],['auth','fake-user']]);
});

test('deletion stops before Auth if Storage fails',async()=>{
  const result=await run({storageError:{message:'falha simulada'}});
  assert.equal(result.response.code,500); assert.deepEqual(result.calls,[['storage',['fake-user/avatar.jpg']]]);
});

test('deletion stops before Storage and Auth if cancellation fails',async()=>{
  const result=await run({subscription:{status:'active',creem_subscription_id:'fake'},creemError:true});
  assert.equal(result.response.code,500); assert.deepEqual(result.calls,[['creem']]);
});

test('Auth failure does not report a successful deletion',async()=>{
  const result=await run({authError:{message:'falha simulada'}});
  assert.equal(result.response.code,500); assert.equal(result.response.body.error,'Erro ao eliminar conta');
});
