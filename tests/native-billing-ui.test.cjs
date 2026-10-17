'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

test('Android explains unavailable purchases and blocks the web checkout', () => {
  const dom = new JSDOM('<div id="subExpiradaCard"><h3 id="subExpiradaTitle">Original</h3><p class="mm-helper-text">Trial</p><button id="subExpiradaBtnSemanal">Plano</button><button id="subExpiradaBtnMensal">Plano</button><button id="subExpiradaSairBtn">Sair</button></div>', { runScripts: 'outside-only' });
  const { window } = dom;
  let checkouts = 0, signouts = 0;
  for (const id of ['subExpiradaBtnSemanal', 'subExpiradaBtnMensal']) window.document.getElementById(id).addEventListener('click', () => checkouts++);
  window.document.getElementById('subExpiradaSairBtn').addEventListener('click', () => signouts++);
  window.eval(fs.readFileSync('scripts/native-billing-ui.js', 'utf8'));
  assert.match(window.document.querySelector('.mm-helper-text').textContent, /Google Play estão em preparação/);
  assert.match(window.document.querySelector('.mm-helper-text').dataset.original, /mesma conta/);
  window.document.getElementById('subExpiradaBtnSemanal').click();
  window.document.getElementById('subExpiradaBtnMensal').click();
  window.document.getElementById('subExpiradaSairBtn').click();
  assert.equal(checkouts, 0); assert.equal(signouts, 1);
  dom.window.close();
});

test('only the Android package receives the billing preparation screen', () => {
  const script = fs.readFileSync('scripts/prepare-capacitor.cjs', 'utf8');
  const web = fs.readFileSync('app.html', 'utf8');
  assert.match(script, /native-billing-ui\.js/);
  assert.match(script, /sub-expired-plans[^}]*display:none!important/);
  assert.doesNotMatch(web, /native-billing-ui\.js/);
});

test('Android preserves a connection error that was already displayed', () => {
  const dom = new JSDOM('<div id="subExpiradaCard"><h3 id="subExpiradaTitle">Ligação necessária</h3><p class="mm-helper-text">Verifica a ligação.</p></div>', { runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('scripts/native-billing-ui.js', 'utf8'));
  const title = dom.window.document.getElementById('subExpiradaTitle');
  const text = dom.window.document.querySelector('.mm-helper-text');
  assert.equal(title.textContent, 'Ligação necessária');
  assert.equal(text.textContent, 'Verifica a ligação.');
  assert.equal(title.dataset.original, 'Subscrição no Android');
  assert.match(text.dataset.original, /Google Play/);
  dom.window.close();
});
