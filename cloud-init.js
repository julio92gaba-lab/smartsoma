// cloud-init.js
// Carrega a sessao Supabase, hidrata o cache do utilizador e so depois
// injeta o app.js. O app.js legado pode chamar cloudGet() sem await.
//
// MODO OFFLINE
//  - Cada utilizador tem uma copia local dos dados (localStorage) que e
//    atualizada a cada gravacao e a cada arranque com rede.
//  - Gravacoes (cloudSet/cloudRemove) vao primeiro para uma fila local e so
//    saem dela quando o Supabase confirma. Sem rede ficam guardadas e sao
//    enviadas quando a ligacao voltar.
//  - Se nao houver rede ao abrir, a sessao guardada no telemovel e usada e a
//    app arranca com a copia local.

(function () {
  'use strict';

  var SUPABASE_URL = 'https://ojhnierbhqrwxvabrzkt.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaG5pZXJiaHFyd3h2YWJyemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NTAxODAsImV4cCI6MjEwNTQyNjE4MH0.zXsVvTVKiEh_Y6t9xpnaPC-JXgPwCKCOqA_sPgNbPoE';

  if (!window.supabase || !window.supabase.createClient) {
    console.error('Supabase client nao foi carregado antes de cloud-init.js.');
    window.location.href = 'login.html';
    return;
  }

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  });

  var cache = Object.create(null);

  window.supabaseClient = sb;
  window._cloudCache = cache;
  window._cacheReady = false;
  window.currentUser = null;
  window.currentUserEmail = null;

  function normaliseValueFromDb(value) {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string') return value;

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  function valueForLegacyApp(value) {
    if (value === undefined || value === null) return null;
    return (typeof value === 'string') ? value : JSON.stringify(value);
  }

  function valueForDb(value) {
    if (value === undefined || value === null) return null;
    return (typeof value === 'string') ? value : JSON.stringify(value);
  }

  function markCacheReady() {
    window._cacheReady = true;
    document.dispatchEvent(new CustomEvent('cloudCacheReady'));
  }

  // ════════════════════════════════════════════════════════════════════
  //  OFFLINE: copia local, fila de gravacoes pendentes e estado de sync
  // ════════════════════════════════════════════════════════════════════

  var PROJECT_REF = (function () {
    try { return new URL(SUPABASE_URL).hostname.split('.')[0]; } catch (e) { return ''; }
  })();
  var AUTH_STORAGE_KEY = 'sb-' + PROJECT_REF + '-auth-token';
  var KV_PREFIX = 'ss_kv:';          // ss_kv:<userId>:<chave>  -> valor
  var QUEUE_PREFIX = 'ss_q:';        // ss_q:<userId>           -> fila pendente
  var SNAPSHOT_PREFIX = 'ss_snap:';  // ss_snap:<userId>        -> copia local completa
  var MAX_ATTEMPTS = 10;             // tentativas antes de descartar um item "envenenado"

  var userId = null;
  var queue = [];

  function withTimeout(promise, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; resolve({ timeout: true }); }
      }, ms);
      promise.then(function (value) {
        if (!done) { done = true; clearTimeout(timer); resolve({ value: value }); }
      }, function (error) {
        if (!done) { done = true; clearTimeout(timer); resolve({ error: error }); }
      });
    });
  }

  function isNetworkError(err) {
    if (!err) return false;
    if (err.status === 0) return true;
    return /fetch|network|load failed|timeout/i.test((err.name || '') + ' ' + (err.message || ''));
  }

  // ── Copia local dos dados ─────────────────────────────────────────
  function kvPrefix() { return KV_PREFIX + userId + ':'; }

  function localSaveKey(key, persistValue) {
    try {
      if (persistValue === null || persistValue === undefined) {
        localStorage.removeItem(kvPrefix() + key);
      } else {
        localStorage.setItem(kvPrefix() + key, persistValue);
      }
    } catch (e) {
      console.warn('Sem espaco local para guardar:', key);
    }
  }

  function localRemoveKey(key) {
    try { localStorage.removeItem(kvPrefix() + key); } catch (e) { }
  }

  function localLoadAll() {
    var prefix = kvPrefix();
    var total = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) {
          cache[k.slice(prefix.length)] = normaliseValueFromDb(localStorage.getItem(k));
          total++;
        }
      }
    } catch (e) { }
    return total;
  }

  function localReplaceAll() {
    var prefix = kvPrefix();
    var stale = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) stale.push(k);
      }
      stale.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) { }
    Object.keys(cache).forEach(function (key) {
      localSaveKey(key, valueForDb(cache[key]));
    });
  }

  function hasSnapshot() {
    try { return localStorage.getItem(SNAPSHOT_PREFIX + userId) === '1'; } catch (e) { return false; }
  }

  function markSnapshot() {
    try { localStorage.setItem(SNAPSHOT_PREFIX + userId, '1'); } catch (e) { }
  }

  // ── Fila de gravacoes pendentes ───────────────────────────────────
  function loadQueue() {
    try {
      var raw = localStorage.getItem(QUEUE_PREFIX + userId);
      var parsed = raw ? JSON.parse(raw) : [];
      queue = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      queue = [];
    }
  }

  function saveQueue() {
    try {
      if (queue.length) localStorage.setItem(QUEUE_PREFIX + userId, JSON.stringify(queue));
      else localStorage.removeItem(QUEUE_PREFIX + userId);
    } catch (e) {
      console.warn('Nao foi possivel guardar a fila offline no telemovel.');
    }
  }

  // Uma entrada por chave: a gravacao mais recente substitui a anterior.
  function enqueue(op, key, value) {
    queue = queue.filter(function (item) { return item.key !== key; });
    queue.push({ op: op, key: key, value: value, attempts: 0, ts: Date.now() });
    saveQueue();
    updateStatus();
  }

  function removeFromQueue(item) {
    var idx = queue.indexOf(item);
    if (idx > -1) {
      queue.splice(idx, 1);
      saveQueue();
    }
    updateStatus();
  }

  function applyQueueToCache() {
    queue.forEach(function (item) {
      if (item.op === 'remove' || item.value === null || item.value === undefined) {
        delete cache[item.key];
      } else {
        cache[item.key] = normaliseValueFromDb(item.value);
      }
    });
  }

  // ── Sessao (com plano B sem rede) ─────────────────────────────────
  function readStoredSession() {
    try {
      var raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      var stored = JSON.parse(raw);
      if (stored && stored.user && stored.user.id && stored.refresh_token) return stored;
    } catch (e) { }
    return null;
  }

  // Sem rede, o getSession() do Supabase tenta renovar o token expirado durante
  // ~30s antes de desistir. Por isso, offline usamos a sessao guardada logo.
  async function resolveSession() {
    var stored = readStoredSession();

    if (navigator.onLine === false && stored) {
      return { session: stored, offline: true };
    }

    var result = await withTimeout(sb.auth.getSession(), stored ? 8000 : 20000);
    var value = result.value;

    if (value && value.data && value.data.session) {
      return { session: value.data.session, offline: false };
    }

    var networkProblem = result.timeout ||
      isNetworkError(result.error) ||
      (value && isNetworkError(value.error)) ||
      navigator.onLine === false;

    if (stored && networkProblem) return { session: stored, offline: true };
    return { session: null, offline: false };
  }

  async function getValidSession() {
    var result = await withTimeout(sb.auth.getSession(), 8000);
    var value = result.value;
    return (value && value.data && value.data.session) || null;
  }

  // ── Envio da fila para o Supabase ─────────────────────────────────
  async function sendItem(item) {
    try {
      var result;
      if (item.op === 'remove') {
        result = await sb.from('user_data').delete()
          .eq('user_id', window.currentUser.id)
          .eq('key', item.key);
      } else {
        result = await sb.from('user_data').upsert({
          user_id: window.currentUser.id,
          key: item.key,
          value: item.value
        }, { onConflict: 'user_id,key' });
      }

      if (!result.error) return { ok: true };

      var message = result.error.message || '';
      return {
        ok: false,
        error: result.error,
        network: result.status === 0 || isNetworkError(result.error),
        auth: result.status === 401 || /jwt/i.test(message)
      };
    } catch (error) {
      return { ok: false, error: error, network: true };
    }
  }

  async function flushOnce() {
    if (!queue.length || !window.currentUser) { updateStatus(); return; }
    if (navigator.onLine === false) { updateStatus(); return; }

    var session = await getValidSession();
    if (!session) { updateStatus(); return; }

    var items = queue.slice();
    for (var n = 0; n < items.length; n++) {
      var item = items[n];
      if (queue.indexOf(item) === -1) continue; // ja substituido por uma versao mais recente

      var res = await sendItem(item);
      if (res.ok) { removeFromQueue(item); continue; }

      // Sem rede ou sessao invalida: para e tenta de novo mais tarde (nao conta tentativa)
      if (res.network || res.auth) break;

      item.attempts = (item.attempts || 0) + 1;
      console.warn('Sync falhou:', item.key, res.error && res.error.message);
      if (item.attempts >= MAX_ATTEMPTS) {
        console.error('Item descartado apos varias falhas:', item.key);
        removeFromQueue(item);
      } else {
        saveQueue();
      }
    }
    updateStatus();
  }

  var flushing = null;
  var flushAgain = false;

  async function flushQueue() {
    if (flushing) { flushAgain = true; return flushing; }
    flushing = (async function () {
      do {
        flushAgain = false;
        try { await flushOnce(); } catch (e) { console.warn('flushQueue:', e); }
      } while (flushAgain);
    })();
    try { await flushing; } finally { flushing = null; }
  }

  // ── Indicador de estado (sem rede / a sincronizar / sincronizado) ──
  var chip = null;
  var hideTimer = null;
  var lastPending = 0;

  function ensureChip() {
    if (chip || !document.body) return chip;
    chip = document.createElement('div');
    chip.id = 'cloudSyncChip';
    chip.setAttribute('role', 'status');
    chip.setAttribute('aria-live', 'polite');
    chip.style.cssText =
      'position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:50%;' +
      'transform:translateX(-50%) translateY(-8px);z-index:99998;opacity:0;pointer-events:none;' +
      'transition:opacity .25s ease,transform .25s ease;padding:7px 14px;border-radius:99px;' +
      'font:600 12px/1.2 "DM Sans",-apple-system,sans-serif;color:#fff;background:#1c2333;' +
      'border:1px solid rgba(46,204,113,.45);box-shadow:0 6px 20px rgba(0,0,0,.35);' +
      'white-space:nowrap;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis';
    document.body.appendChild(chip);
    return chip;
  }

  function showChip(text, warn) {
    var el = ensureChip();
    if (!el) return;
    el.textContent = text;
    el.style.borderColor = warn ? 'rgba(245,185,66,.75)' : 'rgba(46,204,113,.45)';
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  }

  function hideChip() {
    if (!chip) return;
    chip.style.opacity = '0';
    chip.style.transform = 'translateX(-50%) translateY(-8px)';
  }

  function updateStatus() {
    var online = navigator.onLine !== false;
    var pending = queue.length;

    clearTimeout(hideTimer);

    if (!online) {
      showChip(pending
        ? 'Sem rede · ' + pending + (pending === 1 ? ' alteração guardada' : ' alterações guardadas')
        : 'Sem rede · a usar dados guardados', true);
    } else if (pending) {
      showChip('A sincronizar ' + pending + (pending === 1 ? ' alteração…' : ' alterações…'), false);
    } else if (lastPending > 0) {
      showChip('Tudo sincronizado ✓', false);
      hideTimer = setTimeout(hideChip, 2200);
    } else {
      hideChip();
    }

    lastPending = pending;
    document.dispatchEvent(new CustomEvent('cloudSyncStatus', {
      detail: { online: online, pending: pending }
    }));
  }

  // ════════════════════════════════════════════════════════════════════

  async function fetchServerData(uid) {
    var data = Object.create(null);
    var from = 0;
    var pageSize = 1000;

    while (true) {
      var result = await sb
        .from('user_data')
        .select('key, value')
        .eq('user_id', uid)
        .range(from, from + pageSize - 1);

      if (result.error) throw result.error;

      (result.data || []).forEach(function (row) {
        data[row.key] = normaliseValueFromDb(row.value);
      });

      if (!result.data || result.data.length < pageSize) break;
      from += pageSize;
    }

    return data;
  }

  // Com rede: traz os dados do servidor, sobrepoe as gravacoes ainda pendentes
  // e atualiza a copia local. Sem rede (ou rede lenta): usa a copia local.
  async function hydrateCloudCache(uid, offlineSession) {
    loadQueue();
    var snapshotExists = hasSnapshot();
    localLoadAll();

    var hydrated = false;

    if (!offlineSession && navigator.onLine !== false) {
      var result = await withTimeout(fetchServerData(uid), snapshotExists ? 7000 : 30000);

      if (result.value) {
        Object.keys(cache).forEach(function (k) { delete cache[k]; });
        Object.keys(result.value).forEach(function (k) { cache[k] = result.value[k]; });
        applyQueueToCache();
        localReplaceAll();
        markSnapshot();
        hydrated = true;
      } else {
        console.warn('Servidor inacessivel, a usar dados guardados no telemovel.',
          result.error || 'tempo esgotado');
      }
    }

    if (!hydrated) {
      if (!snapshotExists) {
        throw new Error('sem-copia-local');
      }
      applyQueueToCache();
    }

    markCacheReady();
    console.log('Cache carregado:', Object.keys(cache).length, 'chaves',
      hydrated ? '(servidor)' : '(copia local)');
  }

  function loadAppScript() {
    return new Promise(function (resolve, reject) {
      var replayDomReady = installDomReadyReplay();
      var script = document.createElement('script');
      script.src = 'app.js';
      script.async = false;
      script.onload = function () {
        if (replayDomReady) replayDomReady.flush();
        resolve();
      };
      script.onerror = function () {
        if (replayDomReady) replayDomReady.restore();
        reject(new Error('Nao foi possivel carregar app.js.'));
      };
      document.body.appendChild(script);
    });
  }

  function installDomReadyReplay() {
    if (document.readyState === 'loading') return null;

    var originalAddEventListener = document.addEventListener;
    var queuedListeners = [];

    function restore() {
      if (document.addEventListener === patchedAddEventListener) {
        document.addEventListener = originalAddEventListener;
      }
    }

    function patchedAddEventListener(type, listener, options) {
      if (type === 'DOMContentLoaded' && listener) {
        queuedListeners.push(listener);
        return undefined;
      }

      return originalAddEventListener.call(document, type, listener, options);
    }

    document.addEventListener = patchedAddEventListener;

    return {
      restore: restore,
      flush: function () {
        restore();
        setTimeout(function () {
          var event = new Event('DOMContentLoaded');
          queuedListeners.forEach(function (listener) {
            try {
              if (typeof listener === 'function') {
                listener.call(document, event);
              } else if (listener && typeof listener.handleEvent === 'function') {
                listener.handleEvent(event);
              }
            } catch (error) {
              setTimeout(function () { throw error; }, 0);
            }
          });
        }, 0);
      }
    };
  }

  function setupLogout() {
    var btnSair = document.getElementById('btnSair');
    if (btnSair) {
      btnSair.addEventListener('click', async function () {
        await sb.auth.signOut();
        window.location.href = 'login.html';
      });
    }

    var emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.textContent = window.currentUserEmail || '';
  }

  // API usada pelo ecrã "Perfil e Dados da Conta" para trocar email e
  // password de quem entrou com email/senha. Cada troca pede a password
  // atual primeiro (reautentica com signInWithPassword) antes de chamar
  // updateUser — assim confirmamos que é mesmo a pessoa dona da conta.
  window.AuthAPI = {
    verifyPassword: function (password) {
      return sb.auth.signInWithPassword({
        email: window.currentUserEmail,
        password: password
      });
    },
    updateEmail: function (newEmail) {
      return sb.auth.updateUser({ email: newEmail });
    },
    updatePassword: function (newPassword) {
      return sb.auth.updateUser({ password: newPassword });
    }
  };

  // API global usada pelo app.js legado. cloudGet e sincrono apos o init.
  window.cloudGet = function cloudGet(key) {
    return valueForLegacyApp(cache[key]);
  };

  // Grava no cache e na copia local na hora, poe na fila e tenta enviar.
  // Sem rede a gravacao fica na fila e segue quando a ligacao voltar.
  window.cloudSet = function cloudSet(key, value) {
    if (!window.currentUser) return Promise.resolve();

    var persistValue = valueForDb(value);
    cache[key] = normaliseValueFromDb(persistValue);
    localSaveKey(key, persistValue);
    enqueue('set', key, persistValue);

    return flushQueue().then(function () {
      return { error: null, pending: queue.length };
    });
  };

  window.cloudRemove = function cloudRemove(key) {
    if (!window.currentUser) return Promise.resolve();

    delete cache[key];
    localRemoveKey(key);
    enqueue('remove', key, null);

    return flushQueue().then(function () {
      return { error: null, pending: queue.length };
    });
  };

  (async function boot() {
    try {
      var resolved = await resolveSession();
      var session = resolved.session;

      if (!session) {
        window.location.href = 'login.html';
        return;
      }

      window.currentUser = session.user;
      window.currentUserEmail = session.user.email || '';
      userId = session.user.id;

      // Como a pessoa entrou: 'google' ou 'email'. Usado pelo app.js para
      // decidir o que mostrar em Perfil e Dados da Conta (ex.: o email só
      // pode ser trocado por quem entrou com email e senha).
      var provider = (session.user.app_metadata && session.user.app_metadata.provider) || 'email';
      window.currentUserProvider = provider;

      // Nome e foto vindos da conta Google, usados só como valor inicial
      // (a pessoa pode substituir por outro nome/foto em Dados Pessoais).
      var meta = session.user.user_metadata || {};
      window.currentUserGoogleName = meta.full_name || meta.name || '';
      window.currentUserGoogleAvatar = meta.avatar_url || meta.picture || '';

      await hydrateCloudCache(session.user.id, resolved.offline);
      setupLogout();
      await loadAppScript();

      // Sincronizacao: ao voltar a rede, ao voltar ao app e a cada 30s se houver pendentes
      window.addEventListener('online', function () { updateStatus(); flushQueue(); });
      window.addEventListener('offline', updateStatus);
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') flushQueue();
      });
      setInterval(function () { if (queue.length) flushQueue(); }, 30000);

      updateStatus();
      flushQueue();
    } catch (error) {
      console.error('Erro no arranque da app:', error);
      if (error && error.message === 'sem-copia-local') {
        alert('Para abrir a app pela primeira vez é preciso ligação à internet. Liga-te e tenta de novo.');
      } else {
        alert('Nao foi possivel carregar os seus dados. Tente atualizar a pagina.');
      }
    }
  })();
})();