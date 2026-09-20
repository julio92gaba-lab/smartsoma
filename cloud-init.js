// ── cloud-init.js — carregado ANTES do app.js ────────────────────────
// Inicia a ligação ao Supabase, verifica a sessão, carrega todos os dados
// do utilizador para o cache em memória, e só depois injeta o app.js.
// Assim as IIFEs do app.js encontram o cache já pronto quando correm.

const SUPABASE_URL = 'https://ojhnierbhqrwxvabrzkt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaG5pZXJiaHFyd3h2YWJyemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NTAxODAsImV4cCI6MjEwNTQyNjE4MH0.zXsVvTVKiEh_Y6t9xpnaPC-JXgPwCKCOqA_sPgNbPoE';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
    }
});

// Cache em memória — preenchido antes do app.js carregar
window._cloudCache = {};
window._cacheReady = false;
window.currentUser = null;
window.currentUserEmail = null;

function _markCacheReady() {
    window._cacheReady = true;
}

async function _initCloudCache(userId) {
    try {
        const { data, error } = await sb
            .from('user_data')
            .select('key, value')
            .eq('user_id', userId);
        if (data && !error) {
            data.forEach(row => {
                try { window._cloudCache[row.key] = JSON.parse(row.value); }
                catch(e) { window._cloudCache[row.key] = row.value; }
            });
        }
        console.log('Cache carregado:', Object.keys(window._cloudCache).length, 'chaves');
    } catch(e) {
        console.warn('Erro ao carregar cache:', e);
    }
    _markCacheReady();
}

// cloudGet — lê do cache em memória (síncrono após init)
async function cloudGet(key) {
    const val = window._cloudCache[key];
    if (val === undefined || val === null) return null;
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
}

// cloudSet — actualiza cache e persiste no Supabase
async function cloudSet(key, value) {
    if (!window.currentUser) return;
    try {
        window._cloudCache[key] = (typeof value === 'string') ? value : JSON.stringify(value);
    } catch(e) {}
    const persistValue = (typeof value === 'string') ? value : JSON.stringify(value);
    sb.from('user_data')
        .upsert({
            user_id: window.currentUser.id,
            key: key,
            value: persistValue
        }, { onConflict: 'user_id,key' })
        .then(({ error }) => {
            if (error) console.warn('cloudSet error:', key, error.message);
        });
}

// cloudRemove — remove do cache e do Supabase
async function cloudRemove(key) {
    if (!window.currentUser) return;
    delete window._cloudCache[key];
    sb.from('user_data')
        .delete()
        .eq('user_id', window.currentUser.id)
        .eq('key', key)
        .then(({ error }) => {
            if (error) console.warn('cloudRemove error:', key, error.message);
        });
}

// Botão Sair — configurado aqui para estar disponível logo
function _setupLogout() {
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.addEventListener('click', async function() {
            await sb.auth.signOut();
            window.location.href = 'login.html';
        });
    }
    const emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.textContent = window.currentUserEmail || '';
}

// ── ARRANQUE ─────────────────────────────────────────────────────────
// 1. Verifica sessão
// 2. Carrega cache
// 3. Injeta app.js dinamicamente — só corre depois do cache estar pronto
(async function boot() {
    const { data } = await sb.auth.getSession();
    if (!data.session) {
        window.location.href = 'login.html';
        return;
    }

    window.currentUser = data.session.user;
    window.currentUserEmail = data.session.user.email;

    // Carrega todos os dados antes de qualquer módulo inicializar
    await _initCloudCache(data.session.user.id);

    // DOM já está pronto (este script está no fim do body)
    _setupLogout();

    // Injeta o app.js — as IIFEs encontram o cache já preenchido
    const script = document.createElement('script');
    script.src = 'app.js';
    document.body.appendChild(script);
})();