import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');const port=Number(process.env.PORT||8080);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('Invalid PORT.');
const server=http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 const p=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{const bytes=fs.readFileSync(p);res.writeHead(200,{'Content-Type':p.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(port,'127.0.0.1',()=>console.log(`Local game: http://127.0.0.1:${port}`));
