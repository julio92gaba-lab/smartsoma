const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

test('landing presents Android access and translated iPhone instructions', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html, { url: 'https://smartsoma.pt/', runScripts: 'dangerously' });
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('.access-store').href, 'https://play.google.com/store/apps/details?id=pt.smartsoma.app');
    assert.match(doc.querySelector('.access-ios').textContent, /Safari[\s\S]*Partilhar[\s\S]*Adicionar ao ecrã principal/);
    assert.match(doc.querySelector('footer').textContent, /contacto@smartsoma\.pt/);
    dom.window.setLang('en');
    assert.match(doc.querySelector('.access-ios').textContent, /Safari[\s\S]*Share[\s\S]*Add to Home Screen/);
    assert.match(doc.querySelector('.access-store').textContent, /Google Play/);
    dom.window.setLang('pt');
    assert.match(doc.querySelector('.access-ios').textContent, /Partilhar/);
  } finally { dom.window.close(); }
});

test('legal text distinguishes web and Android without promising unavailable Play purchases', () => {
  const html = fs.readFileSync('legal.html', 'utf8');
  assert.match(html, /SmartSoma LDA 2026/);
  assert.match(html, /Rua 5 de outubro 43, Sintra, Lisboa, Portugal/);
  assert.doesNotMatch(html, /identificação fiscal e forma jurídica a completar/);
  assert.match(html, /quando disponibilizado, processamento de subscrições pela Google Play/);
  assert.match(html, /subscrições adquiridas através da Google Play, quando disponíveis/i);
  assert.match(html, /Desinstalar a aplicação não cancela uma subscrição Google Play/);
  assert.doesNotMatch(html, /ec\.europa\.eu\/consumers\/odr/);
});
