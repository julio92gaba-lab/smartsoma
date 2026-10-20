/* Android é consumption-only: não contém compras, preços ou links de pagamento. */
(function () {
  'use strict';
  var card = document.getElementById('subExpiradaCard');
  var title = document.getElementById('subExpiradaTitle');
  var text = card && card.querySelector('.mm-helper-text');
  var showingConnectionError = title && title.textContent.trim() === 'Ligação necessária';
  if (title) {
    title.dataset.original = 'Subscrição não encontrada';
    if (!showingConnectionError) title.textContent = title.dataset.original;
  }
  if (text) {
    text.dataset.original = 'Não existe uma subscrição ativa associada a esta conta. Para mais informações, contacta o nosso suporte ou visita www.smartsoma.pt.';
    if (!showingConnectionError) text.textContent = text.dataset.original;
  }
  var plans = document.querySelector('.sub-expired-plans');
  var note = document.querySelector('.cancelar-sub-note');
  if (plans) plans.remove();
  if (note) note.remove();
  var management = document.getElementById('cancelarSubscricaoSection');
  if (management) management.remove();
  if (text) {
    var style = document.createElement('style');
    style.textContent = '.native-subscription-site{display:block;margin-top:.7rem;color:#2ECC71;font-weight:800;letter-spacing:.01em}';
    document.head.appendChild(style);
    text.dataset.nativeMessage = 'Não existe uma subscrição ativa associada a esta conta.<span class="native-subscription-site">Para mais informações, contacta o nosso suporte ou visita www.smartsoma.pt.</span>';
    text.innerHTML = text.dataset.nativeMessage;
  }
  window.atualizarMensagemSubscricao = function (subscription, blocked) {
    if (!blocked || !title || !text) return;
    if (subscription && (subscription.status === 'unpaid' || subscription.status === 'paused')) {
      title.textContent = 'Subscrição precisa de atenção';
      text.dataset.nativeMessage = 'O pagamento da tua subscrição não foi confirmado.<span class="native-subscription-site">Para continuar a usar o SmartSoma, regulariza a tua subscrição no website www.smartsoma.pt.</span>';
    } else {
      title.textContent = title.dataset.original || 'Subscrição não encontrada';
    }
    text.innerHTML = text.dataset.nativeMessage;
  };
  var actions = document.querySelector('#subExpiradaCard .mm-secondary-action');
  if (actions && !document.getElementById('subExpiradaReverBtn')) {
    var refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.id = 'subExpiradaReverBtn';
    refresh.className = 'mm-text-link';
    refresh.textContent = 'Verificar novamente';
    refresh.addEventListener('click', function () {
      if (typeof window.verificarPlano === 'function') window.verificarPlano();
    });
    actions.insertBefore(refresh, actions.firstChild);
  }
})();
