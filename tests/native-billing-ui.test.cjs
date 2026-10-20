'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

test('Android is consumption-only and can recheck without signing in again', () => {
  const dom = new JSDOM('<div id="subExpiradaCard"><h3 id="subExpiradaTitle">Original</h3><p class="mm-helper-text">Trial</p><div class="sub-expired-plans"><button>€2</button></div><p class="cancelar-sub-note">trial</p><div class="mm-secondary-action"><button id="subExpiradaSairBtn">Sair</button></div></div><section id="cancelarSubscricaoSection"></section>', { runScripts: 'outside-only' });
  let rechecks = 0; dom.window.verificarPlano = () => rechecks++;
  dom.window.eval(fs.readFileSync('scripts/native-billing-ui.js', 'utf8'));
  const text = dom.window.document.querySelector('.mm-helper-text');
  assert.equal(dom.window.document.getElementById('subExpiradaTitle').textContent, 'Subscrição não encontrada');
  assert.match(text.textContent, /www\.smartsoma\.pt/);
  assert.equal(text.querySelector('a'), null);
  assert.equal(dom.window.document.querySelector('.sub-expired-plans'), null);
  assert.equal(dom.window.document.getElementById('cancelarSubscricaoSection'), null);
  dom.window.document.getElementById('subExpiradaReverBtn').click();
  assert.equal(rechecks, 1); dom.window.close();
});

test('Android explains an unpaid subscription without offering a payment flow', () => {
  const dom = new JSDOM('<div id="subExpiradaCard"><h3 id="subExpiradaTitle">Original</h3><p class="mm-helper-text">Trial</p><div class="mm-secondary-action"><button id="subExpiradaSairBtn">Sair</button></div></div>', { runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('scripts/native-billing-ui.js', 'utf8'));
  dom.window.atualizarMensagemSubscricao({ status: 'unpaid' }, true);
  const text = dom.window.document.querySelector('.mm-helper-text');
  assert.equal(dom.window.document.getElementById('subExpiradaTitle').textContent, 'Subscrição precisa de atenção');
  assert.match(text.textContent, /regulariza a tua subscrição/i);
  assert.equal(text.querySelector('a'), null);
  dom.window.close();
});
