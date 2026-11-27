import {createDirectorModel,directorNames} from './director-model.js';
import {selectVoice,englishVoices,speechSegments,speechDuration} from './voice-profile.js';
// One speech channel: bounded queue, human-sized phrases, no overlapping announcements.
export function createDirector(getPreferences,caption,{onSpeaking=()=>{}}={}){
 const model=createDirectorModel();let current=null,spoken=null,armed=false,expires=0,pending=null,generation=0,waiting=false,job=null,nextAt=0,previewing=false,previewStatus=null,busy=false,contextBlocked=false;
 const synth=typeof window!=='undefined'?window.speechSynthesis:null;
 const available=()=>{try{return synth?.getVoices()||[];}catch{return [];}};
 const isBusy=()=>!!(spoken||job||waiting);
 function setBusy(value){if(busy!==value){busy=value;onSpeaking(value);}}
 function cancel(reason='cancelled'){generation++;waiting=false;job=null;nextAt=0;const had=!!spoken;spoken=null;try{if(had&&synth)synth.cancel();}catch{}setBusy(false);if(previewing){previewing=false;const cb=previewStatus;previewStatus=null;cb?.(reason);}}
 function hide(){caption.hidden=true;current=null;expires=0;}
 function reset(){cancel();hide();pending=null;contextBlocked=false;model.reset();}
 function complete(reason='finished'){const preview=previewing,cb=previewStatus;previewing=false;previewStatus=null;job=null;waiting=false;setBusy(false);expires=performance.now()+1800;if(preview){hide();cb?.(reason);}}
 function next(now=performance.now()){
  if(!job||spoken||now<nextAt)return;
  if(document.hidden){cancel();return;}
  const segment=job.parts[job.index];if(!segment){complete();return;}
  try{const u=new SpeechSynthesisUtterance(segment.text),token=++generation;u.voice=job.voice;u.lang=job.voice.lang;u.volume=job.volume;u.rate=segment.rate;u.pitch=segment.pitch;spoken=u;setBusy(true);
   u.onend=()=>{if(token!==generation)return;spoken=null;job.index++;if(job.index>=job.parts.length){complete();return;}nextAt=performance.now()+segment.pause;expires=Math.max(expires,nextAt+speechDuration(job.parts[job.index].text,job.parts[job.index].rate));};
   u.onerror=()=>{if(token!==generation)return;spoken=null;complete('unavailable');};synth.speak(u);
  }catch{spoken=null;complete('unavailable');}
 }
 function start(p=getPreferences()){
  if(!current||isBusy()&&!waiting||!armed||!p.directorVoice||p.directorVolume<=0||!synth||typeof SpeechSynthesisUtterance==='undefined'||document.hidden)return false;
  const voice=selectVoice(available(),p);if(!voice){waiting=true;return false;}waiting=false;
  const parts=speechSegments(current.text,current.kind,p.directorPace,p.directorStyle);if(!parts.length)return false;
  job={parts,index:0,voice,volume:p.directorVolume};nextAt=0;expires=performance.now()+Math.min(60000,parts.reduce((sum,v)=>sum+speechDuration(v.text,v.rate)+v.pause,0)+5000);next();return true;
 }
 function dispatch(scenario,event,now=performance.now()){
  if(!event)return;
  if(event.kind==='pause'){pending=null;cancel();}
  else if(event.priority<4&&(contextBlocked&&event.priority<=2||isBusy()&&current&&current.priority>=event.priority)){
   if(!pending||event.priority>=pending.event.priority)pending={scenario,event,at:now};return;
  }
  cancel();pending=null;current={...event,scenario};expires=now+speechDuration(event.text,speechSegments(event.text,event.kind,getPreferences().directorPace,getPreferences().directorStyle)[0]?.rate||1);
  caption.querySelector('strong').textContent=directorNames[scenario]||directorNames.lab;caption.querySelector('span').textContent=event.text;caption.hidden=getPreferences().directorCaptions===false;start();
 }
 function arm(){armed=true;if(waiting&&current&&!previewing)start();}
 function refresh(){const p=getPreferences();if(!p.directorVoice||p.directorVolume<=0)cancel();caption.hidden=!current||p.directorCaptions===false;}
 function idle(now){if(current&&now>=expires){cancel('timeout');hide();}if(job&&!spoken)next(now);if(pending&&!isBusy()&&!previewing&&(!contextBlocked||pending.event.priority>=3)){const n=pending;pending=null;if(now-n.at<15000)dispatch(n.scenario,n.event,now);}}
 function tick(input){const now=input.now??performance.now();contextBlocked=!!input.quiet;idle(now);if(!input.crisis?.enabled){if(!previewing)reset();return;}const event=model.tick(input);if(event)dispatch(input.scenario,event,now);}
 function finish(scenario,crisis,win){contextBlocked=false;if(crisis?.enabled)dispatch(scenario,model.finish(scenario,crisis,win));}
 function voices(p=getPreferences()){return englishVoices(available(),p.directorOnline===true).sort((a,b)=>a.name.localeCompare(b.name));}
 function preview(p,kind='briefing',status=()=>{}){
  cancel();pending=null;armed=true;previewing=true;previewStatus=status;
  const samples={briefing:"Flight control here. We've got a little problem with the navigation system. Take your time with the checks, and I'll keep you updated.",warning:"Quick update, team. We're running low on reserves. Focus on the last few checks.",repair:"Brilliant work! That's another system back online. You're nearly there."};
  current={scenario:'lab',kind,priority:2,text:samples[kind]||samples.briefing};expires=performance.now()+speechDuration(current.text,p.directorPace);
  const ok=start({...p,directorVoice:true});if(!ok){cancel('unavailable');hide();}else status('playing');return ok;
 }
 function stopPreview(){if(previewing){cancel();hide();}}
 const listeners=new Set();function subscribeVoices(fn){listeners.add(fn);return ()=>listeners.delete(fn);}
 synth?.addEventListener?.('voiceschanged',()=>{for(const fn of listeners)fn();if(waiting&&current&&!document.hidden&&performance.now()<expires&&!previewing)start();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();pending=null;}});
 return {arm,reset,refresh,tick,finish,idle,voices,preview,stopPreview,subscribeVoices};
}
