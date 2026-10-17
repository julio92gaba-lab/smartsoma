// Local-only visual QA. This directory is excluded from deployments.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf','.woff2':'font/woff2'};
const scripts = new Set(['/tests/visual-fixture.js','/ui-v2.js','/app.js','/jspdf.umd.min.js','/jspdf.plugin.autotable.min.js']);
const visualPolicy = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'none'; worker-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
function createVisualServer() { return http.createServer((req,res) => {
  const url = new URL(req.url,'http://127.0.0.1');
  if(req.method !== 'GET' && req.method !== 'HEAD'){res.writeHead(405);res.end();return;}
  if(url.pathname === '/__ui-test') {
    let html=fs.readFileSync(path.join(root,'app.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
    html=html.replace('</body>','<script src="/tests/visual-fixture.js"></script><script src="/ui-v2.js"></script><script src="/app.js"></script></body>');
    res.writeHead(200,{'Content-Type':types['.html'],'Cache-Control':'no-store','Content-Security-Policy':visualPolicy});res.end(html);return;
  }
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
  const asset = /^\/(?:fonts\/)?[^/]+\.(?:css|png|jpe?g|webp|ttf|woff2)$/i.test(pathname);
  const file=path.resolve(root,'.'+pathname);
  if((!asset&&!scripts.has(pathname))||!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()||pathname.includes('/.')){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}); }
if(require.main===module)createVisualServer().listen(4175,'127.0.0.1',()=>console.log('Isolated visual QA: http://127.0.0.1:4175/__ui-test'));
module.exports={createVisualServer};
