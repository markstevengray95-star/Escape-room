import {stations,validateStation} from './puzzles.js';
export const DURATION=900;
export const initialState=()=>({drawer:false,note:false,power:false,door:false,escaped:false,solved:[]});
export function transition(s,action,value,variant={current:3,suffix:'14'}){
 const reject=message=>({state:s,ok:false,message});
 const accept=(patch,message)=>({state:{...s,...patch},ok:true,message});
 if(s.escaped) return reject('Already escaped.');
 if(stations.some(p=>p.id===action)){if(s.solved.includes(action))return reject('Investigation already completed.');const r=validateStation(action,value,variant);return r.ok?accept({solved:[...s.solved,action]},r.message):reject(r.message);}
 switch(action){
 case 'drawer':return accept({drawer:!s.drawer},s.drawer?'Drawer closed.':'Drawer opened. Inspect the yellow note.');
 case 'note':return s.note?reject('Note already collected.'):s.drawer?accept({note:true},'Evidence collected.'):reject('Open the drawer first.');
 case 'power':if(s.power)return reject('Power is already online.');{const r=validateStation('power',value,variant);return r.ok?accept({power:true},r.message):reject(r.message);}
 case 'door':if(s.door)return reject('Door already unlocked.');if(!s.note||!s.power)return reject('Find the note and restore power first.');return String(value).trim()===String(variant.current)+variant.suffix?accept({door:true},'Security door unlocked.'):reject('Use the current followed by the two digits in your note.');
 case 'exit':return !s.door?reject('Unlock the security door first.'):s.solved.length!==stations.length?reject('Complete all six science investigations before escaping.'):accept({escaped:true},'Laboratory escaped!');
 default:return reject('Unknown action.');
 }
}
export function collides(x,z,boxes,radius=.28){
 return boxes.some(b=>Math.abs(x-b.x)<b.w/2+radius&&Math.abs(z-b.z)<b.d/2+radius);
}
export function move(pos,dx,dz,boxes){let {x,z}=pos;if(!collides(x+dx,z,boxes))x+=dx;if(!collides(x,z+dz,boxes))z+=dz;return{x,z};}
export const evidenceCount=s=>Number(s.note)+Number(s.power)+Number(s.door)+s.solved.length;
