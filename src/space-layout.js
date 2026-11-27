// Purpose-built spacecraft: asymmetric compartments, broad central spine and offset airlocks.
export function spaceLayout(theme,baseStations){
 const rect=(x,z,w,d)=>({x,z,w,d}),width=28,depth=22,sx=width/24,sz=depth/20;
 const specs=[[-14,-5,-11,-2.4],[-5,5,-11,-2.4],[5,14,-11,-2.4],[-14,-6,2.4,11],[-6,4,2.4,11],[4,14,2.4,11]];
 const rooms=specs.map(([a,b,c,d],i)=>({name:theme.names[i],x:(a+b)/2,z:(c+d)/2,w:b-a,d:d-c,bounds:[a,b,c,d],color:[0x304d54,0x34475c,0x344f68,0x414b63,0x3f4b58,0x39495f][i]}));
 const walls=[rect(0,-11,28,.2),rect(0,11,28,.2),rect(-14,0,.2,22),rect(14,0,.2,22)];
 const entries=[-9.4,-.8,9.5,-10,-1,9];
 for(const [i,[a,b,c,d]] of specs.entries()){const z=i<3?d:c,x=entries[i],left=x-1.35,right=x+1.35;walls.push(rect((a+left)/2,z,left-a,.22),rect((right+b)/2,z,b-right,.22));}
 for(const x of [-5,5])walls.push(rect(x,-6.7,.22,8.6));for(const x of [-6,4])walls.push(rect(x,6.7,.22,8.6));
 const gates=[{id:'door',x:9.5,z:-2.4,w:2.68,d:.22,name:theme.door},{id:'archiveGate',x:9,z:2.4,w:2.68,d:.22,name:theme.gate}];
 const furniture=[[-12,-9.5,1.8,1.2,'life-support'],[-7,-9.5,1.5,1,'hydroponics'],[-3.3,-9.3,1.5,1.1,'reactor'],[3.2,-9.3,1.5,1.1,'solar-rack'],[7.1,-9.5,1.5,1,'cockpit'],[12,-9.5,1.6,1,'cockpit'],[-12,9.5,1.6,1.1,'cargo-rack'],[-7.5,9.5,1.5,1,'cargo-rack'],[-4.4,9.5,1.7,1,'cargo-rack'],[2.4,9.5,1.5,1,'cargo-rack'],[5.8,9.5,1.5,1,'navigation'],[12,9.5,1.5,1,'navigation']].map(([x,z,w,d,asset])=>({...rect(x,z,w,d),asset}));
 const objects={drawer:[-2,7.3],note:[-2,7.3],power:[1.9,-7.9],door:[9.5,-2.4],archiveGate:[9,2.4],archive:[9,9.6],exit:[9.5,-9.6]};
 const positions={microscope:[-11,-6.3],indicator:[-7.4,-6.3],moments:[-2.4,-5.6],density:[-10,6],equation:[2.5,-5.5],graph:[7,6],osmosis:[-7.8,6],separation:[-3.5,6],energy:[0,-9.1],variables:[11,6],spectrum:[11.8,-5.8]};
 const names={microscope:'Hydroponics monitor',indicator:'Life support console',moments:'Thruster controls',density:'Cargo mass analyser',equation:'Heater diagnostics',graph:'Orbital computer',osmosis:'Water recycler',separation:'Waste recovery',energy:'Solar array controller',variables:'Radio telemetry',spectrum:'Thermal scanner'};
 const stations=baseStations.map(p=>({...p,x:positions[p.id][0],z:positions[p.id][1],name:names[p.id]}));
 const fixed=[...walls,...furniture,rect(objects.drawer[0],objects.drawer[1]+.45,1.15,.75),...stations.map(p=>rect(p.x,p.z,.65,.65))];
 return {id:'space',theme,rooms,walls,gates,furniture,objects,stations,spawn:{x:-12,z:0,yaw:-Math.PI/2},width,depth,sx,sz,collisionBoxes:state=>[...fixed,...gates.filter(g=>!state[g.id])],roomAt:(x,z)=>rooms.find(r=>{const [a,b,c,d]=r.bounds;return x>a&&x<b&&z>c&&z<d;})?.name||(Math.abs(z)<2.4?'Access passage':'Hull')};
}
