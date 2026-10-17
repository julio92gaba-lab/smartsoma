// Pré-visualização isolada: só dados fictícios e sem acesso à rede externa.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {createVisualServer} = require('./serve-ui.cjs');
const root = path.resolve(__dirname, '..');
const fallback = createVisualServer();
const files = new Set(['/mobile-frame.html','/mobile-frame.js','/mobile-frame-shell.js']);
const policy = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'none'; frame-src 'self'; frame-ancestors 'self'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/app'){
    let html=fs.readFileSync(path.join(root,'app.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
    html=html.replace('<head>','<head><script src="/mobile-frame.js"></script>');
    html=html.replace('</body>','<script src="/tests/visual-fixture.js"></script><script src="/ui-v2.js"></script><script src="/app.js"></script></body>');
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':policy});res.end(html);return;
  }
  if(files.has(url.pathname)){
    res.writeHead(200,{'Content-Type':url.pathname.endsWith('.html')?'text/html; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':policy});
    fs.createReadStream(path.join(root,url.pathname.slice(1))).pipe(res);return;
  }
  fallback.emit('request',req,res);
}).listen(4176,'127.0.0.1',()=>console.log('Pré-visualização isolada: http://127.0.0.1:4176/app'));
