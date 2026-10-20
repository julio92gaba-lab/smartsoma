const fs = require('node:fs');
const path = require('node:path');

// Apenas ficheiros públicos usados pela aplicação; nunca copiar a raiz inteira.
const files = [
  'index.html', 'app.html', 'login.html', 'legal.html', 'obrigado.html',
  '404.html', 'mobile-frame.html', 'app.css', 'ui-v2.css', 'app.js',
  'ui-v2.js', 'cloud-init.js', 'mobile-frame-shell.js', 'pwa-install.js',
  'sw.js', 'manifest.json', 'supabase.min.js', 'heic2any.min.js',
  'jspdf.umd.min.js', 'jspdf.plugin.autotable.min.js',
  '01uber.png', '02bolt.png', '04despesas.png', '05distancia.png',
  'car.png', 'favicon.png', 'FUNDO.png', 'icon-192.png', 'icon-512.png', 'lista.png',
  'logo.png', 'logo-home.png', 'logopeq.png', 'tabela.png',
  'wallpaper-light.webp', 'wallpaper-dark.webp',
  'ganhos.jpeg', 'resumo.jpeg', 'despesasfixas.jpeg', 'detalhes.jpeg',
  'fonts/BricolageGrotesque-latin.woff2', 'fonts/DMSans-latin.woff2',
  'fonts/BricolageGrotesque-OFL.txt', 'fonts/DMSans-OFL.txt',
  'fonts/Inter-Light.ttf', 'fonts/Inter-Regular.ttf', 'fonts/Inter-SemiBold.ttf'
];
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'capacitor-web');
for (const file of files) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, file), target);
}
// A apresentação Android replica a imagem e a cor da tela nativa, sem alterar o site.
const nativeSplash = '<style>html,body{background:#0E5830}#splash{position:fixed;inset:0;z-index:9999;background:#0E5830}#pwaToast,#pwaSheetInstall,#subExpiradaBackdrop .sub-expired-plans,#subExpiradaBackdrop .cancelar-sub-note{display:none!important}</style>';
const nativeApp = fs.readFileSync(path.join(root, 'app.html'), 'utf8')
  .replace('<head>', '<head>' + nativeSplash)
  .replace('<script src="ui-v2.js?v=20" defer></script>', '<link rel="stylesheet" href="native-splash.css">\n    <script src="ui-v2.js?v=20" defer></script>')
  .replace('<div id="splash">', '<div id="splash">\n    <img class="native-splash-symbol" src="native-splash-icon.png" alt="">')
  .replace('</body>', '<script src="native-billing-ui.js"></script>\n<script src="native-startup.js"></script>\n</body>');
if (!nativeApp.includes('native-splash.css') || !nativeApp.includes('native-splash-icon.png') ||
    !nativeApp.includes('src="native-billing-ui.js"')) {
  throw new Error('Não foi possível preparar a interface Android.');
}
fs.copyFileSync(path.join(root, 'scripts', 'native-splash.css'), path.join(output, 'native-splash.css'));
fs.copyFileSync(path.join(root, 'scripts', 'native-startup.js'), path.join(output, 'native-startup.js'));
fs.copyFileSync(path.join(root, 'scripts', 'native-billing-ui.js'), path.join(output, 'native-billing-ui.js'));
fs.copyFileSync(path.join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi', 'smartsoma_splash_icon.png'), path.join(output, 'native-splash-icon.png'));
fs.writeFileSync(path.join(output, 'app.html'), nativeApp);
// O arranque nativo abre a aplicação, não a página de apresentação do website.
fs.writeFileSync(path.join(output, 'index.html'), nativeApp);
// No pacote Android, os links legais abrem o navegador e o logótipo não leva à landing page.
const nativeLogin = fs.readFileSync(path.join(root, 'login.html'), 'utf8')
  .replace('<a href="index.html">', '<a>')
  .replaceAll('href="legal.html"', 'href="https://smartsoma.pt/legal" target="_self"')
  .replace("const LINK_PARAMS = (window.location.hash || '') + '&' + (window.location.search || '');", "const LINK_PARAMS = (window.location.hash || '') + '&' + (window.location.search || '');\n    const IS_NATIVE_AUTH_CALLBACK = /[?&]native_oauth_(?:code|error)=/.test(window.location.search);")
  .replace("if (!data.session || IS_RECOVERY_LINK || modo === 'novaSenha') return;", "if (!data.session || IS_RECOVERY_LINK || IS_NATIVE_AUTH_CALLBACK || modo === 'novaSenha') return;")
  .replace('</body>', '<script src="native-auth.js"></script>\n<script src="native-startup.js"></script>\n</body>');
if (!nativeLogin.includes('src="native-auth.js"') || !nativeLogin.includes('|| IS_NATIVE_AUTH_CALLBACK ||')) {
  throw new Error('Não foi possível preparar a autenticação Android.');
}
fs.writeFileSync(path.join(output, 'login.html'), nativeLogin);
fs.copyFileSync(path.join(root, 'scripts', 'native-auth.js'), path.join(output, 'native-auth.js'));
console.log(`Preparados ${files.length} ficheiros públicos em capacitor-web/.`);
