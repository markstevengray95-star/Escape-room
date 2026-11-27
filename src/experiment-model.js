// Shared deterministic scientific simulation helpers, independent of the browser.
export const benchIds=['power','microscope','moments','density','indicator','separation','graph','energy'];
export const circuitEdges=['cell+|switch-in','switch-out|resistor-in','resistor-out|cell-'];
export function edge(a,b){return [a,b].sort().join('|');}
const canonical=circuitEdges.map(x=>edge(...x.split('|'))).sort();
export function circuitReady(wires){return Array.isArray(wires)&&wires.length===3&&wires.every(x=>typeof x==='string')&&[...wires].sort().every((x,i)=>x===canonical[i]);}
export function circuitReading(wires,closed,voltage,resistance){return circuitReady(wires)&&closed&&resistance>0?voltage/resistance:0;}
export function beamAngle(force,distance){return Math.max(-18,Math.min(18,(force*distance-12)*1.6));}
export function displacement(initial,final){return final-initial;}
export function reagentReading(reagent){return reagent==='universal'?{color:'#d74d47',text:'Red · pH 2'}:reagent==='water'?{color:'#b5c8c8',text:'No useful colour change'}:{color:'#d5d4ba',text:'No useful pH measurement'};}
export function validateBench(id,v,variant){
 if(!benchIds.includes(id))return true;
 if(id==='power')return circuitReady(v.wires)&&v.closed===true;
 if(id==='microscope')return v.inserted===true&&v.lamp===true;
 if(id==='indicator')return v.tested===true;
 if(id==='moments')return v.loaded===true;
 if(id==='density')return v.mass===true&&v.volume===true&&v.zeroed===true;
 if(id==='separation')return v.filtered===true&&v.evaporated===true;
 if(id==='graph')return v.scanned===true;
 if(id==='energy')return v.ran===true;
 return true;
}
