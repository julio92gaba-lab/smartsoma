'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp, dateKey } = require('./app-harness.cjs');

const settle = () => new Promise(resolve => setTimeout(resolve, 120));

function monday(date = new Date()) {
  const value = new Date(date); value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - (value.getDay() + 6) % 7);
  return value;
}

test('the four-day rule assigns cross-month and cross-year weeks consistently', t => {
  const app = createApp();
  t.after(app.close);
  const september = app.w.SmartSomaWeeks.weeksForMonth(2020, 8);
  const october = app.w.SmartSomaWeeks.weeksForMonth(2020, 9);
  const crossMonth = new Date(2020, 8, 28).getTime();

  assert.equal(september.some(week => week.monday.getTime() === crossMonth), false);
  assert.equal(october.some(week => week.monday.getTime() === crossMonth), true);
  const yearBoundary = app.w.SmartSomaWeeks.ownerMonth(new Date(2021, 0, 1));
  assert.equal(yearBoundary.year, 2020);
  assert.equal(yearBoundary.month, 11);
});

test('fixed expenses can start in a selected retroactive week', async t => {
  const app = createApp({}, { ui: true });
  t.after(app.close);
  app.w.SmartSomaUI.go('ajustes');
  app.click('openDespesasFixasBtn');
  app.click('uiFixedAdd');
  app.click('fixasRetroSwitch');
  assert.equal(app.el('fixasRetroPeriodModalBackdrop').classList.contains('visible'), true);
  app.click('fixasRetroMonthPrev');
  const selected = app.el('fixasRetroWeekList').querySelector('button');
  selected.click();
  assert.equal(app.el('fixasRetroPeriodModalBackdrop').classList.contains('visible'), false);
  assert.equal(app.el('fixasRetroSwitch').getAttribute('aria-checked'), 'true');
  assert.equal(app.el('fixasRetroHint').classList.contains('is-selected'), true);

  app.click('despesaTipoEuroBtn');
  app.input('despesaDescInput', 'Seguro retroativo');
  app.input('despesaValorInput', '35');
  app.click('despesaSalvarBtn');
  await settle();
  const item = JSON.parse(app.cache.despesasFixas).items[0];
  const owner = app.w.SmartSomaWeeks.ownerMonth(new Date());
  let month = owner.month - 1, year = owner.year;
  if (month < 0) { month = 11; year--; }
  assert.equal(item.desde, dateKey(app.w.SmartSomaWeeks.weeksForMonth(year, month)[0].monday));
});

test('weekly expense card edits and deletes the original daily expense', async t => {
  const day = monday();
  const seed = { ['despesasDiarias:' + dateKey(day)]: JSON.stringify({ seq: 1, items: [{ id: 1, descricao: 'Combustível muito longo para testar o truncamento visual', valor: 20 }] }) };
  const app = createApp(seed, { ui: true });
  t.after(app.close);
  app.w.SmartSomaUI.go('semana');
  await settle();
  const pencil = app.w.document.querySelector('.semana-expense-edit-btn');
  assert.ok(pencil);
  pencil.click();
  assert.equal(app.el('semanaDespesaEditBackdrop').classList.contains('visible'), true);
  assert.match(app.el('semanaDespesaEditDesc').textContent, /Combustível muito longo/);
  app.input('semanaDespesaEditValorInput', '32,50');
  app.click('semanaDespesaEditSaveBtn');
  assert.equal(JSON.parse(app.cache['despesasDiarias:' + dateKey(day)]).items[0].valor, 32.5);

  await settle();
  app.w.document.querySelector('.semana-expense-edit-btn').click();
  app.click('semanaDespesaEditDeleteBtn');
  assert.equal(app.el('semanaDespesaDeleteBackdrop').classList.contains('visible'), true);
  app.click('semanaDespesaDeleteConfirmBtn');
  assert.deepEqual(JSON.parse(app.cache['despesasDiarias:' + dateKey(day)]).items, []);
  assert.equal(app.el('semanaDespesaEditBackdrop').classList.contains('visible'), false);
});

test('week navigation updates the goal card and opens its retroactive editor', async t => {
  const app = createApp({}, { ui: true });
  t.after(app.close);
  app.w.SmartSomaUI.go('semana');
  await settle();
  app.click('semanaWeekPrev');
  await settle();
  assert.equal(app.el('metaSemanalWeekBox').hidden, false);
  app.click('btnMetaSemanalSemanaConsultada');
  assert.equal(app.el('metaSemanalRetroModalBackdrop').classList.contains('visible'), true);
  const selectedMonday = dateKey(app.w.GanhosDate.get());
  app.input('metaSemanalRetroValorInput', '180');
  app.click('metaSemanalRetroSalvarBtn');
  assert.equal(JSON.parse(app.cache['metaSemanalConfig:' + selectedMonday]).valor, 180);
});

test('opening forms and modals never focuses a text field automatically', t => {
  const app = createApp({}, { ui: true });
  t.after(app.close);
  app.w.SmartSomaUI.go('ajustes');
  app.click('openDespesasFixasBtn');
  app.click('uiFixedAdd');
  assert.notEqual(app.w.document.activeElement, app.el('despesaDescInput'));
  app.click('btnMetaSemanal');
  assert.notEqual(app.w.document.activeElement, app.el('metaSemanalValorInput'));
});
