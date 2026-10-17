(function () {
  'use strict';
  var target;
  try { target = new URL(decodeURIComponent(window.location.hash.slice(1)), window.location.origin); }
  catch (_) { target = new URL('/app', window.location.origin); }
  if (target.origin !== window.location.origin || !/^\/app(?:\.html)?$/.test(target.pathname)) {
    target = new URL('/app', window.location.origin);
  }
  window.location.replace(target.pathname + target.search + target.hash);
})();
