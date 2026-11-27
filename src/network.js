export function network(){
 let session=null;try{session=JSON.parse(sessionStorage.getItem('escape-session')||'null');}catch{}
 async function call(route,data={}){
  const response=await fetch('/api/escape/'+route,{signal:AbortSignal.timeout(10000),method:'POST',headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})},body:JSON.stringify(data)});
  let result;try{result=await response.json();}catch{throw Error('Multiplayer server is unavailable. Solo practice still works.');}
  if(!response.ok)throw Error(result.error||'Connection failed.');
  if(route==='create'||route==='join'){session=result;try{sessionStorage.setItem('escape-session',JSON.stringify(result));}catch{}}
  return result;
 }
 return {call,get session(){return session;},clear(){session=null;try{sessionStorage.removeItem('escape-session');}catch{}}};
}
