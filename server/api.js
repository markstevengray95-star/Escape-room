import {createStore} from './rooms.js';
export function createApi(store=createStore()){
 const limits=new Map();
 return async function api(req,res,next){
  const path=new URL(req.url,'http://localhost').pathname;
  if(!path.startsWith('/api/escape/'))return next();
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  if(req.method!=='POST')return send(405,{error:'Use POST.'});
  try{
   const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host) return send(403,{error:'Origin not allowed.'});
   let body='';for await(const chunk of req){body+=chunk;if(body.length>60000)return send(413,{error:'Request too large.'});}
   const data=JSON.parse(body||'{}'),key=req.headers.authorization?.replace(/^Bearer /,'');
   const route=path.split('/').at(-1);
   if(route==='create'||route==='join'){const ip=req.socket.remoteAddress||'local',now=Date.now(),bucket=limits.get(ip)||{start:now,count:0};if(now-bucket.start>60000){bucket.start=now;bucket.count=0;}bucket.count++;limits.set(ip,bucket);if(limits.size>2000)for(const [k,v] of limits)if(now-v.start>60000)limits.delete(k);if(bucket.count>60)return send(429,{error:'Too many requests. Try again shortly.'});}
   let result;switch(route){case 'create':result=store.create(Number(data.size),data.options||{});break;case 'join':result=store.join(data.pin,data.name);break;case 'view':result=store.view(key);break;case 'host':result=store.host(key,data.action,data);break;case 'position':result=store.position(key,data.position);break;case 'action':result=store.action(key,data.id,data.value);break;default:return send(404,{error:'Unknown endpoint.'});}
   send(200,result);
  }catch(e){send(e.status||400,{error:e.status?e.message:'Invalid request.'});}
 };
}
