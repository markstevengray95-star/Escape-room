import * as THREE from 'three';
import {loadBlenderAsset,disposeAsset} from './blender-assets.js';
const colors=[0x377e91,0x806baa,0x4f987c,0xb28048,0x657caa,0xa25d67];
export function teammateColor(id){let hash=0;for(const c of String(id))hash=(Math.imul(hash,31)+c.charCodeAt(0))>>>0;return colors[hash%colors.length];}
const material=(color,metalness=.05)=>new THREE.MeshStandardMaterial({color,roughness:.68,metalness});
function mesh(parent,geometry,color,x,y,z){const o=new THREE.Mesh(geometry,material(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
const box=(p,w,h,d,x,y,z,c)=>mesh(p,new THREE.BoxGeometry(w,h,d),c,x,y,z);
const capsule=(p,r,l,x,y,z,c)=>mesh(p,new THREE.CapsuleGeometry(r,l,4,10),c,x,y,z);
const sphere=(p,r,x,y,z,c)=>mesh(p,new THREE.SphereGeometry(r,14,10),c,x,y,z);
function joint(parent,x,y,z){const p=new THREE.Group();p.position.set(x,y,z);parent.add(p);return p;}
const suitFor=(scenario,id)=>scenario==='tomb'?0xa18a6b:scenario==='blackout'?0xb49b58:scenario==='space'?0x8eabb7:teammateColor(id);
function replace(parent,name,size,offset,valid,fallback){
 loadBlenderAsset(name,...size,'characters').then(root=>{if(!root)return;if(!valid()){disposeAsset(root);return;}for(const child of fallback)child.visible=false;root.position.add(new THREE.Vector3(...offset));parent.add(root);}).catch(()=>{});
}
export function createCharacter(id,scenario,valid){
 const group=new THREE.Group(),body=joint(group,0,0,0),suit=suitFor(scenario,id),dark=0x26343d,accent=teammateColor(id);
 const torso=joint(body,0,.91,0);
 const torsoParts=[capsule(torso,.20,.31,0,.26,0,suit),box(torso,.40,.11,.28,0,.05,0,dark),box(torso,.17,.10,.035,0,.32,.204,accent),box(torso,.16,.14,.04,.12,.22,-.205,dark)];
 const head=joint(body,0,1.45,0);
 const headParts=[sphere(head,.16,0,.12,0,0xb5c2c5),sphere(head,.166,0,.15,0,0x71858a),box(head,.26,.105,.07,0,.12,.151,0x1b303c),box(head,.24,.025,.025,0,.16,.191,0x789da7)];
 const arms=[],legs=[];
 for(const side of [-1,1]){
  const shoulder=joint(body,side*.27,1.33,0),elbow=joint(shoulder,0,-.27,0);
  const upper=[capsule(shoulder,.079,.16,0,-.115,0,suit),box(shoulder,.15,.035,.15,0,-.235,0,accent)];
  const lower=[capsule(elbow,.068,.15,0,-.11,0,dark),sphere(elbow,.066,0,-.245,.025,0x96aeb3)];
  arms.push({shoulder,elbow});
  const hip=joint(body,side*.105,.86,0),knee=joint(hip,0,-.36,0);
  const thigh=[capsule(hip,.085,.20,0,-.15,0,dark)];
  const shin=[capsule(knee,.075,.18,0,-.15,0,dark),box(knee,.16,.12,.28,0,-.435,.055,0x313c40)];
  legs.push({hip,knee});
  // Separate model segments preserve elbow and knee pivots for animation.
  replace(shoulder,'upper-arm',[.18,.29,.19],[0,-.29,0],valid,upper);
  replace(elbow,'forearm',[.17,.30,.19],[0,-.30,0],valid,lower);
  replace(hip,'thigh',[.19,.36,.22],[0,-.36,0],valid,thigh);
  replace(knee,'boot-leg',[.18,.50,.30],[0,-.50,.03],valid,shin);
 }
 replace(torso,'torso',[.46,.57,.34],[0,0,0],valid,torsoParts);
 replace(head,'helmet',[.34,.36,.36],[0,-.015,0],valid,headParts);
 // Retain the team identification even after imported suit geometry arrives.
 box(torso,.09,.085,.04,-.14,.35,.188,accent);
 return {group,body,arms,legs,head,phase:0,walkBlend:0,target:new THREE.Vector3(),targetYaw:0};
}
export function animateCharacter(a,dt,motion){
 const speed=Math.min(3.5,a.group.position.distanceTo(a.target)*12);
 const mix=1-Math.exp(-dt*12);a.walkBlend=THREE.MathUtils.lerp(a.walkBlend,motion?Math.min(1,speed/2):0,mix);
 a.phase+=dt*speed*3.4;const stride=Math.sin(a.phase)*a.walkBlend;
 for(let i=0;i<2;i++){const dir=i===0?1:-1,s=stride*dir;
  a.arms[i].shoulder.rotation.x=-s*.42;a.arms[i].elbow.rotation.x=-.16-Math.max(0,-s)*.32;
  a.legs[i].hip.rotation.x=s*.54;a.legs[i].knee.rotation.x=Math.max(0,-s)*.66;
 }
 a.body.position.y=motion?Math.abs(Math.sin(a.phase))*a.walkBlend*.032:0;
 const delta=Math.atan2(Math.sin(a.targetYaw-a.group.rotation.y),Math.cos(a.targetYaw-a.group.rotation.y));a.group.rotation.y+=delta*mix;
 a.group.position.lerp(a.target,mix);
}
export function createHands(){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(58,1,.035,8);
 scene.add(new THREE.HemisphereLight(0xe8f5ff,0x54616c,2.4));const light=new THREE.DirectionalLight(0xffffff,1.4);light.position.set(1,2,1);scene.add(light);
 const root=new THREE.Group();scene.add(root);const hands=[];
 for(const side of [-1,1]){
  const hand=joint(root,side*.37,-.39,-.78);hand.rotation.set(-.32,side*.12,side*.12);
  const glove=0x536f7c;const parts=[capsule(hand,.086,.24,0,-.13,0,0x374951),box(hand,.17,.065,.16,0,.015,0,0x23363e),capsule(hand,.075,.105,0,.10,0,glove)];
  for(let i=0;i<4;i++)parts.push(capsule(hand,.022,.066,(i-1.5)*.041,.195,.005,glove));
  parts.push(capsule(hand,.027,.055,-side*.081,.10,.035,glove));
  replace(hand,'glove',[.20,.40,.22],[0,-.18,0],()=>true,parts);
  hands.push(hand);
 }
 let phase=0,blend=0,pulse=0;
 return {trigger(){pulse=1;},render(renderer,dt,moving,visible,reduced,aspect){
  if(!visible)return;
  camera.aspect=aspect;camera.updateProjectionMatrix();
  blend=THREE.MathUtils.lerp(blend,moving&&!reduced?1:0,1-Math.exp(-dt*10));
  phase+=dt*8;const reach=reduced?0:Math.sin((1-pulse)*Math.PI)*Math.min(1,pulse*2);pulse=Math.max(0,pulse-dt*2.8);
  for(let i=0;i<2;i++){const side=i===0?-1:1,h=hands[i];h.position.set(side*.37,-.39+Math.sin(phase+i*Math.PI)*.027*blend+(i===1?reach*.07:0),-.78+(i===1?-reach*.26:0));h.rotation.x=-.32+(i===1?reach*.52:0);}
  const auto=renderer.autoClear;renderer.autoClear=false;renderer.clearDepth();renderer.render(scene,camera);renderer.autoClear=auto;
 }};
}
