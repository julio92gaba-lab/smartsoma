/* SmartSoma — Service Worker + toast de instalação da PWA
   Partilhado por app.html, login.html e index.html.
   O toast é identificado por atributos data-pwa-*:
     data-pwa-toast         contentor (opcional: data-pwa-allow-open, data-pwa-mobile-only)
     data-pwa-title / -sub  textos
     data-pwa-btn           botão principal (Instalar / Abrir app)
     data-pwa-close         botão fechar */
(function () {
  'use strict';

  var INSTALLED_KEY    = 'ss_pwa_installed';        /* localStorage: já instalou */
  var DISMISS_KEY      = 'ss_pwa_toast_dismissed';  /* localStorage: fechou o "Instalar" */
  var DISMISS_OPEN_KEY = 'ss_pwa_open_dismissed';   /* sessionStorage: fechou o "Abrir app" */
  var OPEN_URL         = '/app';
  var DELAY            = 2200;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k) { try { localStorage.setItem(k, '1'); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k) { try { sessionStorage.setItem(k, '1'); } catch (e) {} }

  /* ── Service Worker ── */
  if ('serviceWorker' in navigator) {
    var reg = function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); };
    if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg);
  }

  /* ── Já está a correr como app instalada ── */
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches
                  || window.navigator.standalone === true;
  if (isStandalone) { lsSet(INSTALLED_KEY); return; }

  var toast = document.querySelector('[data-pwa-toast]');
  if (!toast) return;

  var ua       = navigator.userAgent;
  var isIOS    = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isMobile = /android|iphone|ipad|ipod|mobile/i.test(ua) || isIOS;
  if (toast.hasAttribute('data-pwa-mobile-only') && !isMobile) return;

  var allowOpen = toast.hasAttribute('data-pwa-allow-open');
  var titleEl   = toast.querySelector('[data-pwa-title]');
  var subEl     = toast.querySelector('[data-pwa-sub]');
  var btn       = toast.querySelector('[data-pwa-btn]');
  var closeBtn  = toast.querySelector('[data-pwa-close]');

  var TXT_INSTALL = {
    title: titleEl ? titleEl.textContent : '',
    sub:   subEl   ? subEl.textContent   : '',
    btn:   btn     ? btn.textContent     : 'Instalar'
  };
  var TXT_OPEN = {
    title: 'O SmartSoma já está instalado',
    sub:   'Abre a app e entra mais depressa.',
    btn:   'Abrir app'
  };

  var hiddenTransform = toast.style.transform;
  var deferredPrompt  = null;
  var state           = null;   /* 'install' | 'ios' | 'open' */
  var ready           = false;

  function pickState() {
    if (deferredPrompt) return 'install';                  /* o browser confirma: não está instalada */
    if (lsGet(INSTALLED_KEY) === '1') return allowOpen ? 'open' : null;
    if (isIOS) return 'ios';                               /* iOS não expõe nada: instruções manuais */
    return null;
  }

  function isDismissed(s) {
    return s === 'open' ? ssGet(DISMISS_OPEN_KEY) === '1' : lsGet(DISMISS_KEY) === '1';
  }

  function hide() {
    toast.style.opacity = '0';
    toast.style.transform = hiddenTransform;
    toast.style.pointerEvents = 'none';
  }

  function show() {
    var s = pickState();
    if (!s || isDismissed(s)) { hide(); return; }
    state = s;
    var t = s === 'open' ? TXT_OPEN : TXT_INSTALL;
    if (titleEl) titleEl.textContent = t.title;
    if (subEl)   subEl.textContent   = t.sub;
    if (btn)     btn.textContent     = t.btn;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.pointerEvents = 'auto';
  }

  /* Android/Chrome: este evento só dispara se a app NÃO estiver instalada */
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    lsDel(INSTALLED_KEY);          /* limpa flag antigo (ex.: app desinstalada) */
    if (ready) show();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    lsSet(INSTALLED_KEY);
    hide();
  });

  /* Android/Chrome: pergunta ao browser se a PWA está instalada (usa related_applications do manifest) */
  if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps().then(function (apps) {
      if (apps && apps.length && !deferredPrompt) {
        lsSet(INSTALLED_KEY);
        if (ready) show();
      }
    }).catch(function () {});
  }

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (state === 'open') { window.location.href = OPEN_URL; return; }
      if (deferredPrompt) {
        var p = deferredPrompt;
        deferredPrompt = null;
        p.prompt();
        p.userChoice.then(function (result) {
          hide();
          if (result.outcome === 'accepted') lsSet(INSTALLED_KEY);
        });
      } else if (isIOS) {
        alert('No Safari: toca em  ↑  Partilhar  →  "Adicionar ao ecrã de início"');
        hide();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      hide();
      if (state === 'open') ssSet(DISMISS_OPEN_KEY); else lsSet(DISMISS_KEY);
    });
  }

  /* Pequeno delay para não aparecer logo ao abrir */
  setTimeout(function () { ready = true; show(); }, DELAY);
})();