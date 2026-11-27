// Fictional industrial environment; shared by server collision checks and browser.
export function powerLayout(theme,baseStations){
 const rect=(x,z,w,d)=>({x,z,w,d}),width=34,depth=26,sx=width/24,sz=depth/20;
 const specs=[[-17,-7,-13,-3],[-7,6,-13,-3],[6,17,-13,-3],[-17,-5,3,13],[-5,4,3,13],[4,17,3,13]];
 const rooms=specs.map(([a,b,c,d],i)=>({name:theme.names[i],x:(a+b)/2,z:(c+d)/2,w:b-a,d:d-c,bounds:[a,b,c,d],color:[0x414a50,0x555352,0x3e515a,0x4a4844,0x514d46,0x424a50][i]}));
 const walls=[rect(0,-13,34,.2),rect(0,13,34,.2),rect(-17,0,.2,26),rect(17,0,.2,26)];
 const entries=[-12,-1,11,-11,-.5,10];
 for(const [i,[a,b,c,d]] of specs.entries()){const z=i<3?d:c,x=entries[i],left=x-1.5,right=x+1.5;walls.push(rect((a+left)/2,z,left-a,.22),rect((right+b)/2,z,b-right,.22));}
 for(const x of [-7,6])walls.push(rect(x,-8,.22,10));for(const x of [-5,4])walls.push(rect(x,8,.22,10));
 walls.push(rect(-15,.9,2.5,.18),rect(15,-.9,2.5,.18));
 const gates=[{id:'door',x:11,z:-3,w:2.98,d:.22,name:theme.door},{id:'archiveGate',x:10,z:3,w:2.98,d:.22,name:theme.gate}];
 const furniture=[[-14.4,-10.5,3.1,2.1,'transformer'],[-9,-10.5,1.9,1.6,'switchgear'],[-3.6,-10.5,4.5,2.3,'turbine'],[3.5,-10.5,3,2.1,'generator'],[8.1,-11,2.4,1.2,'control-desk'],[14.5,-11,2.4,1.2,'control-desk'],[-14,10.5,2.8,1.6,'maintenance-bench'],[-7.7,10.5,2.3,1.6,'pump-skid'],[-3,11,1.8,1.3,'parts-rack'],[2,11,1.8,1.3,'parts-rack'],[6.4,10.5,2,1.5,'switchgear'],[14.5,10.5,2.4,1.2,'control-desk']].map(([x,z,w,d,asset])=>({...rect(x,z,w,d),asset}));
 const objects={drawer:[-.5,7.8],note:[-.5,7.8],power:[3.3,-7],door:[11,-3],archiveGate:[10,3],archive:[10.2,11],exit:[11.4,-11]};
 const positions={microscope:[-13,-6.8],indicator:[-13,6.8],moments:[-3.8,-6.5],density:[2,-6.7],equation:[-8.7,7.3],graph:[7.6,7.7],osmosis:[-10,-6.9],separation:[-2,5.4],energy:[.1,-8.2],variables:[13,7.5],spectrum:[14,-6.8]};
 const names={microscope:'Transformer diagnostic terminal',indicator:'Electromagnet training rig',moments:'Turbine mechanical test',density:'Generator efficiency monitor',equation:'Series circuit training board',graph:'Resistance diagnostic terminal',osmosis:'Insulator identification',separation:'Spare parts inventory',energy:'Motor energy meter',variables:'Inspection planner',spectrum:'Thermal imaging monitor'};
 const stations=baseStations.map(p=>({...p,x:positions[p.id][0],z:positions[p.id][1],name:names[p.id]}));
 const fixed=[...walls,...furniture,rect(objects.drawer[0],objects.drawer[1]+.45,1.15,.75),...stations.map(p=>rect(p.x,p.z,.65,.65))];
 return {id:'blackout',theme,rooms,walls,gates,furniture,objects,stations,spawn:{x:-14,z:-.3,yaw:-Math.PI/2},width,depth,sx,sz,collisionBoxes:state=>[...fixed,...gates.filter(g=>!state[g.id])],roomAt:(x,z)=>rooms.find(r=>{const [a,b,c,d]=r.bounds;return x>a&&x<b&&z>c&&z<d;})?.name||(Math.abs(z)<3?'Service corridor':'Facility')};
}
