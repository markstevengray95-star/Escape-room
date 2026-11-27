import * as THREE from 'three';
import {initialState,transition,move,evidenceCount,DURATION} from './rules.js';
import './style.css';
import {network} from './network.js';
const $=id=>document.getElementById(id);
const canvas=$('world'),overlay=$('overlay'),panel=$('panel');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(e){panel.innerHTML='<h1 id="dialog-title">3D unavailable</h1><p>Your browser could not initialise WebGL. Enable hardware acceleration or try another device.</p>';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x111b21);scene.fog=new THREE.Fog(0x111b21,15,32);
const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.06,50);camera.rotation.order='YXZ';
const spawn={x:-5,z:1.8};camera.position.set(spawn.x,1.65,spawn.z);let yaw=-Math.PI/2,pitch=0;
const hemi=new THREE.HemisphereLight(0xc9e8ff,0x424951,2.0);scene.add(hemi);
const mats={wall:0x667c86,floor:0x35464b,trim:0x26353d,bench:0x9baab0,steel:0x4f626d,glass:0x79bdc9,green:0x43bca4,red:0xe27a51,yellow:0xf2d276};
const material=(c,emissive=0)=>new THREE.MeshStandardMaterial({color:c,roughness:.66,metalness:.12,emissive,emissiveIntensity:.65});
const boxes=[],solidMeshes=[],targets=new Map();
function cube(w,h,d,x,y,z,c,{solid=false,parent=scene,glow=0}={}){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(c,glow));m.position.set(x,y,z);parent.add(m);
 if(solid){boxes.push({x,z,w,d});solidMeshes.push(m);}return m;
}
function label(text,x,y,z,rotation=0,scale=1,parent=scene){
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#12282e';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#6aaea8';ctx.lineWidth=6;ctx.strokeRect(3,3,506,122);ctx.fillStyle='#e7f7ef';ctx.font='bold 42px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64,470);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const m=new THREE.Mesh(new THREE.PlaneGeometry(2.25*scale,.56*scale),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=rotation;parent.add(m);return m;
}
function interactable(id,name,parts){for(const m of parts){targets.set(m,{id,name});}return parts[0];}
function wall(w,d,x,z){cube(w,3.2,d,x,1.6,z,mats.wall,{solid:true});}
cube(14,.16,12,0,-.08,0,mats.floor);
for(let i=-6;i<=6;i++)for(let j=-5;j<=5;j++)cube(.97,.008,.97,i+.5,.005,j+.5,(i+j)%2?0x425459:0x394b50);
wall(14,.2,0,-6);wall(14,.2,0,6);wall(.2,12,-7,0);wall(.2,12,7,0);
wall(.22,4.65,2,-3.675);wall(.22,4.65,2,3.675);cube(.22,.9,2.7,2,2.75,0,mats.trim);
const door=cube(.2,2.35,2.6,2,1.175,0,0x41666d);const doorTag=label('SECURITY DOOR',1.88,1.7,0,-Math.PI/2,.8);
const doorBox={x:2,z:0,w:.22,d:2.7};boxes.push(doorBox);solidMeshes.push(door);interactable('door','Security door',[door,doorTag]);
for(let x of [-4,0,4.5]){cube(2.5,.12,.55,x,3.05,0,0xe1f7f5,{glow:0x7faeaa});const l=new THREE.PointLight(0xcdefff,18,9,2);l.position.set(x,2.8,0);scene.add(l);}
for(const z of [-5.87,5.87])cube(13.7,.16,.05,0,.3,z,mats.trim);
function bench(x,z,w,d){cube(w,.14,d,x,1.03,z,mats.bench,{solid:true});for(const dx of [-w/2+.14,w/2-.14])for(const dz of [-d/2+.14,d/2-.14])cube(.15,.95,.15,x+dx,.48,z+dz,mats.steel);}
bench(-4,-3.9,3.3,1.45);bench(-.4,4.4,3.1,1.35);bench(5.5,-3.8,1.6,1.45);
const cabinet=cube(1.5,.84,.78,-4,.42,-2.9,mats.steel,{solid:true});
const drawer=cube(1.38,.25,.14,-4,.67,-2.45,0x72858d);const handle=cube(.48,.07,.14,-4,.67,-2.32,0x1d303a);
interactable('drawer','Laboratory drawer',[drawer,handle]);
const note=cube(.46,.035,.31,-4,1.14,-3.28,mats.yellow);note.visible=false;interactable('note','Yellow laboratory note',[note]);
label('RESEARCH BENCH',-4,1.8,-4.55,0,.75);
const breaker=cube(.85,.9,.18,-.4,1.65,4.2,mats.red);const breakerTag=label('POWER PANEL',-.4,1.9,4.095,Math.PI,.38);
interactable('power','Electrical breaker',[breaker,breakerTag]);const voltageTag=label('CIRCUIT DATA',-.4,1.45,4.095,Math.PI,.32);
const exit=cube(.18,.95,1.15,6.7,1.55,0,mats.green);const exitTag=label('EXIT TERMINAL',6.59,1.75,0,-Math.PI/2,.48);interactable('exit','Exit terminal',[exit,exitTag]);
label('CONTROL ROOM',2.13,2.7,0,Math.PI/2,.9);
function equipment(x,z,c){const base=cube(.5,.13,.5,x,1.19,z,mats.steel);const v=new THREE.Mesh(new THREE.CylinderGeometry(.15,.22,.48,16),material(c));v.position.set(x,1.49,z);scene.add(v);return base;}
equipment(-5,-3.9,0x50b9b4);equipment(-4.5,-3.9,0xafa7d9);equipment(-3.2,-3.9,0xf0bc75);
cube(.65,.55,.08,5.5,1.45,-4.1,0x1a373d,{glow:0x245858});
for(let i=0;i<3;i++){cube(.4,.23,.35,-1.2+i*.65,1.22,4.6,0x4e727c);}
const net=network(),avatars=new Map();let multiplayer=false,teamRevision=-1,variant={voltage:12,resistance:4,current:3,suffix:'14'},serverRemaining=DURATION,serverPhase='lobby',polling=false,actionPending=false,lastPoll=0,teamStarted=false;
let state=initialState(),started=0,running=false,modal=true,keys=new Set(),current=null,toastUntil=0,previous=performance.now(),timedOut=false;
const ray=new THREE.Raycaster();ray.far=2.45;
function lookTarget(){ray.setFromCamera(new THREE.Vector2(0,0),camera);const list=[...new Set([...solidMeshes,...targets.keys()])].filter(o=>o.visible);const hits=ray.intersectObjects(list,false);return hits.length?targets.get(hits[0].object)||null:null;}
function notify(msg){$('toast').textContent=msg;toastUntil=performance.now()+6000;}
function sync(){
 drawer.position.z=state.drawer?-1.97:-2.45;handle.position.z=state.drawer?-1.84:-2.32;
 note.visible=state.drawer&&!state.note;
 breaker.material.color.setHex(state.power?mats.green:mats.red);
 $('count').textContent=evidenceCount(state)+'/3';
 $('objective').textContent=state.escaped?'ESCAPED':!state.note?'Find the laboratory note':!state.power?'Restore the electrical supply':!state.door?'Unlock the security door':'Reach the exit terminal';
}
function show(html){modal=true;keys.clear();if(document.pointerLockElement)document.exitPointerLock();overlay.hidden=false;panel.innerHTML=html;panel.querySelector('button,input')?.focus();}
function hide(){modal=false;overlay.hidden=true;panel.innerHTML='';canvas.focus();}
function button(id,fn){$(id)?.addEventListener('click',fn);}
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function home(){show('<div class="eyebrow">ESCAPE LAB · CLASSROOM EDITION</div><h1 id="dialog-title">Laboratory Lockdown</h1><p>Explore, discover evidence and solve science puzzles together.</p><div class="mode"><button class="primary" id="join-mode">Join a team</button><button id="host-mode">Host a class</button><button id="solo-mode">Solo practice</button>'+(net.session?'<button id="resume-mode">Reconnect to session</button>':'')+'</div>');button('join-mode',()=>roomForm(false));button('host-mode',()=>roomForm(true));button('solo-mode',()=>{net.clear();multiplayer=false;startScreen();});button('resume-mode',()=>{multiplayer=true;poll();});}
function roomForm(host){show('<div class="eyebrow">'+(host?'TEACHER':'STUDENT')+'</div><h1 id="dialog-title">'+(host?'Host a classroom':'Join a classroom')+'</h1><form id="room-form">'+(host?'<label for="team-size">Students per team</label><select id="team-size"><option>2</option><option>3</option><option selected>4</option><option>5</option></select>':'<label for="pin">Six-digit game PIN</label><input id="pin" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required><label for="nickname">Nickname</label><input id="nickname" maxlength="24" required>')+'<button class="primary">Continue</button></form><p id="feedback" role="status"></p><button id="back">Back</button>');button('back',home);$('room-form').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;form.querySelector('button').disabled=true;try{await net.call(host?'create':'join',host?{size:Number($('team-size').value)}:{pin:$('pin').value,name:$('nickname').value});multiplayer=true;poll();}catch(e){$('feedback').textContent=e.message;form.querySelector('button').disabled=false;}});}
function leave(){net.clear();location.reload();}
function hostView(v){show('<div class="eyebrow">TEACHER CONTROL · '+v.phase.toUpperCase()+'</div><h1 id="dialog-title">Game PIN: '+v.pin+'</h1><p>'+v.teams.reduce((n,t)=>n+t.members.length,0)+' students · '+v.teams.length+' teams · '+Math.ceil(v.remaining/60)+' min remaining</p><div class="teams">'+v.teams.map(t=>'<div class="clue"><strong>Team '+t.id+' · '+evidenceCount(t.state)+'/3 clues'+(t.state.escaped?' · ESCAPED':'')+'</strong><p>'+t.members.map(p=>escapeText(p.name)+(p.online?'':' (offline)')+' · '+p.contributions+' contributions').join('<br>')+'</p></div>').join('')+'</div><div class="mode">'+(v.phase==='lobby'?'<button class="primary" id="host-start" '+(!v.teams.length?'disabled':'')+'>Start game</button>':'')+(v.phase!=='ended'?'<button id="host-end">End session</button>':'')+'<button id="leave">Leave dashboard</button></div><p id="feedback"></p>');for(const a of ['start','end'])button('host-'+a,async()=>{try{await net.call('host',{action:a});}catch(e){notify(e.message);}});button('leave',leave);}
function lobby(v){show('<div class="eyebrow">ROOM '+v.pin+'</div><h1 id="dialog-title">Team '+v.team+'</h1><p>Waiting for your teacher to start.</p><div class="clue">Your teammates: '+(v.players.map(p=>escapeText(p.name)).join(', ')||'Waiting for more players')+'</div><button id="leave">Leave room</button>');button('leave',leave);}
function updateAvatars(players){const seen=new Set();for(const p of players){if(!p.online)continue;seen.add(p.id);let a=avatars.get(p.id);if(!a){const group=new THREE.Group();scene.add(group);cube(.45,.75,.3,0,.85,0,0x69b7c9,{parent:group});cube(.33,.33,.33,0,1.4,0,0xdcb997,{parent:group});cube(.28,.09,.33,0,1.6,0,0x243847,{parent:group});const tag=label(p.name,0,1.95,0,0,.65,group);a={group,tag,target:new THREE.Vector3(p.x,0,p.z)};group.position.copy(a.target);avatars.set(p.id,a);}a.target.set(p.x,0,p.z);a.group.rotation.y=p.yaw;}for(const [id,a] of avatars)if(!seen.has(id)){scene.remove(a.group);a.group.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.map?.dispose();o.material.dispose();}});avatars.delete(id);}}
function receive(v){serverRemaining=v.remaining;serverPhase=v.phase;if(net.session?.role==='host'){hostView(v);return;}if(v.teamRevision>=teamRevision){teamRevision=v.teamRevision;state=v.state;variant=v.variant;sync();}updateAvatars(v.players);if(v.phase==='lobby'){lobby(v);return;}if(v.phase==='ended'||state.escaped){if(!teamStarted||running){teamStarted=true;finish(state.escaped);}return;}if(!teamStarted){teamStarted=true;camera.position.set(v.position.x,1.65,v.position.z);yaw=v.position.yaw;running=true;hide();notify('Team '+v.team+' · Work together to escape.');}}
async function poll(){if(!multiplayer||polling||actionPending||!net.session)return;polling=true;try{const student=net.session.role==='student';const v=await net.call(student&&teamStarted&&running?'position':'view',student?{position:{x:camera.position.x,z:camera.position.z,yaw}}:{});receive(v);}catch(e){notify('Connection: '+e.message);if(!teamStarted&&net.session?.role==='student'){show('<h1 id="dialog-title">Connection unavailable</h1><p>'+escapeText(e.message)+'</p><button id="leave">Return to menu</button>');button('leave',leave);}}finally{polling=false;}}
function startScreen(){show('<div class="eyebrow">MISSION 01 · SINGLE-PLAYER PROTOTYPE</div><h1 id="dialog-title">Laboratory Lockdown</h1><p>The laboratory security system has locked down. Search the room, recover evidence, restore the electrical supply and unlock the control room before time runs out.</p><div class="brief"><strong>15 minutes</strong><span>Explore freely. Look at an object and press E or Interact. Drag on touchscreens to look around.</span></div><button class="primary" id="start">Enter laboratory</button>');button('start',()=>{started=performance.now();running=true;hide();notify('Search the research bench and its drawer.');});}
async function apply(id,value){if(!multiplayer){const result=transition(state,id,value);state=result.state;sync();notify(result.message);return result;}if(actionPending)return {ok:false,message:'Action pending.'};actionPending=true;try{while(polling)await new Promise(r=>setTimeout(r,25));await net.call('position',{position:{x:camera.position.x,z:camera.position.z,yaw}});const result=await net.call('action',{id,value});receive(result);notify(result.message);return result;}catch(e){notify(e.message);return {ok:false,message:e.message};}finally{actionPending=false;}}
function puzzle(id,title,body,labelText){show('<div class="eyebrow">SECURITY SYSTEM</div><h1 id="dialog-title">'+title+'</h1><p>'+body+'</p><form id="answer-form"><label for="answer">'+labelText+'</label><input id="answer" inputmode="numeric" required autocomplete="off"><button class="primary">Submit</button></form><p id="feedback" role="status"></p><button id="close">Back to laboratory</button>');button('close',hide);$('answer-form').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;const submit=form.querySelector('button');submit.disabled=true;const r=await apply(id,$('answer').value);if(!form.isConnected)return;if(r.ok)hide();else {$('feedback').textContent=r.message;submit.disabled=false;}});}
async function interact(){if(modal||!running)return;const t=lookTarget();if(!t){notify('Move closer and look directly at an object.');return;}
 if(t.id==='power'&&!state.power){puzzle('power','Restore the circuit','The circuit has a '+variant.voltage+' V supply and a resistance of '+variant.resistance+' Ω. Calculate the current in amperes.','Current (A)');return;}
 if(t.id==='door'&&!state.door){if(!state.note||!state.power){notify('Find the laboratory note and restore power first.');return;}puzzle('door','Security keypad','Combine the circuit current and the two-digit suffix recorded in your evidence notebook.','Three-digit code');return;}
 const r=await apply(t.id);if(state.escaped&&r.ok&&running)finish(true);}
