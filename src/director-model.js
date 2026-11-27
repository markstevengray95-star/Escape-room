import {crisisDefinition} from './crisis.js';
export const directorNames={lab:'Facility Control',space:'Flight Control',bio:'Research Control',chem:'Safety Control',blackout:'Grid Control',tomb:'Survey Control'};
export function createDirectorModel(){
 let last=null,lastProgressAt=0,lastHintAt=-Infinity,thresholds=new Set(),lastEventAt=-Infinity;
 const event=(kind,text,priority=1)=>({kind,text,priority});
 function reset(){last=null;lastProgressAt=0;lastHintAt=-Infinity;thresholds=new Set();lastEventAt=-Infinity;}
 function tick({scenario='lab',crisis,state={},remaining=1800,now=0,active=true,objective=''}={}){
  if(!active||!crisis?.enabled)return null;
  const snapshot={stage:crisis.stage,progress:crisis.progress,restored:crisis.restored||0,paused:crisis.paused,power:!!state.power,door:!!state.door,ready:(crisis.systems||[]).filter(x=>x.ready&&!x.online).length,remaining};
  const old=last;last=snapshot;
  if(!old){lastProgressAt=now;if(crisis.paused)return null;for(const n of [60,30,10])if(remaining<=n)thresholds.add(n);lastEventAt=now;return event('briefing',crisisDefinition(scenario).brief+' '+crisis.message,2);}
  if(snapshot.paused){if(!old.paused)return event('pause','Mission paused by your teacher.',3);return null;}
  if(old.paused){lastProgressAt=now;lastEventAt=now;return event('resume','Mission resumed. Continue your investigations.',2);}
  if(snapshot.progress>old.progress||snapshot.restored>old.restored)lastProgressAt=now;
  // An extension may re-arm future thresholds, but never replays crossed thresholds on every poll.
  if(remaining>old.remaining+60)for(const n of [60,30,10])if(remaining>n)thresholds.delete(n);
  const crossed=[10,30,60].find(n=>remaining>0&&remaining<=n&&old.remaining>n&&!thresholds.has(n));
  if(crossed){for(const n of [60,30,10])if(remaining<=n)thresholds.add(n);lastEventAt=now;return event('countdown',crossed+' seconds remaining. '+(crossed===10?'Finalise your mission.':'Complete the remaining objectives.'),4);}
  if(snapshot.stage>old.stage){lastEventAt=now;return event('warning',crisis.message,3);}
  if(snapshot.restored>old.restored){lastEventAt=now;return event('repair',snapshot.restored===4?'All four systems online. Enter the final escape code.':snapshot.restored+' of four systems restored. Excellent work, team.',2);}
  if(snapshot.power&&!old.power){lastEventAt=now;return event('repair','Emergency supply restored. Continue to the control chamber.',2);}
  if(snapshot.ready>old.ready&&now-lastEventAt>8000){lastEventAt=now;return event('ready','A subsystem is ready to activate. Check the final console.',1);}
  if(snapshot.progress>old.progress&&now-lastEventAt>25000){lastEventAt=now;return event('progress','Investigation confirmed. System recovery is progressing.',1);}
  if(now-lastProgressAt>=90000&&now-lastHintAt>=90000&&now-lastEventAt>20000&&remaining>60&&objective){lastHintAt=lastEventAt=now;return event('guidance','Mission guidance. '+objective+'.',1);}
  return null;
 }
 return {tick,reset,finish(scenario,crisis,win){return event('ending',crisis?.message||(win?crisisDefinition(scenario).success:crisisDefinition(scenario).failure),5);}};
}
