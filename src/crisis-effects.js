import * as THREE from 'three';
import {effectState,effectsProfiles} from './crisis-effects-model.js';
// One point-cloud draw call, one instanced decorative damage mesh, no extra physics.
const MAX=144,MARKS=36;
function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function softTexture(){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.38,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c);}
export function createCrisisEffects(scene){
 let root=null,points=null,marks=null,texture=null,positions=null,anchors=[],profile=effectsProfiles.lab,markBase=[],clock=0;
 const dummy=new THREE.Object3D(),target={particles:0,lightStress:0,intensity:0,paused:false};
 function clear(){if(root){scene.remove(root);root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});texture?.dispose();}root=points=marks=texture=null;positions=null;anchors=[];markBase=[];clock=0;Object.assign(target,{particles:0,lightStress:0,intensity:0,paused:false});}
 function begin(layout){
  clear();profile=effectsProfiles[layout.id]||effectsProfiles.lab;const r=random(731+layout.id.length*99);root=new THREE.Group();root.name='Decorative crisis effects';scene.add(root);
  positions=new Float32Array(MAX*3);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));g.setDrawRange(0,0);
  texture=softTexture();const sparks=profile.particle==='sparks';const mat=new THREE.PointsMaterial({color:profile.color,size:profile.size,map:texture,transparent:true,opacity:sparks?.78:.38,depthWrite:false,blending:sparks?THREE.AdditiveBlending:THREE.NormalBlending,sizeAttenuation:true});
  points=new THREE.Points(g,mat);points.frustumCulled=false;root.add(points);
  // Emit near existing decorative furniture or chamber interiors, not in the player's face.
  const sources=layout.furniture.filter(b=>b.asset!=='pillar');const locations=sources.length?sources:layout.rooms;
  for(let i=0;i<MAX;i++){const a=locations[i%locations.length],spread=Math.min(1.2,(a.w||2)*.35);anchors.push({x:a.x+(r()-.5)*spread,z:a.z+(r()-.5)*spread,phase:r(),drift:r()*2-1,offset:r()*Math.PI*2});}
  const mg=new THREE.BoxGeometry(.23,.024,.055),mm=new THREE.MeshStandardMaterial({color:layout.id==='tomb'?0x56452e:0x393c40,roughness:.96});
  marks=new THREE.InstancedMesh(mg,mm,MARKS);marks.count=0;marks.frustumCulled=false;root.add(marks);
  // Cosmetic scuffs/rubble stay at room edges, do not add collision or block clues.
  for(let i=0;i<MARKS;i++){const room=layout.rooms[i%layout.rooms.length],bounds=room.bounds;const edge=bounds?(room.z<0?bounds[2]+.42:bounds[3]-.42):room.z+(room.z<0?-3.1:3.1)*layout.sz;const width=room.w||7.5*layout.sx;markBase.push({x:room.x+(r()-.5)*width*.76,z:edge+(room.z<0?1:-1)*r()*.50,y:.031,angle:r()*Math.PI,scale:.5+r()*.9});}
  for(let i=0;i<MARKS;i++){const a=markBase[i];dummy.position.set(a.x,a.y,a.z);dummy.rotation.set(0,a.angle,0);dummy.scale.set(a.scale,1,a.scale);dummy.updateMatrix();marks.setMatrixAt(i,dummy.matrix);}marks.instanceMatrix.needsUpdate=true;
 }
 function update(crisis,prefs,dt){
  if(!root)return effectState('lab',null,prefs);
  const state=effectState(Object.keys(effectsProfiles).find(k=>effectsProfiles[k]===profile)||'lab',crisis,prefs);
  Object.assign(target,state);if(!state.paused)clock+=Math.min(.1,Math.max(0,dt));
  points.visible=state.particles>0;points.geometry.setDrawRange(0,state.particles);
  if(state.particles){const sparks=profile.particle==='sparks',dust=profile.particle==='dust';for(let i=0;i<state.particles;i++){const a=anchors[i],t=(clock*profile.speed*.38+a.phase)%1,drift=Math.sin(t*4+a.offset)*a.drift;positions[i*3]=a.x+drift*(sparks?.45:.27);positions[i*3+1]=dust?2.95-t*2.6:sparks?1.85-t*1.35:.35+t*2.25;positions[i*3+2]=a.z+Math.cos(t*4+a.offset)*.23;}points.geometry.attributes.position.needsUpdate=true;}
  marks.count=prefs.quality==='low'||prefs.crisisEffects===false?0:Math.round(MARKS*state.intensity);
  return state;
 }
 return {begin,clear,update};
}
