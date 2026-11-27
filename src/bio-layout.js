// Independent biological research facility: deep wings, unequal rooms, decontamination access spine.
export function bioLayout(theme,baseStations){
 const rect=(x,z,w,d)=>({x,z,w,d}),width=26,depth=26,sx=width/24,sz=depth/20;
 const specs=[[-13,-6,-13,-3],[-6,3,-13,-3],[3,13,-13,-3],[-13,-3,3,13],[-3,5,3,13],[5,13,3,13]];
 const rooms=specs.map(([a,b,c,d],i)=>({name:theme.names[i],x:(a+b)/2,z:(c+d)/2,w:b-a,d:d-c,bounds:[a,b,c,d],color:[0x33574d,0x456656,0x3c5d5c,0x48675f,0x445b54,0x42675d][i]}));
 const walls=[rect(0,-13,26,.2),rect(0,13,26,.2),rect(-13,0,.2,26),rect(13,0,.2,26)];
 const entries=[-9.6,-1.7,7.9,-8.1,1,9.1];
 for(const [i,[a,b,c,d]] of specs.entries()){const z=i<3?d:c,x=entries[i],left=x-1.3,right=x+1.3;walls.push(rect((a+left)/2,z,left-a,.22),rect((right+b)/2,z,b-right,.22));}
 for(const x of [-6,3])walls.push(rect(x,-8,.22,10));for(const x of [-3,5])walls.push(rect(x,8,.22,10));
 // Short partitions form a separate decontamination alcove without blocking the access spine.
 walls.push(rect(-11.8,-.7,2.2,.18),rect(11.8,.7,2.2,.18));
 const gates=[{id:'door',x:7.9,z:-3,w:2.58,d:.22,name:theme.door},{id:'archiveGate',x:9.1,z:3,w:2.58,d:.22,name:theme.gate}];
 const furniture=[[-11.5,-11.4,1.5,1.1,'culture-cabinet'],[-7.5,-11.4,1.5,1.1,'grow-rack'],[-4.4,-11.5,1.8,1.2,'incubator'],[1.4,-11.5,1.5,1,'centrifuge'],[5,-11.5,1.6,1.1,'biosafety-console'],[11.1,-11.5,1.6,1.1,'biosafety-console'],[-11.3,11.4,1.6,1.1,'diagnostic-bench'],[-4.8,11.4,1.6,1.1,'culture-cabinet'],[-1.3,11.5,1.4,1.1,'cold-storage'],[3.5,11.5,1.4,1.1,'cold-storage'],[6.6,11.5,1.5,1.2,'specimen-pod'],[11.5,11.5,1.5,1.2,'specimen-pod']].map(([x,z,w,d,asset])=>({...rect(x,z,w,d),asset}));
 const objects={drawer:[.5,8],note:[.5,8],power:[1.7,-9.3],door:[7.9,-3],archiveGate:[9.1,3],archive:[9.1,11.3],exit:[8,-11.3]};
 const positions={microscope:[-10.4,-6.6],indicator:[-10,7.1],moments:[-3.8,-6.8],density:[-5.5,7.3],equation:[.3,-6.7],graph:[7.4,7.8],osmosis:[-7.3,-8.7],separation:[-7.2,9.4],energy:[-10,-9.3],variables:[11.2,7.3],spectrum:[10.8,-7.2]};
 const names={microscope:'Cell identification microscope',indicator:'Diagnostic treatment terminal',moments:'Enzyme incubator',density:'Specimen mass balance',equation:'Respiration monitor',graph:'Chromosome analyser',osmosis:'Membrane transport bench',separation:'Digestive enzyme test',energy:'Plant growth controller',variables:'Culture investigation planner',spectrum:'Containment temperature monitor'};
 const stations=baseStations.map(p=>({...p,x:positions[p.id][0],z:positions[p.id][1],name:names[p.id]}));
 const fixed=[...walls,...furniture,rect(objects.drawer[0],objects.drawer[1]+.45,1.15,.75),...stations.map(p=>rect(p.x,p.z,.65,.65))];
 return {id:'bio',theme,rooms,walls,gates,furniture,objects,stations,spawn:{x:-11,z:1.2,yaw:-Math.PI/2},width,depth,sx,sz,collisionBoxes:state=>[...fixed,...gates.filter(g=>!state[g.id])],roomAt:(x,z)=>rooms.find(r=>{const [a,b,c,d]=r.bounds;return x>a&&x<b&&z>c&&z<d;})?.name||(Math.abs(z)<3?'Decontamination access':'Facility')};
}
