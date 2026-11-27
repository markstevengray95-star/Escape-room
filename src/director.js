import {createDirectorModel,directorNames} from './director-model.js';
import {selectVoice,englishVoices,speechDelivery,speechDuration} from './voice-profile.js';
// Browser voices only. Online device voices are an explicit opt-in.
export function createDirector(getPreferences,caption){
 const model=createDirectorModel();let current=null,spoken=null,armed=false,expires=0,pending=null,previewing=false,generation=0,waiting=false;
 const synth=typeof window!=='undefined'?window.speechSynthesis:null;
 const available=()=>{try{return synth?.getVoices()||[];}catch{return [];}};
 function cancel(){generation++;waiting=false;previewing=false;const had=!!spoken;spoken=null;try{if(had&&synth)synth.cancel();}catch{}}
 function hide(){caption.hidden=true;current=null;expires=0;}
 function reset(){cancel();hide();pending=null;model.reset();}
 function speak(p=getPreferences()){
  if(!current||spoken||!armed||!p.directorVoice||p.directorVolume<=0||!synth||typeof SpeechSynthesisUtterance==='undefined'||document.hidden)return false;
  const voice=selectVoice(available(),p);if(!voice){waiting=true;return false;}waiting=false;
  try{const u=new SpeechSynthesisUtterance(current.text),token=++generation,delivery=speechDelivery(current.kind,p.directorPace);
   u.voice=voice;u.lang=voice.lang;u.volume=p.directorVolume;u.rate=delivery.rate;u.pitch=delivery.pitch;
   spoken=u;const complete=()=>{if(token!==generation)return;spoken=null;previewing=false;if(current)expires=Math.max(expires,performance.now()+1000);};
   u.onend=complete;u.onerror=complete;synth.speak(u);return true;
  }catch{spoken=null;return false;}
 }
 function dispatch(scenario,event,now=performance.now()){
  if(!event)return;
  if(current&&now<expires&&event.priority<4&&(spoken||waiting||previewing)&&current.priority>=event.priority){if(!pending||event.priority>=pending.event.priority)pending={scenario,event,at:now};return;}
  cancel();pending=null;current={...event,scenario};expires=now+speechDuration(event.text,speechDelivery(event.kind,getPreferences().directorPace).rate);
  caption.querySelector('strong').textContent=directorNames[scenario]||directorNames.lab;caption.querySelector('span').textContent=event.text;caption.hidden=getPreferences().directorCaptions===false;speak();
 }
 function arm(){if(!armed){armed=true;if(current&&waiting)speak();}}
 function refresh(){const p=getPreferences();if(!p.directorVoice||p.directorVolume<=0)cancel();caption.hidden=!current||p.directorCaptions===false;}
 function idle(now){if(current&&now>=expires){cancel();hide();}if(pending&&!spoken&&!waiting&&!previewing){const next=pending;pending=null;if(now-next.at<15000)dispatch(next.scenario,next.event,now);}}
 function tick(input){const now=input.now??performance.now();idle(now);if(!input.crisis?.enabled){if(!previewing)reset();return;}const event=model.tick(input);if(event)dispatch(input.scenario,event,now);}
 function finish(scenario,crisis,win){if(crisis?.enabled)dispatch(scenario,model.finish(scenario,crisis,win));}
 function voices(p=getPreferences()){return englishVoices(available(),p.directorOnline===true).sort((a,b)=>a.name.localeCompare(b.name));}
 function preview(p){cancel();pending=null;armed=true;previewing=true;current={scenario:'lab',kind:'preview',priority:2,text:"Hi there, team. Nice work so far! Keep exploring, and I’ll let you know if anything changes."};expires=performance.now()+speechDuration(current.text,p.directorPace);const ok=speak({...p,directorVoice:true});if(!ok){previewing=false;waiting=false;hide();}return ok;}
 function stopPreview(){if(previewing){cancel();hide();}}
 synth?.addEventListener?.('voiceschanged',()=>{if(waiting&&current&&!document.hidden&&performance.now()<expires)speak();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();pending=null;}});
 return {arm,reset,refresh,tick,finish,idle,voices,preview,stopPreview};
}
