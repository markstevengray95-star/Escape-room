import {createServer} from 'node:http';
import {createReadStream,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {createApi} from './api.js';
const root=resolve('dist'),api=createApi(),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
createServer((req,res)=>api(req,res,()=>{
 try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root+sep)||!statSync(file).isFile())throw Error();res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});createReadStream(file).pipe(res);}catch{res.writeHead(404);res.end('Not found');}
})).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Escape Lab listening'));
