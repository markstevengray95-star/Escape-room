// Prefer natural English speech engines over legacy synthetic desktop voices.
const natural=/natural|neural|premium|enhanced|high quality|google (uk|us) english|siri/i;
export const englishVoices=(voices=[],allowOnline=false)=>voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang||'')&&(allowOnline||v.localService===true));
export function voiceScore(v){return (natural.test(v.name||'')?100:0)+(/^en[-_]GB$/i.test(v.lang||'')?30:0)+(v.localService?8:0)+(v.default?2:0)-(/espeak|festival|robot|compact/i.test(v.name||'')?30:0);}
export function selectVoice(voices,preferences={}){const available=englishVoices(voices,preferences.directorOnline===true);return available.find(v=>v.voiceURI===preferences.directorVoiceURI)||available.sort((a,b)=>voiceScore(b)-voiceScore(a)||a.name.localeCompare(b.name))[0]||null;}
const delivery={briefing:[.98,1.02],warning:[1.01,1],countdown:[1.04,1],repair:[1,1.025],progress:[1,1.025],ready:[.99,1.02],guidance:[.96,1.01],bonus:[1.02,1.02],pause:[.97,1],resume:[1,1.02],ending:[.97,1.01],preview:[1,1.02]};
export function speechDelivery(kind,pace=1){const [rate,pitch]=delivery[kind]||delivery.briefing;return {rate:Math.max(.78,Math.min(1.22,rate*(Number.isFinite(pace)?pace:1))),pitch};}
export function speechDuration(text,rate=1){return Math.max(5000,Math.min(35000,Math.ceil(text.trim().split(/\s+/).length/(2.4*rate)*1000)+2500));}

export const voiceStyles={natural:{rate:1,pitch:1,pause:1},calm:{rate:.94,pitch:1,pause:1.25},cinematic:{rate:.97,pitch:.99,pause:1.15}};
export function speechSegments(text,kind='briefing',pace=1,style='natural'){
 const profile=voiceStyles[style]||voiceStyles.natural,base=speechDelivery(kind,pace);
 // Preserve contractions, decimals and abbreviations; keep short countdowns as a single utterance.
 const cleaned=String(text).replace(/\s+/g,' ').trim();
 if(!cleaned)return [];
 const sentences=kind==='countdown'?[cleaned]:cleaned.match(/[^.!?]+(?:[.!?]+(?=\s+[A-Z“"'‘]|$)|$)|[^.!?]+[.!?]*/g)||[cleaned];
 // Sentence boundaries are only meaningful if nothing is lost (e.g. dotted abbreviations).
 const chunks=sentences.map(s=>s.trim()).filter(Boolean);
 const joined=chunks.join(' ').replace(/\s+/g,' ');
 const safe=joined===cleaned?chunks:[cleaned];
 return safe.map((part,i)=>({text:part,rate:Math.max(.78,Math.min(1.22,base.rate*profile.rate*(i===0?1:.99))),pitch:Math.max(.94,Math.min(1.06,base.pitch*profile.pitch+(part.endsWith('!')?.012:0))),pause:i===safe.length-1?0:Math.round((kind==='warning'?150:part.endsWith('?')?320:230)*profile.pause)}));
}
