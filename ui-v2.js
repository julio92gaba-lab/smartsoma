/* =======================================================================
   ui-v2.js — SmartSoma visual layer v2
   Apenas lógica de apresentação. Não toca em dados, auth, Supabase.
   ======================================================================= */

(function () {
  'use strict';

  /* ── Aguarda o DOM estar pronto ── */
  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {

    /* ─────────────────────────────────────────────────────────────────
       1. Sincroniza o atributo aria-pressed dos botões de tema
          (o app.js já gere a classe theme-dark; aqui apenas garantimos
          que o botão reflecte o estado actual ao carregar a página).
    ───────────────────────────────────────────────────────────────── */
    var btnTheme = document.getElementById('btnToggleTheme');
    if (btnTheme) {
      var isDark = document.body.classList.contains('theme-dark') ||
                   document.documentElement.classList.contains('theme-dark');
      btnTheme.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btnTheme.classList.toggle('is-alt', isDark);
    }

    /* ─────────────────────────────────────────────────────────────────
       2. Correcção de scroll no painel de ajustes (profile sheet):
          quando a sheet está aberta e o utilizador faz scroll,
          impede o scroll do documento por baixo.
    ───────────────────────────────────────────────────────────────── */
    var profileSheet = document.getElementById('profileSheet');
    var sheetBackdrop = document.getElementById('sheetBackdrop');

    if (profileSheet) {
      profileSheet.addEventListener('touchmove', function (e) {
        e.stopPropagation();
      }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────────
       3. Gradientes de scroll nos sheet-screens:
          adiciona/remove .has-scroll-top e .has-scroll-bottom
          para mostrar o degradê indicador de mais conteúdo.
    ───────────────────────────────────────────────────────────────── */
    function bindScrollGradients(screen) {
      if (!screen) return;
      function updateGradients() {
        var st = screen.scrollTop;
        var sh = screen.scrollHeight;
        var ch = screen.clientHeight;
        screen.classList.toggle('has-scroll-top',    st > 4);
        screen.classList.toggle('has-scroll-bottom', st + ch < sh - 4);
      }
      screen.addEventListener('scroll', updateGradients, { passive: true });
      updateGradients();
    }

    var screens = document.querySelectorAll('.sheet-screen');
    for (var i = 0; i < screens.length; i++) {
      bindScrollGradients(screens[i]);
    }

    /* ─────────────────────────────────────────────────────────────────
       4. Correcção visual: quando o langPopupModal é aberto,
          garante que o fundo escurece correctamente.
          (O app.js controla a lógica — aqui apenas o CSS helper).
    ───────────────────────────────────────────────────────────────── */
    var langPopup = document.getElementById('langPopupModal');
    if (langPopup) {
      /* Observa mutações de estilo/atributo para aplicar a classe CSS */
      var langObserver = new MutationObserver(function () {
        var style   = langPopup.getAttribute('style') || '';
        var hidden  = langPopup.hasAttribute('hidden');
        var isVisible = !hidden &&
                        style.indexOf('display: none') === -1 &&
                        style.indexOf('display:none')  === -1;
        langPopup.classList.toggle('visible', isVisible);
      });
      langObserver.observe(langPopup, { attributes: true, attributeFilter: ['style', 'hidden'] });
    }

    /* ─────────────────────────────────────────────────────────────────
       5. Fecha os modais ao clicar no backdrop (mm-backdrop),
          caso o app.js não o faça para algum modal específico.
          Só actua se o card filho NÃO for do subExpiradaBackdrop
          (que é intencionalmente não dispensável).
    ───────────────────────────────────────────────────────────────── */
    document.addEventListener('click', function (e) {
      var backdrop = e.target;
      if (!backdrop.classList.contains('mm-backdrop')) return;
      if (backdrop.id === 'subExpiradaBackdrop') return;
      if (backdrop.id === 'eliminarContaBackdrop') return;
      /* Se o app.js já trata, não duplicamos — verificamos se visible */
      if (!backdrop.classList.contains('visible')) return;
      backdrop.classList.remove('visible');
    });

    /* ─────────────────────────────────────────────────────────────────
       6. Sincroniza a meta-confetti-canvas com o tamanho real do ecrã
          para que os confetes saiam no sítio certo.
    ───────────────────────────────────────────────────────────────── */
    var confettiCanvas = document.getElementById('metaConfettiCanvas');
    if (confettiCanvas) {
      function resizeConfetti() {
        confettiCanvas.style.height = window.innerHeight + 'px';
      }
      window.addEventListener('resize', resizeConfetti, { passive: true });
      resizeConfetti();
    }

    /* ─────────────────────────────────────────────────────────────────
       7. Safe-area: actualiza as variáveis CSS em tempo real
          (iOS Safari pode reportar 0 no primeiro frame).
    ───────────────────────────────────────────────────────────────── */
    function updateSafeArea() {
      var top = 0, bottom = 0;
      try {
        var dummy = document.createElement('div');
        dummy.style.cssText = 'position:fixed;top:env(safe-area-inset-top,0px);height:0;visibility:hidden;';
        document.body.appendChild(dummy);
        top = dummy.getBoundingClientRect().top;
        document.body.removeChild(dummy);
      } catch (_) {}
      document.documentElement.style.setProperty('--safe-top',    top    + 'px');
      document.documentElement.style.setProperty('--safe-bottom', bottom + 'px');
    }
    updateSafeArea();
    window.addEventListener('resize', updateSafeArea, { passive: true });

  }); /* fim ready() */

})();