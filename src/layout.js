// Shared facility geometry: world coordinates in metres, +z is south.
export const spawn={x:-10,z:0,yaw:-Math.PI/2};
export const rooms=[
 {name:'Biology',x:-8,z:-6,color:0x486c60},{name:'Physics',x:0,z:-6,color:0x48647b},{name:'Control',x:8,z:-6,color:0x566476},
 {name:'Chemistry',x:-8,z:6,color:0x766450},{name:'Stores',x:0,z:6,color:0x616b68},{name:'Analysis',x:8,z:6,color:0x655c78}];
const rect=(x,z,w,d)=>({x,z,w,d});
export const walls=[rect(0,-10,24,.2),rect(0,10,24,.2),rect(-12,0,.2,20),rect(12,0,.2,20)];
for(const z of [-2,2]){
 for(const x of [-10.75,-4,4,10.75])walls.push(rect(x,z,x===-10.75||x===10.75?2.5:5.5,.22));
}
for(const x of [-4,4])for(const z of [-6,6])walls.push(rect(x,z,.22,8));
export const gates=[{id:'door',x:8,z:-2,w:2.48,d:.22,name:'Control room keypad'},{id:'archiveGate',x:8,z:2,w:2.48,d:.22,name:'Analysis security gate'}];
export const furniture=rooms.flatMap(r=>[rect(r.x-2.6,r.z+(r.z<0?-2.5:2.5),1.5,1.1),rect(r.x+2.6,r.z+(r.z<0?-2.5:2.5),1.5,1.1)]);
export const objects={drawer:[-1.8,7.2],note:[-1.8,7.2],power:[1.8,-7.1],door:[8,-2],archiveGate:[8,2],archive:[8,8.7],exit:[8,-8.7]};
export const fixedBoxes=[...walls,...furniture,rect(-1.8,7.65,1.15,.75)];
export const stationBox=p=>rect(p.x,p.z,.65,.65);
export function collisionBoxes(stations,state){return [...fixedBoxes,...stations.map(stationBox),...gates.filter(g=>!state[g.id])];}
export function roomAt(x,z){if(Math.abs(z)<2)return 'Central corridor';return rooms.find(r=>Math.abs(r.x-x)<4&&Math.abs(r.z-z)<4)?.name||'Facility';}
