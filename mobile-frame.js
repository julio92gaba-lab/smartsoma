(function () {
  'use strict';
  if (window.top !== window || window.innerWidth <= 760) return;
  var target = window.location.pathname + window.location.search + window.location.hash;
  window.stop();
  window.location.replace('/mobile-frame.html#' + encodeURIComponent(target));
})();
