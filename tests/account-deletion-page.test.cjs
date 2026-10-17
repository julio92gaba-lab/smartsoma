const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

test('the public deletion page describes a request path and identifies SmartSoma', () => {
  const dom = new JSDOM(fs.readFileSync('eliminar-conta.html', 'utf8'));
  const doc = dom.window.document;
  assert.match(doc.title, /eliminar conta.*smartsoma/i);
  assert.match(doc.body.textContent, /mesmo que já não tenhas a aplicação instalada/i);
  assert.match(doc.body.textContent, /nunca envies a tua palavra-passe/i);
  assert.ok(doc.querySelector('a[href^="mailto:contacto@smartsoma.pt?subject="]'));
  assert.ok(doc.querySelector('a[href="/legal.html"]'));
  dom.window.close();
  assert.match(fs.readFileSync('index.html', 'utf8'), /href="eliminar-conta.html"/);
  assert.match(fs.readFileSync('legal.html', 'utf8'), /href="\/eliminar-conta.html"/);
});
