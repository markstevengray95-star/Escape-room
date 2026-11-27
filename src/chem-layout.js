// Chemical Chaos: wide analytical wing, offset entrances, reagent store and safety checkpoint.
export function chemLayout(theme,baseStations){
 const rect=(x,z,w,d)=>({x,z,w,d}),width=30,depth=24,sx=width/24,sz=depth/20;
 const specs=[[-15,-7,-12,-2.5],[-7,4,-12,-2.5],[4,15,-12,-2.5],[-15,-4,2.5,12],[-4,3,2.5,12],[3,15,2.5,12]];
 const rooms=specs.map(([a,b,c,d],i)=>({name:theme.names[i],x:(a+b)/2,z:(c+d)/2,w:b-a,d:d-c,bounds:[a,b,c,d],color:[0x635c4e,0x615b55,0x5b605b,0x6b5946,0x5b5548,0x5a605e][i]}));
 const walls=[rect(0,-12,30,.2),rect(0,12,30,.2),rect(-15,0,.2,24),rect(15,0,.2,24)];
 const entries=[-11.2,-1.8,9.8,-9.3,-.5,8.7];
 for(const [i,[a,b,c,d]] of specs.entries()){const z=i<3?d:c,x=entries[i],left=x-1.4,right=x+1.4;walls.push(rect((a+left)/2,z,left-a,.22),rect((right+b)/2,z,b-right,.22));}
 for(const x of [-7,4])walls.push(rect(x,-7.25,.22,9.5));for(const x of [-4,3])walls.push(rect(x,7.25,.22,9.5));
 walls.push(rect(-13.4,.85,2.5,.18),rect(12.8,-.85,2.6,.18));
 const gates=[{id:'door',x:9.8,z:-2.5,w:2.78,d:.22,name:theme.door},{id:'archiveGate',x:8.7,z:2.5,w:2.78,d:.22,name:theme.gate}];
 const furniture=[[-13.2,-10.3,1.7,1.2,'electrolysis-bench'],[-8.8,-10.3,1.6,1.1,'material-analyser'],[-5.2,-10.3,1.8,1.2,'reaction-rig'],[2,-10.3,1.7,1.2,'calorimeter'],[6,-10.3,1.7,1.2,'safety-console'],[13,-10.3,1.7,1.1,'safety-console'],[-13,10.4,1.8,1.2,'gas-test-rig'],[-6,10.4,1.8,1.2,'fume-hood'],[-2.4,10.4,1.5,1.1,'reagent-cabinet'],[1.4,10.4,1.5,1.1,'reagent-cabinet'],[5.1,10.4,1.8,1.2,'chromatography-bench'],[13,10.4,1.7,1.2,'material-analyser']].map(([x,z,w,d,asset])=>({...rect(x,z,w,d),asset}));
 const objects={drawer:[-.5,7.6],note:[-.5,7.6],power:[1.8,-7.5],door:[9.8,-2.5],archiveGate:[8.7,2.5],archive:[9,10.5],exit:[10,-10.5]};
 const positions={microscope:[-11,-6.6],indicator:[-12.1,6.5],moments:[-4.5,-6.3],density:[-9,-7.9],equation:[-5,7],graph:[7.1,7.2],osmosis:[-12.5,-8.4],separation:[11,7.5],energy:[-.5,-9],variables:[-1.6,5.3],spectrum:[12,-6.5]};
 const names={microscope:'Ionic conductivity analyser',indicator:'Unknown pH bench',moments:'Sealed reaction mass rig',density:'Material balance',equation:'Gas identification station',graph:'Reaction rate analyser',osmosis:'Atomic structure terminal',separation:'Chromatography analyser',energy:'Thermal reaction monitor',variables:'Fair test planning console',spectrum:'Safety spectrum monitor'};
 const stations=baseStations.map(p=>({...p,x:positions[p.id][0],z:positions[p.id][1],name:names[p.id]}));
 const fixed=[...walls,...furniture,rect(objects.drawer[0],objects.drawer[1]+.45,1.15,.75),...stations.map(p=>rect(p.x,p.z,.65,.65))];
 return {id:'chem',theme,rooms,walls,gates,furniture,objects,stations,spawn:{x:-12,z:-.25,yaw:-Math.PI/2},width,depth,sx,sz,collisionBoxes:state=>[...fixed,...gates.filter(g=>!state[g.id])],roomAt:(x,z)=>rooms.find(r=>{const [a,b,c,d]=r.bounds;return x>a&&x<b&&z>c&&z<d;})?.name||(Math.abs(z)<2.5?'Safety access corridor':'Facility')};
}
