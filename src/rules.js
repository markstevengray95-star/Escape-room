import {required} from './curriculum.js';
import {stations,validateStation} from './puzzles.js';
export const DURATION=1800;
export const initialState=()=>({drawer:false,note:false,power:false,door:false,archiveGate:false,archive:false,escaped:false,solved:[]});
export function transition(s,action,value,variant={current:3,suffix:'14',archiveDigit:'7'}){
 const reject=message=>({state:s,ok:false,message});
 const accept=(patch,message)=>({state:{...s,...patch},ok:true,message});
 if(s.escaped) return reject('Already escaped.');
 if(stations.some(p=>p.id===action)){if(['graph','variables'].includes(action)&&!s.archiveGate)return reject('Unlock the analysis lab first.');if(action==='spectrum'&&!s.door)return reject('Unlock the control room first.');if(s.solved.includes(action))return reject('Investigation already completed.');if(!required(variant).includes(action))return reject('This station is not assigned.');const question=variant.questions?.[action];const r=question?(typeof value?.choice==='string'&&value.choice===question.correct?{ok:true,message:question.explanation}:{ok:false,message:'Not quite. Reconsider the evidence and try again.'}):validateStation(action,value,variant);return r.ok?accept({solved:[...s.solved,action]},r.message):reject(r.message);}
 switch(action){
 case 'drawer':return accept({drawer:!s.drawer},s.drawer?'Drawer closed.':'Drawer opened. Inspect the yellow note.');
 case 'note':return s.note?reject('Note already collected.'):s.drawer?accept({note:true},'Evidence collected.'):reject('Open the drawer first.');
 case 'power':if(s.power)return reject('Power is already online.');{const r=validateStation('power',value,variant);return r.ok?accept({power:true},r.message):reject(r.message);}
 case 'door':if(s.door)return reject('Door already unlocked.');if(!s.note||!s.power)return reject('Find the note and restore power first.');return String(value).trim()===String(variant.current)+variant.suffix?accept({door:true},'Security door unlocked.'):reject('Use the current followed by the two digits in your note.');
 case 'archiveGate':if(s.archiveGate)return reject('Analysis lab already open.');if(!['microscope','indicator','equation'].filter(id=>required(variant).includes(id)).every(id=>s.solved.includes(id)))return reject('Complete the assigned entry investigations first.');return accept({archiveGate:true},'Analysis laboratory unlocked.');
 case 'archive':if(s.archive)return reject('Archive already collected.');return s.archiveGate&&['graph','variables'].filter(id=>required(variant).includes(id)).every(id=>s.solved.includes(id))?accept({archive:true},'Archive digit recovered. Check your notebook.'):reject('Complete the assigned analysis investigations first.');
 case 'exit':if(!s.door||!s.archiveGate||!s.archive||!required(variant).every(id=>s.solved.includes(id)))return reject('Complete every investigation and recover the archive digit.');return String(value).trim()===String(variant.current)+variant.suffix+variant.archiveDigit?accept({escaped:true},'Laboratory escaped!'):reject('Combine current, note suffix and archive digit in that order.');
 default:return reject('Unknown action.');
 }
}
export function collides(x,z,boxes,radius=.28){
 return boxes.some(b=>Math.abs(x-b.x)<b.w/2+radius&&Math.abs(z-b.z)<b.d/2+radius);
}
export function move(pos,dx,dz,boxes){let {x,z}=pos;if(!collides(x+dx,z,boxes))x+=dx;if(!collides(x,z+dz,boxes))z+=dz;return{x,z};}
export const evidenceCount=s=>Number(s.note)+Number(s.power)+Number(s.door)+Number(s.archiveGate)+Number(s.archive)+s.solved.length;
