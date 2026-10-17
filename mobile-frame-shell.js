(function () {
  'use strict';
  var target;
  try { target = new URL(decodeURIComponent(window.location.hash.slice(1)), window.location.origin); }
  catch (_) { target = new URL('/app', window.location.origin); }
  if (target.origin !== window.location.origin || !/^\/app(?:\.html)?$/.test(target.pathname)) {
    target = new URL('/app', window.location.origin);
  }
  var frame = document.getElementById('app');
  frame.src = target.pathname + target.search + target.hash;
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) return;
    try { window.location.replace(frame.contentWindow.location.href); }
    catch (_) { window.location.replace('/app'); }
  });
})();
