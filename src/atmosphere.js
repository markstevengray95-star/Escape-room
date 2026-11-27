import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {visualTheme,graphicsDetail,lightLevel} from './atmosphere-model.js';
const patterns=['tile','panel','deck','hull','resin','brick','concrete','stone'];
const sources=new Map();
function noise(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function createSource(kind,channel){
 const key=kind+':'+channel;if(sources.has(key))return sources.get(key);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');
 const r=noise(1337+patterns.indexOf(kind)*121),height=channel==='height';
 ctx.fillStyle=height?'#aaa':'#d7d7d7';ctx.fillRect(0,0,256,256);
 // Deterministic fine grain; height and colour share the same positions.
 for(let i=0;i<3400;i++){const x=r()*256,y=r()*256,v=r(),s=1+r()*2;ctx.fillStyle=v>.5?'rgba(255,255,255,.09)':'rgba(0,0,0,.09)';ctx.fillRect(x,y,s,1);}
 const seam=(x,y,w,h)=>{ctx.fillStyle=height?'#414141':'#777777';ctx.fillRect(x,y,w,h);ctx.fillStyle=height?'#c5c5c5':'#ededed';if(w<h)ctx.fillRect(x+w,y,1,h);else ctx.fillRect(x,y+h,w,1);};
 const rivet=(x,y)=>{ctx.fillStyle=height?'#ddd':'#9c9c9c';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eeeeee';ctx.fillRect(x-1,y-1,1,1);};
 if(kind==='tile'){seam(0,0,256,3);seam(0,0,3,256);seam(128,0,3,256);seam(0,128,256,3);}
 if(kind==='panel'||kind==='hull'){seam(0,0,256,4);seam(0,0,4,256);if(kind==='hull'){seam(0,128,256,3);for(const x of [12,244])for(const y of [12,116,140,244])rivet(x,y);}else{for(const x of [12,244])for(const y of [12,244])rivet(x,y);}}
 if(kind==='brick'||kind==='stone'){const rows=kind==='brick'?4:3,h=256/rows;for(let j=0;j<rows;j++){const y=j*h;seam(0,y,256,kind==='stone'?5:3);for(const x of [0,128]){const off=(x+(j%2)*64)%256;seam(off,y,kind==='stone'?5:3,h);}}}
 if(kind==='deck'){for(let y=12;y<256;y+=32)for(let x=12;x<256;x+=32){ctx.fillStyle=height?'#ddd':'#b3b3b3';ctx.save();ctx.translate(x+(Math.floor(y/32)%2)*8,y);ctx.rotate((Math.floor(y/32)%2?1:-1)*Math.PI/4);ctx.fillRect(-6,-2,12,4);ctx.restore();}seam(0,0,256,3);seam(0,0,3,256);}
 if(kind==='resin'||kind==='concrete'){for(let i=0;i<35;i++){const x=r()*256,y=r()*256,rad=3+r()*18;const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,'rgba(0,0,0,.06)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-rad,y-rad,rad*2,rad*2);}}
 sources.set(key,canvas);return canvas;
}
function texture(kind,channel,x,y,anisotropy){
 const t=new THREE.CanvasTexture(createSource(kind,channel));t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(Math.max(1,x),Math.max(1,y));t.colorSpace=channel==='color'?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=anisotropy;return t;
}
export function makeAtmosphere(renderer,scene,hemi,key){
 let id='lab',quality='standard',surfaces=[],roomLights=[],environment=null,powered=false,stress=0;const normal=new THREE.Color(),warning=new THREE.Color(),fog=new THREE.Color();
 const maxAniso=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 function reflect(){if(environment)return environment.texture;try{const source=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);try{environment=pmrem.fromScene(source,.05);}finally{source.dispose();pmrem.dispose();}return environment.texture;}catch(err){console.warn('Reflection fallback',err.message);return null;}}
 function configure(){const t=visualTheme(id),detail=graphicsDetail(quality);renderer.toneMappingExposure=t.exposure;hemi.color.setHex(t.ambient);hemi.groundColor.setHex(t.ground);hemi.intensity=t.hemi;key.color.setHex(t.light);key.intensity=t.key;scene.fog.color.setHex(t.fog);scene.fog.near=t.near;scene.fog.far=t.far;scene.background.setHex(t.fog);scene.environment=detail.reflection?reflect():null;scene.environmentIntensity=.45;for(const entry of surfaces){entry.mat.bumpMap=detail.bump?entry.bump:null;entry.mat.needsUpdate=true;}}
 return {
 begin(next,q){for(const entry of surfaces){entry.bump.dispose();}surfaces=[];roomLights=[];id=next;quality=q;powered=false;stress=0;configure();},
 quality(q){quality=q;configure();},
 surface(mesh,type,w,h){const t=visualTheme(id),kind=t[type]||'panel',scale=type==='floor'?(kind==='deck'?.9:1.6):type==='wall'?1.7:2;const mat=mesh.material;const x=w/scale,y=h/scale;mat.map=texture(kind,'color',x,y,maxAniso);const bump=texture(kind,'height',x,y,maxAniso);mat.bumpMap=graphicsDetail(quality).bump?bump:null;mat.bumpScale=kind==='stone'?.055:kind==='concrete'?.030:.012;mat.roughness=kind==='stone'||kind==='concrete'?.94:kind==='deck'?.55:.78;mat.metalness=type==='wall'||type==='floor'?t.metal:0;mat.needsUpdate=true;surfaces.push({mat,bump});},
 room(room){const t=visualTheme(id);const light=new THREE.PointLight(t.light,lightLevel(id,false),Math.max(8,Math.max(room.w||8,room.d||8)*.92),2);light.position.set(room.x,2.79,room.z);scene.add(light);roomLights.push(light);return light;},
 power(on){powered=!!on;},
 crisis(effect,dt){const t=visualTheme(id),amount=effect?.lightStress||0;stress=THREE.MathUtils.lerp(stress,amount,1-Math.exp(-Math.max(0,dt)*2.5));if(Math.abs(stress-amount)<.0005)stress=amount;normal.setHex(t.light);warning.setHex(effect?.profile?.warning??t.light);for(const light of roomLights){light.color.copy(normal).lerp(warning,stress*.72);light.intensity=lightLevel(id,powered)*(1-.42*stress);}hemi.intensity=t.hemi*(1-.20*stress);key.intensity=t.key*(1-.20*stress);fog.setHex(t.fog);warning.setHex(effect?.profile?.fog??t.fog);scene.fog.color.copy(fog).lerp(warning,stress*.55);scene.fog.near=t.near*(1-.22*stress);scene.fog.far=t.far*(1-.22*stress);scene.background.copy(scene.fog.color);},
 get theme(){return visualTheme(id);}
 };
}
