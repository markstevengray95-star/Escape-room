export function network(){
 let session=null;try{session=JSON.parse(sessionStorage.getItem('escape-session')||'null');}catch{}
 async function call(route,data={}){
  const response=await fetch('/api/escape/'+route,{method:'POST',headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})},body:JSON.stringify(data)});
  let result;try{result=await response.json();}catch{throw Error('Multiplayer server is unavailable. Solo practice still works.');}
  if(!response.ok)throw Error(result.error||'Connection failed.');
  if(route==='create'||route==='join'){session=result;sessionStorage.setItem('escape-session',JSON.stringify(result));}
  return result;
 }
 return {call,get session(){return session;},clear(){session=null;sessionStorage.removeItem('escape-session');}};
}
