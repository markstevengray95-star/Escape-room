import {createDirectorModel,directorNames} from './director-model.js';
// No external voice API. Prefer local device voices; if unavailable, retain captions.
export function createDirector(getPreferences,caption){
 const model=createDirectorModel();let current=null,spoken=null,armed=false,expires=0;
 const synth=typeof window!=='undefined'?window.speechSynthesis:null;
 function cancel(){try{if(spoken&&synth)synth.cancel();}catch{}spoken=null;}
 function hide(){caption.hidden=true;current=null;expires=0;}
 function reset(){cancel();hide();model.reset();}
 function dispatch(scenario,event,now=performance.now()){
  if(!event)return;
  if(current&&now<expires&&current.priority>event.priority)return;
  cancel();current={...event,scenario};expires=now+Math.max(6500,Math.min(18000,event.text.length*65));
  caption.querySelector('strong').textContent=directorNames[scenario]||directorNames.lab;
  caption.querySelector('span').textContent=event.text;
  caption.hidden=getPreferences().directorCaptions===false;
  speak();
 }
 function speak(){
  const p=getPreferences();if(!current||!armed||!p.directorVoice||p.directorVolume<=0||!synth||typeof SpeechSynthesisUtterance==='undefined'||document.hidden)return;
  try{
   const voices=synth.getVoices().filter(v=>v.localService&&/^en(?:-|_)/i.test(v.lang));
   const voice=voices.find(v=>/^en[-_]GB/i.test(v.lang))||voices[0];if(!voice)return;
   const u=new SpeechSynthesisUtterance(current.text);u.voice=voice;u.lang=voice.lang;u.volume=p.directorVolume;u.rate=current.priority>=3?.96:.91;u.pitch=current.scenario==='space'?.88:1;
   spoken=u;u.onend=u.onerror=()=>{if(spoken===u)spoken=null;};synth.speak(u);
  }catch{}
 }
 function arm(){armed=true;}
 function refresh(){const p=getPreferences();if(!p.directorVoice||p.directorVolume<=0)cancel();caption.hidden=!current||p.directorCaptions===false;}
 function tick(input){const now=input.now??performance.now();if(current&&now>=expires){cancel();hide();}if(!input.crisis?.enabled){reset();return;}const event=model.tick(input);if(event)dispatch(input.scenario,event,now);}
 function finish(scenario,crisis,win){if(crisis?.enabled)dispatch(scenario,model.finish(scenario,crisis,win));}
 function idle(now){if(current&&now>=expires){cancel();hide();}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 return {arm,reset,refresh,tick,finish,idle};
}
