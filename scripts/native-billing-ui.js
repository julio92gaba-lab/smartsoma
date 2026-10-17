/* A loja Android só será ativada após validação e testes reais da Google Play. */
(function () {
  'use strict';
  var card = document.getElementById('subExpiradaCard');
  var title = document.getElementById('subExpiradaTitle');
  var text = card && card.querySelector('.mm-helper-text');
  var showingConnectionError = title && title.textContent.trim() === 'Ligação necessária';
  if (title) {
    title.dataset.original = 'Subscrição no Android';
    if (!showingConnectionError) title.textContent = title.dataset.original;
  }
  if (text) {
    text.dataset.original = 'As compras na Google Play estão em preparação. Se já tens uma subscrição, entra com a mesma conta SmartSoma.';
    if (!showingConnectionError) text.textContent = text.dataset.original;
  }
  // The existing Creem checkout remains available on the website only.
  document.addEventListener('click', function (event) {
    if (!event.target.closest('#subExpiradaBtnSemanal, #subExpiradaBtnMensal')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
})();
