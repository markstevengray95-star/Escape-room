import * as THREE from 'three';
import {items} from './exploration.js';
const mat=c=>new THREE.MeshStandardMaterial({color:c,metalness:.22,roughness:.45});
function piece(g,geo,c,x,y,z){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);g.add(m);return m;}
const box=(g,w,h,d,c,x=0,y=0,z=0)=>piece(g,new THREE.BoxGeometry(w,h,d),c,x,y,z);
const cyl=(g,r,h,c,x=0,y=0,z=0)=>piece(g,new THREE.CylinderGeometry(r,r,h,24),c,x,y,z);
export function itemModel(id){const g=new THREE.Group();const dark=0x202b32,metal=0xa9b8bf;
 if(id==='cell'){cyl(g,.055,.18,0xd6a94c);cyl(g,.056,.06,dark,0,-.06);cyl(g,.022,.022,metal,0,.10);cyl(g,.045,.009,metal,0,-.095);}
 else if(id==='switch'){box(g,.18,.036,.1,dark);for(const x of [-.065,.065]){cyl(g,.018,.035,metal,x,.032,0);box(g,.035,.02,.035,0x9d7945,x,.02,0);}box(g,.13,.018,.028,metal,0,.052,0).rotation.z=.32;}
 else if(id==='resistor'){cyl(g,.025,.105,0xcaa57c).rotation.z=Math.PI/2;for(const [x,c] of [[-.03,0x6e2e20],[-.01,0x191919],[.015,0xd4543b],[.039,0xd8b24a]])cyl(g,.026,.008,c,x).rotation.z=Math.PI/2;for(const x of [-.09,.09])cyl(g,.004,.08,metal,x).rotation.z=Math.PI/2;}
 else if(id==='slide'){box(g,.22,.012,.085,0x9acbc5);box(g,.055,.004,.045,0x79a678,0,.008);box(g,.045,.003,.07,0xe8e7da,-.075,.008);}
 return g;}
export function inspectItem(canvas,id){let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch{return ()=>{};}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.01,10),model=itemModel(id);scene.add(model,new THREE.HemisphereLight(0xe4f5ff,0x50606b,2.6));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(2,3,4);scene.add(light);camera.position.set(.34,.25,.48);camera.lookAt(0,0,0);renderer.setSize(280,220,false);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));camera.aspect=280/220;camera.updateProjectionMatrix();
 let drag=null,closed=false;const draw=()=>{if(!closed)renderer.render(scene,camera);};model.rotation.y=.5;draw();
 const down=e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};const move=e=>{if(!drag)return;model.rotation.y+=(e.clientX-drag.x)*.018;model.rotation.x+=(e.clientY-drag.y)*.018;drag={x:e.clientX,y:e.clientY};draw();};const up=()=>drag=null;const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();model.rotation.y+=(Number(e.key==='ArrowRight')-Number(e.key==='ArrowLeft'))*.25;model.rotation.x+=(Number(e.key==='ArrowDown')-Number(e.key==='ArrowUp'))*.25;draw();}};
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('keydown',key);
 return ()=>{closed=true;model.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});renderer.dispose();renderer.forceContextLoss();};
}
