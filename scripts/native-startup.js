(function () {
  'use strict';
  var finished = false;
  function ready() {
    if (finished) return;
    finished = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var plugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.NativeStartup;
        if (plugin) plugin.ready().catch(function (error) { console.warn('Falha ao finalizar abertura:', error); });
      });
    });
  }
  if (/\/login\.html$/.test(window.location.pathname)) {
    if (document.readyState === 'complete') ready();
    else window.addEventListener('load', ready, { once: true });
  } else if (window.SmartSomaAppReady) {
    ready();
  } else {
    document.addEventListener('smartSomaAppReady', ready, { once: true });
  }
})();
