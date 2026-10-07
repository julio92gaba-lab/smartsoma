const fs = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');

function createApp(seed = {}, { ui = false, cloudBoot = false } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync('app.html', 'utf8'), {
    url: 'https://isolated.smartsoma.test/app', runScripts: 'outside-only',
    pretendToBeVisual: true, virtualConsole
  });
  const w = dom.window;
  const cache = { ...seed };
  w._cloudCache = cache;
  w.cloudGet = key => cache[key] ?? null;
  w.cloudSet = (key, value) => { cache[key] = value; return Promise.resolve(); };
  w.cloudRemove = key => { delete cache[key]; return Promise.resolve(); };
  w.currentUserEmail = 'teste@example.invalid';
  w.currentUser = { id: 'isolated-test', email: w.currentUserEmail };
  w.SmartSomaPro = { isPro: true, entitlementChecked: true };
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollTo = () => {};
  w.HTMLElement.prototype.scrollBy = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {
    get: (_, key) => key === 'measureText' ? () => ({ width: 20 }) : () => {}
  });
  w.fetch = () => { throw new Error('Network forbidden in isolated tests'); };
  if (ui && fs.existsSync('ui-v2.js')) w.eval(fs.readFileSync('ui-v2.js', 'utf8'));
  const writes=[];
  if (cloudBoot) {
    const user={id:'isolated-test',email:'teste@example.invalid',app_metadata:{provider:'email'}};
    w.supabase={createClient:()=>({
      auth:{async getSession(){return{data:{session:{user}}};},async getUser(){return{data:{user}};},async signOut(){},async signInWithPassword(){return{error:null};},async updateUser(){return{error:null};}},
      from(table){if(table!=='user_data')throw new Error('Unexpected table: '+table);return{
        select(){return this;},eq(){return this;},async range(){return{data:Object.entries(seed).map(([key,value])=>({key,value})),error:null};},
        async upsert(row){writes.push(row);return{error:null};}
      };}
    })};
    const append=w.document.body.appendChild.bind(w.document.body);
    w.document.body.appendChild=function(node){
      const result=append(node);
      if(node.tagName==='SCRIPT'&&node.getAttribute('src')==='app.js'){
        w.eval(fs.readFileSync('app.js','utf8'));node.onload();
      }
      return result;
    };
    w.eval(fs.readFileSync('cloud-init.js','utf8'));
  } else {
    w.eval(fs.readFileSync('app.js', 'utf8'));
    w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
    if (ui) w.SmartSomaUI.start();
  }
  const el = id => w.document.getElementById(id);
  const click = id => { const node = el(id); if (!node) throw new Error(`Missing ${id}`); node.click(); };
  const input = (id, value) => { el(id).value = String(value); el(id).dispatchEvent(new w.Event('input', { bubbles: true })); };
  return { dom, w, cache, writes, errors, el, click, input, close: () => dom.window.close() };
}

const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
module.exports = { createApp, dateKey };
