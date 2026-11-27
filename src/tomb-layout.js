// Fictional archaeological site: offset galleries, narrow entrance and a central pillared passage.
export function tombLayout(theme,baseStations){
 const rect=(x,z,w,d)=>({x,z,w,d}),width=28,depth=28,sx=width/24,sz=depth/20;
 const specs=[[-14,-5,-14,-3],[-5,5,-14,-3],[5,14,-14,-3],[-14,-4,3,14],[-4,4,3,14],[4,14,3,14]];
 const rooms=specs.map(([a,b,c,d],i)=>({name:theme.names[i],x:(a+b)/2,z:(c+d)/2,w:b-a,d:d-c,bounds:[a,b,c,d],color:[0x796346,0x715b42,0x826c4e,0x78634b,0x6d5943,0x78684d][i]}));
 const walls=[rect(0,-14,28,.32),rect(0,14,28,.32),rect(-14,0,.32,28),rect(14,0,.32,28)];
 const entries=[-9.5,0,9.5,-9,0,9];
 for(const [i,[a,b,c,d]] of specs.entries()){const z=i<3?d:c,x=entries[i],left=x-1.35,right=x+1.35;walls.push(rect((a+left)/2,z,left-a,.34),rect((right+b)/2,z,b-right,.34));}
 for(const x of [-5,5])walls.push(rect(x,-8.5,.34,11));for(const x of [-4,4])walls.push(rect(x,8.5,.34,11));
 // Pillars double as collision geometry; the corridor remains traversable on either side.
 const pillars=[-12,-6,0,6,12].map(x=>({...rect(x,0,.75,.75),asset:'pillar'}));
 const gates=[{id:'door',x:9.5,z:-3,w:2.68,d:.34,name:theme.door},{id:'archiveGate',x:9,z:3,w:2.68,d:.34,name:theme.gate}];
 const furniture=[[-11.8,-12,2,1.5,'artefact-plinth'],[-7,-12,1.6,1.3,'urn-cluster'],[-3,-11.8,2.8,1.8,'counterweight-rig'],[3,-12,1.8,1.3,'stone-scale'],[7,-12,1.8,1.4,'inscribed-stele'],[12,-12,1.8,1.4,'inscribed-stele'],[-11.5,12,2.2,1.5,'mineral-display'],[-6.3,12,1.8,1.3,'urn-cluster'],[-2,12,1.8,1.3,'survey-chest'],[2,12,1.7,1.3,'survey-chest'],[6.4,12,2,1.4,'dating-table'],[12,12,1.7,1.4,'inscribed-stele']].map(([x,z,w,d,asset])=>({...rect(x,z,w,d),asset})).concat(pillars);
 const objects={drawer:[-.6,8.9],note:[-.6,8.9],power:[2.4,-8.4],door:[9.5,-3],archiveGate:[9,3],archive:[9,12],exit:[9.5,-12]};
 const positions={microscope:[-10,-7.1],indicator:[-10,7.4],moments:[-2.6,-7.6],density:[-7.4,-8.6],equation:[-6.4,7.1],graph:[6.9,7.8],osmosis:[-11.8,9.6],separation:[-1.9,5.5],energy:[1.9,-10],variables:[11.5,7.6],spectrum:[11.5,-7.1]};
 const names={microscope:'Artefact inspection lens',indicator:'Mineral identification',moments:'Counterweight mechanism',density:'Stone density balance',equation:'Mineral reaction record',graph:'Radiometric dating station',osmosis:'Preservation test',separation:'Sample separation bench',energy:'Lifting mechanism',variables:'Survey notes',spectrum:'Optical analyser'};
 const stations=baseStations.map(p=>({...p,x:positions[p.id][0],z:positions[p.id][1],name:names[p.id]}));
 const fixed=[...walls,...furniture,rect(objects.drawer[0],objects.drawer[1]+.45,1.15,.75),...stations.map(p=>rect(p.x,p.z,.65,.65))];
 return {id:'tomb',theme,rooms,walls,gates,furniture,objects,stations,spawn:{x:-13,z:1.6,yaw:-Math.PI/2},width,depth,sx,sz,collisionBoxes:state=>[...fixed,...gates.filter(g=>!state[g.id])],roomAt:(x,z)=>rooms.find(r=>{const [a,b,c,d]=r.bounds;return x>a&&x<b&&z>c&&z<d;})?.name||(Math.abs(z)<3?'Pillared passage':'Stone chamber')};
}
