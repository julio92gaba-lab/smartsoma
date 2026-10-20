const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

test('landing presents Android access and translated iPhone instructions', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html, { url: 'https://smartsoma.pt/', runScripts: 'dangerously' });
  try {
    const doc = dom.window.document;
    const playButton = doc.querySelector('.access-store');
    assert.equal(playButton.disabled, true);
    assert.equal(playButton.tagName, 'BUTTON');
    assert.equal(playButton.querySelector('img').getAttribute('src'), 'google-play-badge-pt.png');
    playButton.click();
    assert.equal(dom.window.location.href, 'https://smartsoma.pt/');
    assert.match(doc.querySelector('.access-ios').textContent, /Safari[\s\S]*Partilhar[\s\S]*Adicionar ao ecrã principal/);
    assert.match(doc.querySelector('footer').textContent, /contacto@smartsoma\.pt/);
    dom.window.setLang('en');
    assert.match(doc.querySelector('.access-ios').textContent, /Safari[\s\S]*Share[\s\S]*Add to Home Screen/);
    assert.equal(playButton.querySelector('img').getAttribute('src'), 'google-play-badge-en.png');
    assert.match(playButton.querySelector('img').alt, /Google Play/);
    dom.window.setLang('pt');
    assert.match(doc.querySelector('.access-ios').textContent, /Partilhar/);
    assert.equal(playButton.querySelector('img').getAttribute('src'), 'google-play-badge-pt.png');
    assert.ok(doc.querySelector('.access-section').compareDocumentPosition(doc.querySelector('#funcionalidades')) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
  } finally { dom.window.close(); }
});

test('landing carousel shows platforms and the noninteractive extra item', () => {
  const html=fs.readFileSync('index.html','utf8');
  const dom=new JSDOM(html);
  try {
    const doc=dom.window.document;
    const group=doc.querySelector('.platform-group');
    assert.deepEqual([...group.querySelectorAll('img')].map(img=>img.getAttribute('src')),['carrosel1.png','carrosel2.png','carrosel3.png','carrosel4.png','carrosel5.png','carrosel6.png']);
    const duplicate=doc.querySelector('.platform-group[aria-hidden="true"]');
    assert.deepEqual([...duplicate.querySelectorAll('img')].map(img=>img.getAttribute('src')),[...group.querySelectorAll('img')].map(img=>img.getAttribute('src')));
    assert.equal(group.querySelector('.platform-more').textContent,'+');
    assert.equal(group.querySelectorAll('button,a').length,0);
    assert.match(html,/platform-scroll 12s linear infinite/);
    assert.match(html,/@media\(prefers-reduced-motion:reduce\)[\s\S]*?\.platform-track\{animation:none!important\}/);
    assert.ok(doc.querySelector('.hero-copy p').compareDocumentPosition(doc.querySelector('.platform-carousel')) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.ok(doc.querySelector('.platform-carousel').compareDocumentPosition(doc.querySelector('.hero-image')) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING);
  } finally { dom.window.close(); }
});

test('legal text distinguishes web and Android without promising unavailable Play purchases', () => {
  const html = fs.readFileSync('legal.html', 'utf8');
  assert.match(html, /SmartSoma LDA 2026/);
  assert.match(html, /Rua 5 de outubro 43, Sintra, Lisboa, Portugal/);
  assert.doesNotMatch(html, /identificação fiscal e forma jurídica a completar/);
  assert.match(html, /Os pagamentos são processados exclusivamente pela <strong>Creem<\/strong>/);
  assert.match(html, /Desinstalar a aplicação Android não cancela a subscrição/);
  assert.doesNotMatch(html, /subscrições adquiridas através da Google Play/i);
  assert.doesNotMatch(html, /ec\.europa\.eu\/consumers\/odr/);
});
