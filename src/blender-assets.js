import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const loader=new GLTFLoader();
const base=pack=>import.meta.env.BASE_URL+'models/'+pack+'/';
const manifests=new Map();
// Cache original bytes, not mutable scene objects. Each instance owns its GPU resources.
const bytesCache=new Map();const MAX_CACHE=24_000_000;let cachedBytes=0;
async function assetBytes(url){if(bytesCache.has(url)){const hit=bytesCache.get(url);bytesCache.delete(url);bytesCache.set(url,hit);return hit.promise;}const entry={size:0,promise:null};entry.promise=fetch(url,{signal:AbortSignal.timeout(15000)}).then(async r=>{if(!r.ok)throw Error('Model unavailable');const b=await r.arrayBuffer();if(b.byteLength>4_000_000)throw Error('Model exceeds size budget');entry.size=b.byteLength;cachedBytes+=entry.size;for(const [k,v] of bytesCache){if(cachedBytes<=MAX_CACHE)break;if(v.size&&k!==url){cachedBytes-=v.size;bytesCache.delete(k);}}return b;}).catch(e=>{bytesCache.delete(url);throw e;});bytesCache.set(url,entry);return entry.promise;}
export function assetManifest(pack='lab'){if(!manifests.has(pack))manifests.set(pack,fetch(base(pack)+'manifest.json',{cache:'no-cache',signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error('Assets not generated');return r.json();}).then(m=>m?.version===1&&m.assets?m.assets:{}).catch(()=>{manifests.delete(pack);return {};}));return manifests.get(pack);}
export function disposeAsset(root){root.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}}});}
export async function loadBlenderAsset(id,width,height,depth,pack='lab'){
 const manifest=await assetManifest(pack);if(manifest[id]?.file!==id+'.glb')return null;
 let root;try{const url=base(pack)+id+'.glb';const data=await assetBytes(url);root=(await loader.parseAsync(data.slice(0),base(pack))).scene;root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3());if(![size.x,size.y,size.z].every(v=>Number.isFinite(v)&&v>.0001))throw Error('Invalid model bounds');const scale=Math.min(width/size.x,height/size.y,depth/size.z);root.scale.multiplyScalar(scale);root.updateMatrixWorld(true);const fitted=new THREE.Box3().setFromObject(root);root.position.x-=(fitted.min.x+fitted.max.x)/2;root.position.y-=fitted.min.y;root.position.z-=(fitted.min.z+fitted.max.z)/2;root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return root;}catch(e){if(root)disposeAsset(root);console.warn('Escape Lab asset fallback:',id,e.message);return null;}
}
