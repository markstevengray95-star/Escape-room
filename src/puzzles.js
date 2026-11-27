export const stations=[
{id:'microscope',name:'Microscope',x:-5.65,z:-.5,color:0x628bb0,clue:'Plant cell identified'},
{id:'indicator',name:'Indicator bench',x:-5.65,z:4.2,color:0x8e77b6,clue:'Acid identified'},
{id:'moments',name:'Balance rig',x:.7,z:-4.7,color:0xcba46c,clue:'Lever balanced'},
{id:'density',name:'Density station',x:4.2,z:4.7,color:0x69aab1,clue:'Density measured'},
{id:'equation',name:'Reaction terminal',x:5.8,z:3,color:0xa17db2,clue:'Reaction balanced'},
{id:'graph',name:'Decay monitor',x:5.8,z:-1.8,color:0x77ad8b,clue:'Half-life measured'}];
export const TOTAL_EVIDENCE=stations.length+3;
export function validateStation(id,v,variant={}){
 if(!v||typeof v!=='object'||Array.isArray(v))return {ok:false,message:'Complete the equipment controls first.'};
 const exact=(a,b)=>typeof a==='number'&&Number.isFinite(a)&&Math.abs(a-b)<1e-8;
 const tests={
 microscope:()=>v.objective===40&&typeof v.focus==='number'&&v.focus>=47&&v.focus<=53&&v.specimen==='plant',
 indicator:()=>v.indicator==='universal'&&v.tested===true&&v.classification==='acid',
 moments:()=>exact(v.distance,2)&&exact(v.force,6),
 density:()=>v.mass===true&&v.volume===true&&exact(v.density,2.5),
 equation:()=>Array.isArray(v.coefficients)&&v.coefficients.length===3&&v.coefficients.every((n,i)=>n===[2,1,2][i]),
 graph:()=>exact(v.first,0)&&exact(v.second,4)&&exact(v.halfLife,4),
 power:()=>Array.isArray(v.order)&&v.order.length===3&&v.order.every((n,i)=>n===['cell','switch','resistor'][i])&&v.closed===true&&String(v.current??'').trim()!==''&&Number(v.current)===variant.current};
 const hints={microscope:'Use the 40× objective, adjust focus and look for the cell wall.',indicator:'Run the universal indicator test and interpret the colour.',moments:'Compare moments using force × perpendicular distance.',density:'Measure mass and displacement, then calculate mass ÷ volume change.',equation:'Count atoms on each side and use the smallest whole-number coefficients.',graph:'Find the first reading with half the initial count rate.',power:'Complete the specified loop, close the switch and calculate I = V ÷ R.'};
 return tests[id]?.()?{ok:true,message:id==='power'?'Circuit restored.':'Investigation completed. Evidence saved.'}:{ok:false,message:hints[id]||'Unknown investigation.'};
}
