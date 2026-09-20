// cloud-init.js
// Carrega a sessao Supabase, hidrata o cache do utilizador e so depois
// injeta o app.js. O app.js legado pode chamar cloudGet() sem await.

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

  async function hydrateCloudCache(userId) {
    var from = 0;
    var pageSize = 1000;

    while (true) {
      var result = await sb
        .from('user_data')
        .select('key, value')
        .eq('user_id', userId)
        .range(from, from + pageSize - 1);

      if (result.error) throw result.error;

      (result.data || []).forEach(function (row) {
        cache[row.key] = normaliseValueFromDb(row.value);
      });

      if (!result.data || result.data.length < pageSize) break;
      from += pageSize;
    }

    markCacheReady();
    console.log('Cache Supabase carregado:', Object.keys(cache).length, 'chaves');
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

  // API global usada pelo app.js legado. cloudGet e sincrono apos o init.
  window.cloudGet = function cloudGet(key) {
    return valueForLegacyApp(cache[key]);
  };

  window.cloudSet = function cloudSet(key, value) {
    if (!window.currentUser) return Promise.resolve();

    var persistValue = valueForDb(value);
    cache[key] = normaliseValueFromDb(persistValue);

    return sb
      .from('user_data')
      .upsert({
        user_id: window.currentUser.id,
        key: key,
        value: persistValue
      }, { onConflict: 'user_id,key' })
      .then(function (result) {
        if (result.error) {
          console.warn('cloudSet error:', key, result.error.message);
        }
        return result;
      })
      .catch(function (error) {
        console.warn('cloudSet error:', key, error.message || error);
        return { error: error };
      });
  };

  window.cloudRemove = function cloudRemove(key) {
    if (!window.currentUser) return Promise.resolve();

    delete cache[key];

    return sb
      .from('user_data')
      .delete()
      .eq('user_id', window.currentUser.id)
      .eq('key', key)
      .then(function (result) {
        if (result.error) {
          console.warn('cloudRemove error:', key, result.error.message);
        }
        return result;
      })
      .catch(function (error) {
        console.warn('cloudRemove error:', key, error.message || error);
        return { error: error };
      });
  };

  (async function boot() {
    try {
      var sessionResult = await sb.auth.getSession();
      var session = sessionResult && sessionResult.data && sessionResult.data.session;

      if (!session) {
        window.location.href = 'login.html';
        return;
      }

      window.currentUser = session.user;
      window.currentUserEmail = session.user.email || '';

      await hydrateCloudCache(session.user.id);
      setupLogout();
      await loadAppScript();
    } catch (error) {
      console.error('Erro no arranque da app:', error);
      alert('Nao foi possivel carregar os seus dados. Tente atualizar a pagina.');
    }
  })();
})();
