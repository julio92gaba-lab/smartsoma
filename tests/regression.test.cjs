const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp, dateKey } = require('./app-harness.cjs');

test('all HTML IDs are unique', () => {
  const ids = [...fs.readFileSync('app.html', 'utf8').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size);
});

test('income replaces a daily platform value and preserves other platforms', t => {
  const a = createApp(); t.after(a.close);
  a.click('listRowUber'); a.input('uberValorInput', '123.45'); a.click('uberSalvarBtn');
  a.click('listRowBolt'); a.input('boltValorInput', '30'); a.click('boltSalvarBtn');
  a.click('listRowUber'); assert.equal(a.el('uberValorInput').value, '123.45');
  a.input('uberValorInput', '80'); a.click('uberSalvarBtn');
  const saved = JSON.parse(a.cache['homeBadgeValores:' + dateKey(new Date())]);
  assert.equal(saved.uber, 80); assert.equal(saved.bolt, 30);
  assert.equal(a.el('summaryBrutoValue').textContent, '€110.00');
  assert.equal(a.el('summaryLiquidoValue').textContent, '€110.00');
});

test('income caps and custom platform values use original storage', t => {
  const a = createApp(); t.after(a.close);
  a.input('uberValorInput', '2000'); a.click('uberSalvarBtn');
  assert.equal(a.w.HomeBadges.get().uber, 999.99);
  a.w.HomeBadges.setPlat('custom-test', 40);
  assert.equal(a.w.HomeBadges.getPlat('custom-test'), 40);
  assert.equal(a.el('summaryBrutoValue').textContent, '€1039.99');
});

test('total mileage persists and updates summary', t => {
  const a = createApp(); t.after(a.close);
  a.click('listRowDistancia'); a.click('distanciaModoTotalBtn');
  a.input('distanciaValorInput', '115'); a.click('distanciaSalvarBtn');
  assert.equal(a.w.HomeBadges.get().distancia, 115);
  assert.equal(a.el('summaryDistanciaValue').textContent, '115 km');
});

test('weekly table always includes seven days and gross, net and km columns', t => {
  const a = createApp(); t.after(a.close);
  const table = a.w.document.querySelector('.semana-table');
  assert.ok(table); assert.equal(table.querySelectorAll('tbody tr').length, 7);
  assert.equal(table.querySelectorAll('thead th').length, 7);
});

test('language, theme and font controls stay available', t => {
  const a = createApp(); t.after(a.close);
  a.click('btnToggleTheme'); assert.ok(a.w.document.body.classList.contains('theme-dark'));
  a.w.I18N.setLang('en'); assert.equal(a.w.I18N.getLang(), 'en');
  a.click('tamanhoOptionG'); assert.ok(a.w.document.documentElement.classList.contains('tam-medio'));
  a.click('tamanhoOptionP'); assert.ok(!a.w.document.documentElement.classList.contains('tam-medio'));
});
