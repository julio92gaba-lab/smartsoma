// Local-only visual QA. This directory is excluded from deployments.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf'};
http.createServer((req,res) => {
  const url = new URL(req.url,'http://127.0.0.1');
  if(url.pathname === '/__ui-test') {
    let html=fs.readFileSync(path.join(root,'app.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
    html=html.replace('</body>','<script src="/tests/visual-fixture.js"></script><script src="/ui-v2.js"></script><script src="/app.js"></script></body>');
    res.writeHead(200,{'Content-Type':types['.html'],'Cache-Control':'no-store'});res.end(html);return;
  }
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()||url.pathname.includes('/.')){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(4175,'127.0.0.1',()=>console.log('Isolated visual QA: http://127.0.0.1:4175/__ui-test'));
