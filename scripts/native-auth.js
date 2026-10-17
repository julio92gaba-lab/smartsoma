/* Autenticação Android: os códigos PKCE são trocados apenas na app. */
(function () {
  'use strict';
  var callbackUrl = 'pt.smartsoma.app://auth/callback';
  var storageKey = 'smartsoma-android-oauth';
  var flowKey = 'smartsoma-android-auth-flow';
  var oauth = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { flowType: 'pkce', storageKey: storageKey, autoRefreshToken: false, detectSessionInUrl: false }
  });
  var params = new URLSearchParams(window.location.search);
  var code = params.get('native_oauth_code');
  var callbackError = params.has('native_oauth_error');
  var recovery = window.localStorage.getItem(flowKey) === 'recovery';

  if (code || callbackError) {
    window.history.replaceState(null, '', window.location.pathname);
    if (callbackError) {
      window.localStorage.removeItem(flowKey);
      if (recovery) toast('error', 'Link inválido ou expirado', 'Pede um novo link de recuperação neste telemóvel.');
      else toast('error', 'Não foi possível entrar', 'Tenta novamente ou escolhe outra forma de entrar.');
    } else {
      if (recovery) setLoading(true);
      oauth.auth.exchangeCodeForSession(code).then(function (result) {
        if (result.error || !result.data.session) throw result.error || new Error('Sessão não recebida.');
        return sb.auth.setSession({ access_token: result.data.session.access_token, refresh_token: result.data.session.refresh_token });
      }).then(function (result) {
        if (result.error || !result.data.session) throw result.error || new Error('Sessão não guardada.');
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(flowKey);
        if (recovery) {
          setModo('novaSenha');
          setLoading(false);
        } else {
          window.location.replace('app.html');
        }
      }).catch(function () {
        window.localStorage.removeItem(flowKey);
        if (recovery) {
          setLoading(false);
          toast('error', 'Link inválido ou expirado', 'Pede um novo link de recuperação neste telemóvel.');
        } else {
          toast('error', 'Não foi possível concluir o login', 'Tenta iniciar sessão novamente.');
        }
      });
    }
  }

  document.addEventListener('click', async function (event) {
    var recoveryButton = event.target.closest('#btnMain');
    if (recoveryButton && modo === 'recuperar') {
      event.preventDefault();
      event.stopImmediatePropagation();
      var now = Date.now();
      if (recoveryButton.disabled || now < submittingUntil) return;
      clearHints();
      var email = inputEmail.value.trim();
      if (!validateEmail(email)) return;
      setLoading(true);
      submittingUntil = now + 1500;
      try {
        window.localStorage.setItem(flowKey, 'recovery');
        var reset = await oauth.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl });
        if (reset.error) throw reset.error;
        toast('success', 'Email enviado!', 'Abre o link neste telemóvel para redefinir a palavra-passe.', 8000);
        setTimeout(function () { setModo('login'); }, 1500);
      } catch (error) {
        window.localStorage.removeItem(flowKey);
        handleError(error);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!event.target.closest('#btnGoogle')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var button = document.getElementById('btnGoogle');
    if (button.disabled) return;
    button.disabled = true;
    try {
      window.localStorage.removeItem(flowKey);
      var result = await oauth.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } }
      });
      if (result.error || !result.data.url) throw result.error || new Error('Autorização indisponível.');
      await window.Capacitor.Plugins.NativeAuth.openBrowser({ url: result.data.url });
    } catch (error) {
      toast('error', 'Não foi possível abrir o login', 'Verifica a ligação e tenta novamente.');
    } finally {
      button.disabled = false;
    }
  }, true);
})();
