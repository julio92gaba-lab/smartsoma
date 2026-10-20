'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp, dateKey } = require('./app-harness.cjs');

function currentMonday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  return date;
}

function previousMonday() {
  const date = currentMonday();
  date.setDate(date.getDate() - 7);
  return date;
}

function selectPreviousWeek(app) {
  app.w.GanhosDate.set(previousMonday());
}

test('an undefined past-week goal is an explicit retroactive-goal link', t => {
  const app = createApp();
  t.after(app.close);

  selectPreviousWeek(app);
  assert.equal(app.el('metaSemanalWeekBox').hidden, false);
  assert.match(app.el('metaSemanalWeekBoxPercentValue').textContent, /Por definir/);
  assert.equal(app.el('metaSemanalWeekBoxThumb').textContent, '→');

  app.click('btnMetaSemanalSemanaConsultada');
  assert.equal(app.el('metaSemanalRetroModalBackdrop').classList.contains('visible'), true);
  assert.equal(app.el('metaSemanalRetroModalTitle').textContent, 'Meta Semanal Retroativa');
  assert.notEqual(app.el('metaSemanalRetroPeriodText').textContent, '');
});

test('a retroactive goal is stored only for the selected week and is not inherited', t => {
  const previousKey = dateKey(previousMonday());
  const currentKey = dateKey(currentMonday());
  const app = createApp();
  t.after(app.close);

  selectPreviousWeek(app);
  app.click('btnMetaSemanalSemanaConsultada');
  app.input('metaSemanalRetroValorInput', '275,50');
  app.click('metaRetroTipoLiquidoBtn');
  app.click('metaSemanalRetroSalvarBtn');

  assert.deepEqual(JSON.parse(app.cache['metaSemanalConfig:' + previousKey]), {
    valor: 275.5, tipo: 'liquido', percent: 0, retroativa: true
  });
  assert.equal(app.cache['metaSemanalConfig:' + currentKey], undefined);
  assert.equal(app.el('metaSemanalRetroModalBackdrop').classList.contains('visible'), false);

  const nextLoad = createApp({ ['metaSemanalConfig:' + previousKey]: app.cache['metaSemanalConfig:' + previousKey] });
  t.after(nextLoad.close);
  assert.equal(nextLoad.cache['metaSemanalConfig:' + currentKey], undefined);
});
