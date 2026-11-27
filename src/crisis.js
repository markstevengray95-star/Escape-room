import {repairEnabled,repairSystems} from './repairs.js';
import {required} from './curriculum.js';
// Fictional narrative stakes; never a second failure condition.
export const crises={
 lab:{name:'Containment failure',system:'Containment integrity',brief:'Restore containment before the facility enters permanent lockdown.',warnings:['Recover the research log.','Containment warning: complete the safety investigations.','Containment critical: restore the remaining systems.','Emergency lockdown imminent.','Final countdown: complete the containment protocol.'],success:'Containment restored. Facility secured.',failure:'The simulated facility has entered permanent lockdown.'},
 space:{name:'Life support emergency',system:'Life support reserve',brief:'Restore life support and navigation before the emergency reserve expires.',warnings:['Life support reserve declining. Locate the flight log.','Life support warning: complete engineering diagnostics.','Emergency reserves critical. Recover launch authorisation.','Navigation deadline approaching.','Final countdown: launch authorisation required.'],success:'Life support and navigation restored. Crew evacuated.',failure:'The spacecraft has entered simulated emergency shutdown.'},
 bio:{name:'Containment breach',system:'Containment control',brief:'Identify the fictional specimen and secure the research facility.',warnings:['Recover the research log.','Containment warning: complete specimen investigations.','Containment controls critical.','Emergency seal imminent.','Final countdown: containment authorisation required.'],success:'Specimen contained. Research facility secured.',failure:'The simulated facility has entered emergency isolation.'},
 chem:{name:'Unstable reaction simulation',system:'Safety system stability',brief:'Complete the chemical investigations and restore the simulated safety interlock.',warnings:['Locate the safety record.','Safety system warning: complete the analyses.','Safety system critical.','Emergency shutdown imminent.','Final countdown: activate the safety release.'],success:'Safety system stabilised. Facility secured.',failure:'The simulated safety system has shut down the facility.'},
 blackout:{name:'Grid failure',system:'Emergency power reserve',brief:'Restore the fictional city grid before emergency power expires.',warnings:['Emergency power online. Locate the maintenance log.','Reserve warning: complete grid diagnostics.','Emergency power critical.','Grid restart deadline approaching.','Final countdown: grid restart required.'],success:'Grid restored. Simulated city power returned.',failure:'The simulated grid has entered emergency shutdown.'},
 tomb:{name:'Chamber instability',system:'Chamber stability',brief:'Solve the scientific mechanisms and open the exit seal before the passage closes.',warnings:['Recover the survey scroll.','Chamber instability warning: investigate mechanisms.','Chamber stability critical.','Exit seal deadline approaching.','Final countdown: open the exit seal.'],success:'Exit seal opened. Survey team safely evacuated.',failure:'The fictional chamber has sealed. Survey mission ended.'}
};
export const crisisDefinition=id=>crises[id]||crises.lab;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function crisisSnapshot({scenario='lab',remaining=1800,duration=1800,state={},variant={},phase='playing',enabled=true}={}){
 const d=crisisDefinition(scenario),total=Number.isFinite(duration)&&duration>0?duration:1800,left=clamp(Number.isFinite(remaining)?remaining:total,0,total);
 const ids=required(variant),solved=new Set(Array.isArray(state.solved)?state.solved:[]),done=ids.filter(x=>solved.has(x)).length;
 const milestones=Number(!!state.note)+Number(!!state.power)+Number(!!state.door)+Number(!!state.archiveGate)+Number(!!state.archive);
 const progress=clamp((done+milestones)/(ids.length+5),0,1),fraction=left/total;
 const stage=left<=60?4:fraction<=1/6?3:fraction<=1/3?2:fraction<=2/3?1:0;
 const labels=['Investigation','Warning','Critical','Emergency','Final countdown'];
 const outcome=state.escaped?'restored':phase==='ended'?(left===0?'failed':'stopped'):'active';
 const systems=repairEnabled(variant)?repairSystems(state,{...variant,scenario}):[];const restored=systems.filter(g=>g.online).length;
 const integrity=outcome==='restored'?100:outcome==='failed'?0:clamp(Math.round(100-82*(1-fraction)+45*progress+restored*3+Math.min(2,(state.bonuses||[]).length)*5),1,100);
 return {systems,restored,enabled:enabled!==false,name:d.name,system:d.system,stage,label:outcome==='restored'?'Stabilised':outcome==='failed'?'Mission failed':outcome==='stopped'?'Session ended':labels[stage],integrity,progress:Math.round(progress*100),outcome,paused:phase==='paused',message:outcome==='restored'?d.success:outcome==='failed'?d.failure:outcome==='stopped'?'Your teacher ended the simulation.':d.warnings[stage]};
}
