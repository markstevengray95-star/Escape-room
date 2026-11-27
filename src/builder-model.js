import {scenarioIds,scenarioLayout} from './scenarios.js';
import {stationOrder,subjects,topics} from './curriculum.js';
export const safeGateSlots=stationOrder.filter(id=>!['graph','variables','spectrum'].includes(id));
export function normalizeMission(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1)throw Error('Unsupported mission format.');
 const str=(v,max,label,optional=false)=>{if(typeof v!=='string'||v.trim().length>max||(!optional&&!v.trim()))throw Error(label+' must '+(optional?'be at most ':'contain 1–')+max+' characters.');return v.trim();};
 const title=str(raw.title,70,'Mission title'),brief=str(raw.brief,350,'Mission briefing'),note=str(raw.note??'',200,'Extra note',true);
 if(!scenarioIds.includes(raw.scenario))throw Error('Choose a valid environment.');
 const minutes=Number(raw.minutes),size=Number(raw.size);if(![15,30,45,60].includes(minutes)||![2,3,4,5].includes(size))throw Error('Choose a valid duration and team size.');
 if(!Array.isArray(raw.puzzles)||raw.puzzles.length<1||raw.puzzles.length>11)throw Error('Place between 1 and 11 puzzles.');
 const ids=new Set();
 const puzzles=raw.puzzles.map((p,i)=>{if(!p||!stationOrder.includes(p.station)||ids.has(p.station))throw Error('Puzzle '+(i+1)+': choose a different valid station.');ids.add(p.station);
 const label=str(p.label,45,'Station label'),clue=str(p.clue??'',180,'Evidence clue',true);
 if(!subjects[p.subject]||!topics[p.topic])throw Error('Select a valid subject and topic.');
 if(!Array.isArray(p.choices)||p.choices.length!==4)throw Error('Provide four options at '+label+'.');
 const choices=p.choices.map(c=>str(c,180,'Answer option'));
 if(new Set(choices.map(c=>c.toLowerCase())).size!==4)throw Error('Answer options must be distinct at '+label+'.');
 if(!Number.isInteger(p.correctIndex)||p.correctIndex<0||p.correctIndex>3)throw Error('Select a correct answer at '+label+'.');
 return {station:p.station,label,clue,subject:p.subject,topic:p.topic,prompt:str(p.prompt,350,'Question'),choices,correctIndex:p.correctIndex,explanation:str(p.explanation,350,'Explanation')};});
 if(!Array.isArray(raw.gateRequires)||new Set(raw.gateRequires).size!==raw.gateRequires.length||raw.gateRequires.some(id=>!ids.has(id)||!safeGateSlots.includes(id)))throw Error('The analysis gate can only require selected stations outside locked rooms.');
 return {version:1,title,brief,note,scenario:raw.scenario,minutes,size,puzzles,gateRequires:[...raw.gateRequires]};
}
export const publicMission=m=>({title:m.title,brief:m.brief,labels:Object.fromEntries(m.puzzles.map(p=>[p.station,p.label])),gateRequires:m.gateRequires});
export const emptyMission=()=>({version:1,title:'My science mission',brief:'Investigate the facility, collect evidence and unlock the final exit.',note:'',scenario:'lab',minutes:30,size:4,puzzles:[],gateRequires:[]});
export function newPuzzle(station,scenario){const p=scenarioLayout(scenario).stations.find(p=>p.id===station);return {station,label:p.name,clue:'',subject:'W',topic:'practical',prompt:'',choices:['','','',''],correctIndex:0,explanation:''};}
