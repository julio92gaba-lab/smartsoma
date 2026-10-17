const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const entry = fs.readFileSync('mobile-frame.js', 'utf8');
const shell = fs.readFileSync('mobile-frame-shell.js', 'utf8');

function start(width, framed = false) {
  let redirect, stopped = false;
  const window = {innerWidth:width, location:{pathname:'/app',search:'?source=test',hash:'#token',replace(value){redirect=value;}},stop(){stopped=true;}};
  window.top = framed ? {} : window;
  vm.runInNewContext(entry,{window});
  return {redirect, stopped};
}

test('mobile remains direct and desktop opens the mobile frame without leaking the target in a request',()=>{
  assert.equal(start(760).redirect,undefined);
  assert.equal(start(1200,true).redirect,undefined);
  const result=start(1200);
  assert.equal(result.stopped,true);
  assert.equal(result.redirect,'/mobile-frame.html#%2Fapp%3Fsource%3Dtest%23token');
});

test('frame only loads same-origin app paths and preserves the app address',()=>{
  function source(target) {
    const frame={src:''};
    const window={location:{origin:'https://example.test',hash:'#'+encodeURIComponent(target)},addEventListener(){}};
    vm.runInNewContext(shell,{window,document:{getElementById(){return frame;}},URL});
    return frame.src;
  }
  assert.equal(source('/app.html?x=1#result'),'/app.html?x=1#result');
  assert.equal(source('https://evil.test/app'),'/app');
  assert.equal(source('/login'),'/app');
});

test('frame retains protection against external embedding and keeps external checkout outside the frame',()=>{
  const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
  const headers=config.headers[0].headers;
  assert.match(headers.find(h=>h.key==='Content-Security-Policy').value,/frame-ancestors 'self'/);
  assert.equal(headers.find(h=>h.key==='X-Frame-Options').value,'SAMEORIGIN');
  assert.match(fs.readFileSync('app.html','utf8'),/\(window\.top === window \? window : window\.top\)\.location\.href = json\.url/);
  assert.match(fs.readFileSync('login.html','utf8'),/skipBrowserRedirect: framed/);
});

test('Google login redirects the outer window only when the app is framed',async()=>{
  const login=fs.readFileSync('login.html','utf8');
  const listener=login.match(/document\.getElementById\('btnGoogle'\)\.addEventListener\('click', async \(\) => \{[\s\S]*?\n    \}\);/)[0];
  async function run(framed){
    let click, options;
    const window={location:{origin:'https://example.test',href:'https://example.test/login'}};
    window.top=framed?{location:{href:'https://example.test/frame'}}:window;
    const document={getElementById(){return {addEventListener(_,handler){click=handler;}};}};
    const sb={auth:{async signInWithOAuth(value){options=value.options;return {data:{url:'https://auth.example.test'},error:null};}}};
    vm.runInNewContext(listener,{window,document,sb,handleError:()=>{throw Error('unexpected error');}});
    await click();
    return {window,options};
  }
  const embedded=await run(true), direct=await run(false);
  assert.equal(embedded.options.skipBrowserRedirect,true);
  assert.equal(embedded.window.top.location.href,'https://auth.example.test');
  assert.equal(direct.options.skipBrowserRedirect,false);
  assert.equal(direct.window.location.href,'https://example.test/login');
});
