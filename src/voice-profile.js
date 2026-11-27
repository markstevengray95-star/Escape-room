// Prefer natural English speech engines over legacy synthetic desktop voices.
const natural=/natural|neural|premium|enhanced|high quality|google (uk|us) english|siri/i;
export const englishVoices=(voices=[],allowOnline=false)=>voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang||'')&&(allowOnline||v.localService===true));
export function voiceScore(v){return (natural.test(v.name||'')?100:0)+(/^en[-_]GB$/i.test(v.lang||'')?30:0)+(v.localService?8:0)+(v.default?2:0)-(/espeak|festival|robot|compact/i.test(v.name||'')?30:0);}
export function selectVoice(voices,preferences={}){const available=englishVoices(voices,preferences.directorOnline===true);return available.find(v=>v.voiceURI===preferences.directorVoiceURI)||available.sort((a,b)=>voiceScore(b)-voiceScore(a)||a.name.localeCompare(b.name))[0]||null;}
const delivery={briefing:[.98,1.02],warning:[1.01,1],countdown:[1.04,1],repair:[1,1.025],progress:[1,1.025],ready:[.99,1.02],guidance:[.96,1.01],bonus:[1.02,1.02],pause:[.97,1],resume:[1,1.02],ending:[.97,1.01],preview:[1,1.02]};
export function speechDelivery(kind,pace=1){const [rate,pitch]=delivery[kind]||delivery.briefing;return {rate:Math.max(.78,Math.min(1.22,rate*(Number.isFinite(pace)?pace:1))),pitch};}
export function speechDuration(text,rate=1){return Math.max(5000,Math.min(35000,Math.ceil(text.trim().split(/\s+/).length/(2.4*rate)*1000)+2500));}
