// Difficulty affects narrative pressure and guidance, not curriculum tier or marking.
export const difficultyPresets={
 calm:{label:'Calm practice',minutes:45,crisis:false,repairs:false,bonuses:false,intensity:'low',guidance:'frequent'},
 guided:{label:'Guided mission',minutes:45,crisis:true,repairs:false,bonuses:false,intensity:'low',guidance:'frequent'},
 standard:{label:'Standard mission',minutes:30,crisis:true,repairs:true,bonuses:true,intensity:'normal',guidance:'standard'},
 challenge:{label:'Challenge mission',minutes:30,crisis:true,repairs:true,bonuses:true,intensity:'high',guidance:'off'}
};
export const intensityProfiles={low:{scale:.45,decay:55,thresholds:[.50,.23,.10]},normal:{scale:1,decay:82,thresholds:[2/3,1/3,1/6]},high:{scale:1,decay:95,thresholds:[.80,.50,.25]}};
export const guidanceIntervals={frequent:45000,standard:90000,off:Infinity};
const valid=(o,k)=>typeof k==='string'&&Object.hasOwn(o,k);
export function normalizeDifficulty(options={}){
 const preset=valid(difficultyPresets,options.difficulty)?options.difficulty:'standard',base=difficultyPresets[preset];
 // Legacy API calls retain their prior independent opt-in rules.
 const selected=valid(difficultyPresets,options.difficulty),crisis=typeof options.crisis==='boolean'?options.crisis:selected?base.crisis:true;
 return {preset,crisis,repairs:crisis&&(typeof options.repairs==='boolean'?options.repairs:selected?base.repairs:false),bonuses:crisis&&(typeof options.bonuses==='boolean'?options.bonuses:selected?base.bonuses:false),intensity:valid(intensityProfiles,options.intensity)?options.intensity:base.intensity,guidance:valid(guidanceIntervals,options.guidance)?options.guidance:base.guidance};
}
export function adjustDifficulty(current,patch={}){return {...current,intensity:valid(intensityProfiles,patch.intensity)?patch.intensity:current.intensity,guidance:valid(guidanceIntervals,patch.guidance)?patch.guidance:current.guidance};}
export function difficultyStage(fraction,remaining,intensity='normal'){const [warning,critical,emergency]=(intensityProfiles[intensity]||intensityProfiles.normal).thresholds;return remaining<=60?4:fraction<=emergency?3:fraction<=critical?2:fraction<=warning?1:0;}
