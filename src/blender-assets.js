import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const loader=new GLTFLoader();
const base=pack=>import.meta.env.BASE_URL+'models/'+pack+'/';
const manifests=new Map();
export function assetManifest(pack='lab'){if(!manifests.has(pack))manifests.set(pack,fetch(base(pack)+'manifest.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Assets not generated');return r.json();}).then(m=>m?.version===1&&m.assets?m.assets:{}).catch(()=>({})));return manifests.get(pack);}
export function disposeAsset(root){root.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}}});}
export async function loadBlenderAsset(id,width,height,depth,pack='lab'){
 const manifest=await assetManifest(pack);if(manifest[id]?.file!==id+'.glb')return null;
 let root;try{root=(await loader.loadAsync(base(pack)+id+'.glb')).scene;root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3());if(![size.x,size.y,size.z].every(v=>Number.isFinite(v)&&v>.0001))throw Error('Invalid model bounds');const scale=Math.min(width/size.x,height/size.y,depth/size.z);root.scale.multiplyScalar(scale);root.updateMatrixWorld(true);const fitted=new THREE.Box3().setFromObject(root);root.position.x-=(fitted.min.x+fitted.max.x)/2;root.position.y-=fitted.min.y;root.position.z-=(fitted.min.z+fitted.max.z)/2;root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return root;}catch(e){if(root)disposeAsset(root);console.warn('Escape Lab asset fallback:',id,e.message);return null;}
}
