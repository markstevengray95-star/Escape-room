import {required} from './curriculum.js';
import {repairEnabled,repairSystems} from './repairs.js';
const endings={
 lab:{success:['CONTAINMENT VERIFIED','Safety systems restored','Facility secured'],failure:['CONTAINMENT UNRESOLVED','Emergency isolation engaged','Facility sealed'],symbol:'shield',color:'#79c7b5'},
 space:{success:['FLIGHT CHECK COMPLETE','Launch authorisation accepted','Spacecraft safely evacuated'],failure:['RESERVE DEPLETED','Navigation incomplete','Simulated emergency shutdown'],symbol:'orbit',color:'#83b9e8'},
 bio:{success:['SPECIMEN IDENTIFIED','Containment protocol verified','Research facility secured'],failure:['DIAGNOSTICS INCOMPLETE','Isolation protocol engaged','Research facility sealed'],symbol:'cell',color:'#8ccca3'},
 chem:{success:['ANALYSIS VERIFIED','Safety interlock restored','Facility released'],failure:['ANALYSIS INCOMPLETE','Safety shutdown engaged','Facility isolated'],symbol:'flask',color:'#e2bc81'},
 blackout:{success:['GRID DIAGNOSTICS VERIFIED','Synchronisation accepted','City power restored'],failure:['RESERVE EXPIRED','Grid restart incomplete','Simulated grid offline'],symbol:'grid',color:'#e5aa68'},
 tomb:{success:['MECHANISMS VERIFIED','Exit seal released','Survey team evacuated'],failure:['MECHANISMS INCOMPLETE','Exit passage sealed','Survey ended'],symbol:'seal',color:'#cfad76'}
};
const milestones=[['note','Mission record recovered'],['power','Electrical supply restored'],['door','Control chamber unlocked'],['archiveGate','Analysis chamber unlocked'],['archive','Archive recovered']];
export function endingReport({scenario='lab',state={},variant={},outcome='failed',remaining=0,elapsed=null,bonusSeconds=0,stations=[]}={}){
 const def=endings[scenario]||endings.lab,win=outcome==='restored',stopped=outcome==='stopped';
 const ids=required(variant),solved=new Set(state.solved||[]),tasks=ids.map(id=>({id,name:stations.find(p=>p.id===id)?.name||id,done:solved.has(id)}));
 const systems=repairEnabled(variant)?repairSystems(state,{...variant,scenario}):[];
 return {outcome,win,headline:win?'Mission accomplished':stopped?'Session ended by teacher':'Mission time expired',beats:stopped?['CLASSROOM SESSION ENDED','Progress recorded','Review your investigations']:win?def.success:def.failure,symbol:def.symbol,color:def.color,tasks,completed:tasks.filter(t=>t.done).length,total:tasks.length,systems,restored:systems.filter(g=>g.online).length,milestones:milestones.map(([id,name])=>({id,name,done:!!state[id]})),remaining:Math.max(0,Math.floor(remaining||0)),elapsed:Number.isFinite(elapsed)?Math.max(0,Math.floor(elapsed)):null,bonusCount:new Set(state.bonuses||[]).size,bonusSeconds:Math.max(0,Math.floor(bonusSeconds||0))};
}
export function endingBeat(elapsed){return elapsed<1400?0:elapsed<3000?1:2;}
export const ENDING_DURATION=4600;
