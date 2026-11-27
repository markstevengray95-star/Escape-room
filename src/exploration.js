// Shared exploration rules for the enhanced Laboratory Lockdown.
export const containers=[
 {id:'case-supply',name:'Electrical spares case',x:-2.6,z:8.5,items:['cell']},
 {id:'case-repair',name:'Engineering toolbox',x:-2.6,z:-8.5,items:['switch','resistor']},
 {id:'case-specimen',name:'Specimen slide case',x:-10.6,z:-8.5,items:['slide']}
];
export const items={
 cell:{name:'Power cell',description:'A spare low-voltage power cell. Use it as the supply in the simulated circuit.',color:0xd5b063},
 switch:{name:'Control switch',description:'An isolated control switch. Use it to complete the circuit only after connecting the components.',color:0x78acbd},
 resistor:{name:'Load resistor',description:'A replacement resistor. Use the power panel readings to calculate the circuit current.',color:0xcaa57c},
 slide:{name:'Specimen slide',description:'A prepared plant specimen. Insert it into the microscope and focus the image.',color:0x78c7ba}
};
export const needed=(s,id)=>id==='power'?['cell','switch','resistor'].filter(k=>!s.inventory?.includes(k)):id==='microscope'?['slide'].filter(k=>!s.inventory?.includes(k)):[];
export function explorationLocation(id){const c=containers.find(c=>c.id===id||c.items.some(k=>'take-'+k===id));return c?[c.x,c.z]:null;}
export function explorationAction(s,id){
 const opened=s.opened||[],inventory=s.inventory||[];
 const c=containers.find(c=>c.id===id);
 if(c){const isOpen=opened.includes(id);return {ok:true,state:{...s,opened:isOpen?opened.filter(k=>k!==id):[...opened,id]},message:isOpen?'Case closed.':'Case opened. Examine its contents.'};}
 const k=id.startsWith('take-')?id.slice(5):null,source=containers.find(c=>c.items.includes(k));
 if(!source)return null;
 if(!opened.includes(source.id))return {ok:false,state:s,message:'Open the case first.'};
 if(inventory.includes(k))return {ok:false,state:s,message:'Your team already collected this item.'};
 return {ok:true,state:{...s,inventory:[...inventory,k]},message:items[k].name+' added to shared inventory.'};
}
