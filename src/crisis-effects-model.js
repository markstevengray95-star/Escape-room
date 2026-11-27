// Visual-only profiles. No changes to collision, countdown or puzzle rules.
export const effectsProfiles={
 lab:{particle:'steam',color:0xc5d9dd,warning:0xff795b,fog:0x59666c,speed:.28,size:.15},
 space:{particle:'sparks',color:0xffc777,warning:0xf07556,fog:0x39455b,speed:1.45,size:.075},
 bio:{particle:'mist',color:0x9bd0ae,warning:0xf4bb68,fog:0x59796b,speed:.17,size:.18},
 chem:{particle:'vapour',color:0xd5cba6,warning:0xf6a963,fog:0x756c5a,speed:.25,size:.17},
 blackout:{particle:'sparks',color:0xffc16b,warning:0xff8b43,fog:0x57524a,speed:1.65,size:.08},
 tomb:{particle:'dust',color:0xd5b28a,warning:0xe2aa65,fog:0x77654d,speed:.56,size:.105}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function effectState(id,crisis,preferences={}){
 const profile=effectsProfiles[id]||effectsProfiles.lab;
 const enabled=!!crisis?.enabled&&crisis.outcome==='active'&&preferences.crisisEffects!==false;
 const reduced=preferences.reducedMotion===true,quality=preferences.quality||'standard';
 const stage=clamp(Number(crisis?.stage)||0,0,4),integrity=clamp(Number(crisis?.integrity??100),0,100);
 // Successful investigations visibly reduce the environmental stress.
 const intensity=enabled?clamp(stage/4*.68+(100-integrity)/100*.32,0,1):0;
 const lightStress=enabled?(reduced?intensity*.45:intensity):0;
 const capacity=quality==='high'?144:quality==='low'?0:72;
 return {profile,intensity,lightStress,particles:enabled&&!reduced&&!crisis.paused?Math.round(capacity*intensity):0,paused:!!crisis?.paused};
}
