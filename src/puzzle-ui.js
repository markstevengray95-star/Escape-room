import {stations} from './puzzles.js';
const select=(id,label,options)=>'<label for="'+id+'">'+label+'</label><select id="'+id+'">'+options.map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('')+'</select>';
const num=(id,label,value='')=>'<label for="'+id+'">'+label+'</label><input id="'+id+'" type="number" step="any" required value="'+value+'">';
const button=(id,text)=>'<button type="button" id="'+id+'">'+text+'</button>';
export function openInvestigation(id,variant,{show,hide,apply,panel}){
 const get=id=>panel.querySelector('#'+id),val=id=>get(id).value,n=id=>Number(val(id));
 let tested=false,mass=false,volume=false,body='',read=()=>({});
 const parts=[['','Select component'],['cell','Cell'],['switch','Switch'],['resistor','Resistor']];
 const graphData=[[0,80],[2,57],[4,40],[6,28],[8,20],[10,14],[12,10]];
 if(id==='power'){
 body='<p>Rebuild this series circuit in the specified order: supply, control switch, load. Close the switch and calculate current.</p><div class="instrument"><div class="loop">Supply → control → load</div><div class="slots">'+[0,1,2].map(i=>'<div data-slot="'+i+'">'+select('slot'+i,'Position '+(i+1),parts)+'</div>').join('')+'</div><div class="parts">'+parts.slice(1).map(([v,l])=>'<span draggable="true" data-part="'+v+'">'+l+'</span>').join('')+'</div><label><input id="closed" type="checkbox"> Close switch</label><p id="reading"></p></div><p>Supply: '+variant.voltage+' V · Resistance: '+variant.resistance+' Ω</p>'+num('current','Current (A)');
 read=()=>({order:[0,1,2].map(i=>val('slot'+i)),closed:get('closed').checked,current:val('current')});
 }else if(id==='microscope'){
 body='<p>Use a 40× objective, focus the specimen and identify the cell type from the visible structures.</p><div class="instrument"><svg viewBox="0 0 240 145" aria-label="Simulated cell specimen"><rect width="240" height="145" fill="#152e30"/><g id="specimen" stroke="#9fe6ad" stroke-width="3" fill="#456f50">'+[0,1,2,3,4,5].map(i=>'<g transform="translate('+(i%3*80+3)+' '+(Math.floor(i/3)*70+3)+')"><rect width="72" height="65" rx="4"/><circle cx="47" cy="23" r="8" fill="#b1a7db"/><ellipse cx="23" cy="39" rx="6" ry="10" fill="#a9d66c"/><ellipse cx="56" cy="53" rx="5" ry="8" fill="#a9d66c"/></g>').join('')+'</g></svg>'+select('objective','Objective lens',[[4,'4×'],[10,'10×'],[40,'40×']])+'<label for="focus">Fine focus</label><input id="focus" type="range" min="0" max="100" value="10"><p id="reading"></p></div>'+select('specimen-type','Specimen',[['','Select'],['plant','Plant cell'],['animal','Animal cell'],['bacterium','Bacterial cell']]);
 read=()=>({objective:n('objective'),focus:n('focus'),specimen:val('specimen-type')});
 }else if(id==='indicator'){
 body='<p>Test the unknown solution with a suitable indicator, then classify it.</p><div class="instrument"><div id="beaker" class="beaker"></div>'+select('indicator-type','Reagent',[['','Choose'],['universal','Universal indicator'],['water','Distilled water'],['starch','Starch solution']])+button('run-test','Add reagent')+'<p id="reading">Clear solution.</p></div>'+select('classification','Classification',[['','Select'],['acid','Acidic'],['neutral','Neutral'],['alkali','Alkaline']]);
 read=()=>({indicator:val('indicator-type'),tested,classification:val('classification')});
 }else if(id==='moments'){
 body='<p>A 4 N load acts 3 m left of the pivot. Use the available weights and attachment points to balance the lever.</p><div class="instrument"><svg viewBox="0 0 280 135" aria-label="Lever simulation"><g id="lever"><path d="M20 70H260" stroke="#d9e9ed" stroke-width="8"/><rect x="25" y="45" width="22" height="25" fill="#d4a766"/><text x="36" y="38" text-anchor="middle" fill="white">4 N</text><rect id="weight" x="177" y="45" width="22" height="25" fill="#8ddbc4"/></g><path d="M140 73l-18 33h36z" fill="#78939d"/><text x="140" y="127" text-anchor="middle" fill="white">Pivot</text></svg>'+select('distance','Right-hand distance',[[1,'1 m'],[2,'2 m']])+select('force','Available force',[[2,'2 N'],[4,'4 N'],[6,'6 N']])+'<p id="reading"></p></div>';
 read=()=>({distance:n('distance'),force:n('force')});
 }else if(id==='density'){
 body='<p>Measure the mass and water displacement of the sample, then calculate its density.</p><div class="instrument"><div class="station-pair"><div><div class="instrument-screen" id="mass-reading">— g</div>'+button('mass','Weigh sample')+'</div><div><div class="instrument-screen" id="volume-reading">20 cm³</div>'+button('volume','Immerse sample')+'</div></div></div>'+num('density','Density (g/cm³)');
 read=()=>({mass,volume,density:n('density')});
 }else if(id==='equation'){
 body='<p>Balance the reaction that produces water. Adjust the coefficients to conserve atoms.</p><div class="instrument"><div class="reaction">'+num('a','H₂',1)+'<span>+</span>'+num('b','O₂',1)+'<span>→</span>'+num('c','H₂O',1)+'</div><p id="reading"></p></div>';
 read=()=>({coefficients:['a','b','c'].map(n)});
 }else if(id==='graph'){
 const options=graphData.map(([t,c])=>[t,t+' s · '+c+' counts/s']);
 body='<p>Choose the initial reading and the first reading at half the initial background-corrected count rate. Calculate half-life.</p><div class="instrument"><svg viewBox="0 0 320 200" aria-label="Decay graph"><path d="M35 15V165H305" stroke="#c2d4da" fill="none"/>'+[0,20,40,60,80].map(c=>'<g><path d="M35 '+(165-c*1.65)+'H305" stroke="#49646c"/><text x="30" y="'+(169-c*1.65)+'" text-anchor="end" fill="white" font-size="10">'+c+'</text></g>').join('')+'<polyline points="'+graphData.map(([t,c])=>(35+t*21)+','+(165-c*1.65)).join(' ')+'" stroke="#8ddbc4" stroke-width="2" fill="none"/>'+graphData.map(([t,c])=>'<circle cx="'+(35+t*21)+'" cy="'+(165-c*1.65)+'" r="4" fill="#e7be79"/><text x="'+(35+t*21)+'" y="180" fill="white" font-size="10" text-anchor="middle">'+t+'</text>').join('')+'<text x="170" y="195" text-anchor="middle" fill="white" font-size="10">Time (s)</text><text x="45" y="12" fill="white" font-size="10">Count rate (counts/s)</text></svg>'+select('first','Initial reading',options)+select('second','Half-count reading',options)+'</div>'+num('half-life','Half-life (s)');
 read=()=>({first:n('first'),second:n('second'),halfLife:n('half-life')});
 }
 if(!body)return;
 show('<div class="eyebrow">INTERACTIVE SCIENCE STATION</div><h1 id="dialog-title">'+(id==='power'?'Repair the circuit':stations.find(s=>s.id===id).name)+'</h1><form id="science-form">'+body+'<button class="primary" type="submit">Submit investigation</button></form><p id="feedback" role="status"></p>'+button('close','Return to laboratory'));
 get('close').onclick=hide;
 function update(){
 if(id==='power'){const v=read();get('reading').textContent=v.closed&&v.order.every(Boolean)?'Loop connected — calculate current.':'Circuit open or incomplete.';}
 if(id==='microscope'){const v=read();get('specimen').style.filter='blur('+Math.min(12,Math.abs(v.focus-50)/5+(v.objective===40?0:5))+'px)';get('reading').textContent=v.objective*10+'× total magnification (10× eyepiece).';}
 if(id==='moments'){const v=read(),m=v.force*v.distance;get('lever').setAttribute('transform','rotate('+Math.max(-18,Math.min(18,(m-12)*1.6))+' 140 70)');get('weight').setAttribute('x',String(140+v.distance*35-11));get('reading').textContent='Right-hand moment: '+m+' Nm.';}
 if(id==='equation'){const [a,b,c]=read().coefficients;get('reading').textContent='Left: H '+2*a+', O '+2*b+' · Right: H '+2*c+', O '+c;}
 }
 get('science-form').addEventListener('input',update);
 if(id==='power'){for(const part of panel.querySelectorAll('[data-part]'))part.ondragstart=e=>e.dataTransfer.setData('text/plain',part.dataset.part);for(const slot of panel.querySelectorAll('[data-slot]')){slot.ondragover=e=>e.preventDefault();slot.ondrop=e=>{e.preventDefault();const v=e.dataTransfer.getData('text/plain');if(parts.some(([p])=>p===v)){get('slot'+slot.dataset.slot).value=v;update();}};}}
 if(id==='indicator'){get('indicator-type').onchange=()=>{tested=false;get('beaker').style.background='';get('reading').textContent='Add reagent to test.';};get('run-test').onclick=()=>{tested=val('indicator-type')==='universal';get('beaker').style.background=tested?'#d84c43':'';get('reading').textContent=tested?'Universal indicator turns red (pH 2).':'No useful pH reading.';};}
 if(id==='density'){get('mass').onclick=()=>{mass=true;get('mass-reading').textContent='50 g';};get('volume').onclick=()=>{volume=true;get('volume-reading').textContent='40 cm³';};}
 update();
 get('science-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,b=form.querySelector('[type=submit]');b.disabled=true;const r=await apply(id,read());if(!form.isConnected)return;if(r.ok)hide();else{get('feedback').textContent=r.message;b.disabled=false;}};
}
