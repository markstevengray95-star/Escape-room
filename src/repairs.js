import {required} from './curriculum.js';
// Fictional educational systems. Each assigned station belongs to exactly one subsystem.
const groups=[
 {id:'supply',stations:['energy','moments'],milestones:['power']},
 {id:'diagnostics',stations:['microscope','indicator','osmosis','separation','density'],milestones:[]},
 {id:'control',stations:['equation','graph','variables','spectrum'],milestones:['archiveGate']},
 {id:'release',stations:[],milestones:['note','door','archive']}
];
const names={
 lab:['Emergency supply','Containment diagnostics','Safety controller','Exit authorisation'],
 space:['Ship power reserve','Life support diagnostics','Navigation controller','Launch authorisation'],
 bio:['Research facility supply','Specimen diagnostics','Containment controller','Safe release authorisation'],
 chem:['Emergency supply','Chemical analysis','Safety interlock controller','Safety release authorisation'],
 blackout:['Reserve power','Equipment diagnostics','Grid controller','Restart authorisation'],
 tomb:['Lifting mechanism','Artefact diagnostics','Chamber mechanism','Exit seal authorisation']
};
export const repairEnabled=v=>v?.repairProtocol===true;
export function repairSystems(s={},v={}){
 const assigned=required(v),solved=new Set(s.solved||[]),activated=new Set(s.repairs||[]),labels=names[v.scenario]||names.lab;
 return groups.map((g,i)=>{
  const tasks=g.stations.filter(id=>assigned.includes(id)).concat(g.milestones);
  const remaining=tasks.filter(id=>g.milestones.includes(id)?!s[id]:!solved.has(id));
  return {id:g.id,name:labels[i],tasks,remaining,completed:tasks.length-remaining.length,total:tasks.length,ready:remaining.length===0,online:remaining.length===0&&activated.has(g.id)};
 });
}
export const allRepairsOnline=(s,v)=>repairSystems(s,v).every(g=>g.online);
export function repairTransition(s,v,id){
 if(!repairEnabled(v))return {state:s,ok:false,message:'The repair protocol is not enabled.'};
 if(!s.door)return {state:s,ok:false,message:'Unlock the control chamber first.'};
 const system=repairSystems(s,v).find(g=>g.id===id);
 if(!system)return {state:s,ok:false,message:'Unknown simulated system.'};
 if(system.online)return {state:s,ok:false,message:system.name+' is already online.'};
 if(!system.ready)return {state:s,ok:false,message:'Complete the remaining assigned investigations first.'};
 return {state:{...s,repairs:[...new Set([...(s.repairs||[]),id])]},ok:true,message:system.name+' restored.'};
}
