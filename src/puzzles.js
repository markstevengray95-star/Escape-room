import {validateBench} from './experiment-model.js';
export const stations=[
{id:'microscope',name:'Microscope',x:-9.5,z:-6,color:0x628bb0,clue:'Plant cell identified'},
{id:'indicator',name:'Indicator bench',x:-9.5,z:5.5,color:0x8e77b6,clue:'Acid identified'},
{id:'moments',name:'Balance rig',x:-1.6,z:-5.5,color:0xcba46c,clue:'Lever balanced'},
{id:'density',name:'Density station',x:1.8,z:-5.5,color:0x69aab1,clue:'Density measured'},
{id:'equation',name:'Reaction terminal',x:-6.5,z:5.5,color:0xa17db2,clue:'Reaction balanced'},
{id:'graph',name:'Decay monitor',x:9.8,z:6,color:0x77ad8b,clue:'Half-life measured'},
{id:'osmosis',name:'Osmosis bench',x:-6.5,z:-6,color:0x75b69b,clue:'Osmosis evidence'},
{id:'separation',name:'Separation rig',x:-8,z:7.1,color:0xcab184,clue:'Separation evidence'},
{id:'energy',name:'Energy console',x:0,z:-8.2,color:0x6ba9ca,clue:'Energy evidence'},
{id:'variables',name:'Experiment planner',x:6.2,z:6,color:0xa798d5,clue:'Variables evidence'},
{id:'spectrum',name:'Spectrum analyser',x:9.8,z:-5.8,color:0x8bc4c7,clue:'Spectrum evidence'}];
export const TOTAL_EVIDENCE=stations.length+5;
export function validateStation(id,v,variant={}){
 if(!v||typeof v!=='object'||Array.isArray(v))return {ok:false,message:'Complete the equipment controls first.'};
 if(variant.exploration&&!validateBench(id,v,variant))return {ok:false,message:'Complete the physical equipment setup and measurements before confirming.'};
 const exact=(a,b)=>typeof a==='number'&&Number.isFinite(a)&&Math.abs(a-b)<1e-8;
 const tests={
 microscope:()=>v.objective===40&&typeof v.focus==='number'&&v.focus>=47&&v.focus<=53&&v.specimen==='plant',
 indicator:()=>v.indicator==='universal'&&v.tested===true&&v.classification==='acid',
 moments:()=>exact(v.distance,2)&&exact(v.force,6),
 density:()=>v.mass===true&&v.volume===true&&exact(v.density,2.5),
 equation:()=>Array.isArray(v.coefficients)&&v.coefficients.length===3&&v.coefficients.every((n,i)=>n===[2,1,2][i]),
 graph:()=>exact(v.first,0)&&exact(v.second,4)&&exact(v.halfLife,4),
 osmosis:()=>v.direction==='into'&&v.reason==='water',
 separation:()=>v.method==='filtration'&&v.next==='evaporation',
 energy:()=>exact(v.energy,600)&&exact(v.efficiency,75),
 variables:()=>v.independent==='temperature'&&v.dependent==='time'&&v.control==='volume',
 spectrum:()=>v.radiation==='infrared'&&v.reason==='heat',
 power:()=>Array.isArray(v.order)&&v.order.length===3&&v.order.every((n,i)=>n===['cell','switch','resistor'][i])&&v.closed===true&&String(v.current??'').trim()!==''&&Number(v.current)===variant.current};
 const hints={osmosis:'Think about water movement through a partially permeable membrane.',separation:'Remove the insoluble solid first, then recover dissolved salt.',energy:'Use energy = power × time; efficiency = useful ÷ total × 100.',variables:'Identify what is changed, measured and kept constant.',spectrum:'Which electromagnetic wave is detected by thermal imaging?',microscope:'Use the 40× objective, adjust focus and look for the cell wall.',indicator:'Run the universal indicator test and interpret the colour.',moments:'Compare moments using force × perpendicular distance.',density:'Measure mass and displacement, then calculate mass ÷ volume change.',equation:'Count atoms on each side and use the smallest whole-number coefficients.',graph:'Find the first reading with half the initial count rate.',power:'Complete the specified loop, close the switch and calculate I = V ÷ R.'};
 return tests[id]?.()?{ok:true,message:id==='power'?'Circuit restored.':'Investigation completed. Evidence saved.'}:{ok:false,message:hints[id]||'Unknown investigation.'};
}
