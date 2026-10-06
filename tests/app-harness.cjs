const fs = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');

function createApp(seed = {}, { ui = false } = {}) {
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
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {
    get: (_, key) => key === 'measureText' ? () => ({ width: 20 }) : () => {}
  });
  w.fetch = () => { throw new Error('Network forbidden in isolated tests'); };
  if (ui && fs.existsSync('ui-v2.js')) w.eval(fs.readFileSync('ui-v2.js', 'utf8'));
  w.eval(fs.readFileSync('app.js', 'utf8'));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  const el = id => w.document.getElementById(id);
  const click = id => { const node = el(id); if (!node) throw new Error(`Missing ${id}`); node.click(); };
  const input = (id, value) => { el(id).value = String(value); el(id).dispatchEvent(new w.Event('input', { bubbles: true })); };
  return { dom, w, cache, errors, el, click, input, close: () => dom.window.close() };
}

const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
module.exports = { createApp, dateKey };
