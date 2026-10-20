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

function weekBefore(date, weeks = 1) {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - weeks * 7);
  return previous;
}

function goal(value = 350, tipo = 'bruto') {
  return JSON.stringify({ valor: value, tipo, percent: 0 });
}

test('weekly goal prompt opens only for a goal registered in the immediately previous week', t => {
  const monday = currentMonday();
  const previousKey = dateKey(weekBefore(monday));
  const currentKey = dateKey(monday);
  const app = createApp({ ['metaSemanalConfig:' + previousKey]: goal(350, 'liquido') });
  t.after(app.close);

  assert.equal(app.el('metaSemanalWelcomeModalBackdrop').classList.contains('visible'), true);
  assert.match(app.el('metaSemanalWelcomeModalText').textContent, /350.*Líquidos/);
  assert.equal(app.cache['metaSemanalConfig:' + currentKey], goal(350, 'liquido'));
  assert.equal(app.cache.metaSemanalLastPromptWeek, currentKey);
});

test('weekly goal prompt does not open without a previous-week goal or for an older goal', t => {
  const monday = currentMonday();
  const app = createApp({ ['metaSemanalConfig:' + dateKey(weekBefore(monday, 2))]: goal() });
  t.after(app.close);

  assert.equal(app.el('metaSemanalWelcomeModalBackdrop').classList.contains('visible'), false);
  assert.equal(app.cache['metaSemanalConfig:' + dateKey(monday)], undefined);
  assert.equal(app.cache.metaSemanalLastPromptWeek, undefined);
});

test('closing the first weekly prompt preserves the copied goal and never reopens it that week', t => {
  const monday = currentMonday();
  const previousKey = dateKey(weekBefore(monday));
  const currentKey = dateKey(monday);
  const app = createApp({ ['metaSemanalConfig:' + previousKey]: goal(280) });
  t.after(app.close);

  app.el('metaSemanalWelcomeModalBackdrop').dispatchEvent(new app.w.MouseEvent('click', { bubbles: true }));
  assert.equal(app.el('metaSemanalWelcomeModalBackdrop').classList.contains('visible'), false);
  app.w.dispatchEvent(new app.w.Event('focus'));
  assert.equal(app.el('metaSemanalWelcomeModalBackdrop').classList.contains('visible'), false);
  assert.equal(app.cache['metaSemanalConfig:' + currentKey], goal(280));
});

test('choosing clear removes only the new-week goal and records that choice', t => {
  const monday = currentMonday();
  const previousKey = dateKey(weekBefore(monday));
  const currentKey = dateKey(monday);
  const app = createApp({ ['metaSemanalConfig:' + previousKey]: goal(420) });
  t.after(app.close);

  app.click('metaWelcomeZerarBtn');
  app.click('metaSemanalWelcomeSalvarBtn');
  assert.equal(app.el('metaSemanalWelcomeModalBackdrop').classList.contains('visible'), false);
  assert.equal(app.cache['metaSemanalConfig:' + currentKey], undefined);
  assert.equal(app.cache['metaSemanalZerada:' + currentKey], '1');
  assert.equal(app.cache['metaSemanalConfig:' + previousKey], goal(420));
});