function notebook(){if(!running||timedOut||state.escaped)return;show('<div class="eyebrow">TEAM EVIDENCE</div><h1 id="dialog-title">Evidence notebook</h1><div class="clue">'+(state.note?'Laboratory note: the keypad code begins with the circuit current. The final two digits are '+variant.suffix+'.':'No laboratory note collected yet.')+'</div><div class="clue">'+(state.power?'Circuit restored: '+variant.voltage+' V ÷ '+variant.resistance+' Ω = '+variant.current+' A.':'Power supply offline.')+'</div><div class="clue">'+(state.door?'Security door unlocked.':'Security door locked.')+'</div><button id="close" class="primary">Return to game</button>');button('close',hide);}
function finish(win){running=false;timedOut=!win;show('<div class="eyebrow">MISSION '+(win?'COMPLETE':'ENDED')+'</div><h1 id="dialog-title">'+(win?'You escaped!':'Time ran out')+'</h1><p>'+ (win?'You recovered the note, solved the electrical puzzle and unlocked the security door.':'Try again and use your evidence notebook to plan the route.')+'</p><button id="restart" class="primary">Play again</button>');button('restart',()=>{net.clear();location.reload();});}
canvas.tabIndex=0;canvas.addEventListener('click',()=>{if(!modal&&matchMedia('(pointer:fine)').matches&&document.pointerLockElement!==canvas)canvas.requestPointerLock?.();});
document.addEventListener('mousemove',e=>{if(!modal&&document.pointerLockElement===canvas){yaw-=e.movementX*.0024;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0024,-1.35,1.35);}});
document.addEventListener('keydown',e=>{if(modal||!running)return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e','n'].includes(k)){e.preventDefault();keys.add(k);}if(!e.repeat&&k==='e')interact();if(!e.repeat&&k==='n')notebook();});
document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
let drag=null;canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!modal){drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);}});canvas.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId&&!modal){yaw-=(e.clientX-drag.x)*.007;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-drag.y)*.007,-1.35,1.35);drag.x=e.clientX;drag.y=e.clientY;}});for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>drag=null);
for(const b of document.querySelectorAll('[data-key]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!modal)keys.add(b.dataset.key);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys.delete(b.dataset.key));}
$('touch-use').addEventListener('click',interact);$('notebook').addEventListener('click',notebook);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
function drawMap(){const m=$('map'),c=m.getContext('2d'),sx=11,sz=11;const px=x=>90+x*sx,pz=z=>72.5+z*sz;c.clearRect(0,0,180,145);c.fillStyle='#12252e';c.fillRect(0,0,180,145);c.fillStyle='#76939c';for(const b of boxes)c.fillRect(px(b.x-b.w/2),pz(b.z-b.d/2),b.w*sx,b.d*sz);c.fillStyle='#e7b76b';if(!state.door)c.fillRect(px(1.9),pz(-1.35),3,30);c.fillStyle='#63ebcf';c.beginPath();c.arc(px(camera.position.x),pz(camera.position.z),4,0,Math.PI*2);c.fill();c.strokeStyle='#63ebcf';c.beginPath();c.moveTo(px(camera.position.x),pz(camera.position.z));c.lineTo(px(camera.position.x-Math.sin(yaw)*.8),pz(camera.position.z-Math.cos(yaw)*.8));c.stroke();}
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-previous)/1000,.045);previous=now;
 if(running){const remain=multiplayer?serverRemaining:Math.max(0,DURATION-Math.floor((now-started)/1000));$('timer').textContent=String(Math.floor(remain/60)).padStart(2,'0')+':'+String(remain%60).padStart(2,'0');if(remain===0)finish(false);}
 if(!modal&&running){const f=Number(keys.has('w')||keys.has('arrowup'))-Number(keys.has('s')||keys.has('arrowdown')),s=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));const norm=Math.max(1,Math.hypot(f,s));const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*3.3*dt/norm,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*3.3*dt/norm;const pos=move(camera.position,dx,dz,boxes);camera.position.x=pos.x;camera.position.z=pos.z;}
 if(state.door){door.position.y=Math.min(3.75,door.position.y+dt*2.5);doorTag.position.y=door.position.y+.525;if(door.position.y>3&&boxes.includes(doorBox))boxes.splice(boxes.indexOf(doorBox),1);}
 if(multiplayer&&now-lastPoll>350){lastPoll=now;poll();}for(const a of avatars.values()){a.group.position.lerp(a.target,Math.min(1,dt*12));a.tag.quaternion.copy(a.group.quaternion).invert().multiply(camera.quaternion);}camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld();current=modal?null:lookTarget();$('prompt').textContent=current?'[E] '+current.name:'';if(now>toastUntil)$('toast').textContent='';drawMap();renderer.render(scene,camera);}
sync();home();requestAnimationFrame(frame);
