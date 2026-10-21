const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

test('Capacitor uses a separate generated web directory and compatible versions', () => {
  const config = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(config.webDir, 'capacitor-web');
  assert.equal(config.appName, 'SmartSoma');
  assert.equal(pkg.dependencies['@capacitor/core'], pkg.devDependencies['@capacitor/cli']);
  assert.equal(pkg.dependencies['@capacitor/android'], pkg.dependencies['@capacitor/core']);
  assert.match(fs.readFileSync('.gitignore', 'utf8'), /^capacitor-web\/$/m);
  assert.match(fs.readFileSync('.vercelignore', 'utf8'), /^capacitor-web\/$/m);
  const prepare = fs.readFileSync('scripts/prepare-capacitor.cjs', 'utf8');
  for (const required of ['index.html', 'app.html', 'login.html', 'FUNDO.png', 'cloud-init.js', 'manifest.json']) {
    assert.ok(prepare.includes(`'${required}'`), required);
  }
  assert.doesNotMatch(prepare, /['"](?:\.env|package-lock\.json|supabase\/|api\/)/);
});

test('native launch uses the app and does not register a PWA service worker', () => {
  const prepare = fs.readFileSync('scripts/prepare-capacitor.cjs', 'utf8');
  assert.match(prepare, /writeFileSync\(path\.join\(output, 'index\.html'\), nativeApp\)/);
  assert.match(prepare, /writeFileSync\(path\.join\(output, 'app\.html'\), nativeApp\)/);
  assert.match(prepare, /smartsoma_splash_icon\.png/);
  const splash = fs.readFileSync('scripts/native-splash.css', 'utf8');
  assert.match(splash, /background: #0E5830/);
  assert.match(splash, /native-splash-symbol/);
  assert.match(splash, /\.splash-logo[\s\S]*bottom:/);
  assert.match(splash, /\.splash-logo\s*\{[^}]*height:\s*40px;[^}]*object-fit:\s*contain/s);
  assert.match(splash, /\.splash-spinner-wrap\s*\{[^}]*height:\s*28px;[^}]*animation:\s*none/s);
  let registered = false;
  const window = { Capacitor: { isNativePlatform: () => true } };
  const navigator = { serviceWorker: { register() { registered = true; } } };
  vm.runInNewContext(fs.readFileSync('pwa-install.js', 'utf8'), { window, navigator });
  assert.equal(registered, false);
});

test('web launch retains PWA service worker registration', () => {
  let registered;
  const navigator = { serviceWorker: { register(url) { registered = url; return Promise.resolve(); } } };
  const window = { navigator, matchMedia: () => ({ matches: true }) };
  const document = { readyState: 'complete' };
  const localStorage = { setItem() {} };
  vm.runInNewContext(fs.readFileSync('pwa-install.js', 'utf8'), { window, navigator, document, localStorage });
  assert.equal(registered, '/sw.js');
});

test('startup splash stays visible until its minimum time and actual fade', async () => {
  const html = fs.readFileSync('app.html', 'utf8');
  const splashScript = html.match(/<script>\s*(\/\* ── Splash:[\s\S]*?)<\/script>/)[1];
  const app = fs.readFileSync('app.js', 'utf8').replace(/\r\n/g, '\n');
  const start = app.indexOf('    (function () {\n      var ANIMATION_DURATION = 1400;');
  const end = app.indexOf('\n\n\n    (function () {', start);
  assert.ok(start >= 0 && end > start);
  const dom = new JSDOM('<div id="splash"></div><div id="appRoot"></div>', { runScripts: 'outside-only' });
  const w = dom.window;
  let now = 0;
  const timers = [];
  w.Date.now = () => now;
  w.setTimeout = (fn, delay) => { timers.push({ fn, at: now + delay }); };
  function advance(to) {
    for (;;) {
      timers.sort((a, b) => a.at - b.at);
      if (!timers.length || timers[0].at > to) break;
      const next = timers.shift(); now = next.at; next.fn();
    }
    now = to;
  }
  w.eval(splashScript);
  w.eval(app.slice(start, end));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  advance(2999);
  const splash = w.document.getElementById('splash');
  assert.ok(splash);
  assert.equal(splash.classList.contains('fade-out'), false);
  advance(3000);
  assert.equal(splash.classList.contains('fade-out'), true);
  const event = new w.Event('transitionend');
  Object.defineProperty(event, 'propertyName', { value: 'opacity' });
  splash.dispatchEvent(event);
  assert.equal(w.document.getElementById('splash'), null);
  await Promise.resolve();
  assert.equal(w.document.documentElement.classList.contains('splash-active'), false);
  dom.window.close();
});

test('subscription modal waits for the green splash to finish fading', () => {
  const html = fs.readFileSync('app.html', 'utf8');
  const css = fs.readFileSync('app.css', 'utf8');
  assert.match(css, /html\.splash-active #subExpiradaBackdrop\s*\{[^}]*visibility:hidden;[^}]*opacity:0 !important;[^}]*pointer-events:none !important;/);
  const splashScript = html.match(/<script>\s*(\/\* ── Splash:[\s\S]*?)<\/script>/)[1];
  const dom = new JSDOM('<div id="splash"></div><div id="appRoot"></div>', { runScripts: 'outside-only' });
  const w = dom.window;
  let now = 0, opened = 0;
  const timers = [];
  w.Date.now = () => now;
  w.setTimeout = (fn, delay) => { timers.push({ fn, at: now + delay }); };
  function advance(to) {
    for (;;) {
      timers.sort((a, b) => a.at - b.at);
      if (!timers.length || timers[0].at > to) break;
      const next = timers.shift(); now = next.at; next.fn();
    }
    now = to;
  }
  w.eval(splashScript);
  w.abrirModalSubExpirada = () => { opened++; };
  w.abrirModalSubExpirada();
  assert.equal(w.document.getElementById('appRoot').inert, true);
  advance(3000);
  assert.equal(opened, 0);
  const event = new w.Event('transitionend');
  Object.defineProperty(event, 'propertyName', { value: 'opacity' });
  w.document.getElementById('splash').dispatchEvent(event);
  advance(3249);
  assert.equal(opened, 0);
  advance(3250);
  assert.equal(opened, 1);
  dom.window.close();
});

test('native startup waits for the app and rendered frames, while login remains reachable', async () => {
  const code = fs.readFileSync('scripts/native-startup.js', 'utf8');
  for (const page of ['/', '/login.html']) {
    let calls = 0;
    const frames = [];
    const listeners = {};
    const document = { readyState: 'complete', addEventListener: (name, fn) => { listeners[name] = fn; } };
    const window = { location: { pathname: page }, Capacitor: { Plugins: { NativeStartup: { ready: () => { calls++; return Promise.resolve(); } } } } };
    vm.runInNewContext(code, { window, document, requestAnimationFrame: fn => frames.push(fn), console });
    if (page === '/') {
      assert.equal(frames.length, 0);
      listeners.smartSomaAppReady();
    }
    assert.equal(calls, 0);
    frames.shift()();
    assert.equal(calls, 0);
    frames.shift()();
    assert.equal(calls, 1);
  }
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  assert.match(activity, /postVisualStateCallback/);
  assert.match(activity, /postDelayed\(this::removeStartupOverlay, 15000\)/);
});

test('Android project keeps its provisional identity, existing icon and minimal permission', () => {
  const config = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
  const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
  const styles = fs.readFileSync('android/app/src/main/res/values/styles.xml', 'utf8');
  assert.ok(gradle.includes(`applicationId "${config.appId}"`));
  assert.match(manifest, /android:icon="@drawable\/smartsoma_icon"/);
  assert.match(manifest, /android:name="\.MainActivity"[\s\S]*android:screenOrientation="portrait"/);
  assert.deepEqual([...manifest.matchAll(/<uses-permission android:name="([^"]+)"/g)].map(m => m[1]), ['android.permission.INTERNET', 'android.permission.POST_NOTIFICATIONS']);
  assert.match(styles, /windowSplashScreenAnimatedIcon">@drawable\/smartsoma_splash_icon<\/item>/);
  assert.match(styles, /windowSplashScreenBackground">#0E5830<\/item>/);
  assert.ok(fs.existsSync('android/app/src/main/res/drawable-nodpi/smartsoma_splash_icon.png'));
  assert.deepEqual(fs.readFileSync('android/app/src/main/res/drawable-nodpi/smartsoma_icon.png'), fs.readFileSync('icon-512.png'));
});

test('release signing requires complete external credentials and excludes keystores from Git', () => {
  const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  for (const name of ['SMARTSOMA_UPLOAD_STORE_FILE', 'SMARTSOMA_UPLOAD_STORE_PASSWORD',
    'SMARTSOMA_UPLOAD_KEY_ALIAS', 'SMARTSOMA_UPLOAD_KEY_PASSWORD']) assert.match(gradle, new RegExp(name));
  assert.match(gradle, /Configuração de assinatura de upload incompleta/);
  assert.match(gradle, /isAbsolute\(\)/);
  assert.match(gradle, /if \(hasUploadSigning\) signingConfig signingConfigs\.release/);
  const ignored = fs.readFileSync('.gitignore', 'utf8');
  for (const ext of ['jks', 'keystore', 'p12', 'pfx']) assert.ok(ignored.includes('*.' + ext));
});

test('Android back is handled in-app and legal links leave the WebView', () => {
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  const ui = fs.readFileSync('ui-v2.js', 'utf8');
  const prepare = fs.readFileSync('scripts/prepare-capacitor.cjs', 'utf8');
  assert.match(activity, /SmartSomaUI\.back\(\)/);
  assert.match(activity, /Para sair, pressione novamente/);
  assert.match(ui, /openTermosMenuBtn'\)\.target='_self'/);
  assert.match(prepare, /href="https:\/\/smartsoma\.pt\/legal" target="_self"/);
});

test('Android darkens only the three-button navigation area without consuming insets', () => {
  const activity = fs.readFileSync('android/app/src/main/java/pt/smartsoma/app/MainActivity.java', 'utf8');
  assert.match(activity, /shade\.setBackgroundColor\(Color\.argb\(220, 6, 18, 10\)\)/);
  assert.match(activity, /WindowInsetsCompat\.Type\.navigationBars\(\)/);
  assert.match(activity, /WindowInsetsCompat\.Type\.tappableElement\(\)/);
  assert.match(activity, /int height = buttons \? bottom : 0/);
  assert.match(activity, /setAppearanceLightNavigationBars\(false\)/);
  assert.match(activity, /return insets;/);
});
