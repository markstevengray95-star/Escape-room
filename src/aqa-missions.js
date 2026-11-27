// Original questions mapped to AQA GCSE Combined Science: Trilogy (8464).
// Shared Foundation/Higher content; no separate-science-only content.
export const specRefs={B:{cells:'4.1',organisation:'4.2',infection:'4.3',bioenergetics:'4.4',homeostasis:'4.5',inheritance:'4.6',ecology:'4.7'},C:{atomic:'5.1',bonding:'5.2',quantitative:'5.3',chemical:'5.4',energy:'5.5',rates:'5.6',organic:'5.7',analysis:'5.8',atmosphere:'5.9',resources:'5.10'},P:{energy:'6.1',electricity:'6.2',particle:'6.3',atomic:'6.4',forces:'6.5',waves:'6.6',magnetism:'6.7'},W:{practical:'3'}};
export const missionCatalog={
 lab:{focus:'Mixed science',papers:'Biology 1 · Chemistry 1/2 · Physics 1/2',description:'Cells, pH, reactions, density, energy and investigative skills.',color:'#80d4bd'},
 space:{focus:'Physics & biology',papers:'Physics 1/2 · Biology 1',description:'Forces, energy, waves, density, respiration and photosynthesis.',color:'#8eb9e8'},
 bio:{focus:'Biology',papers:'Biology 1/2',description:'Cells, enzymes, infection, osmosis, respiration and inheritance.',color:'#9bd3a7'},
 chem:{focus:'Chemistry',papers:'Chemistry 1/2',description:'Atoms, bonding, pH, mass conservation, rates and chromatography.',color:'#e1bc7b'},
 blackout:{focus:'Physics',papers:'Physics 1/2',description:'Circuits, resistance, power, energy, electromagnets and forces.',color:'#e0a365'},
 tomb:{focus:'Physics & chemistry',papers:'Physics 1/2 · Chemistry 2',description:'Density, energy, forces, radiation, waves and separation.',color:'#cba87a'}
};
const rows={
 lab:[
 ['microscope','B','cells','A microscope image is 12 mm wide at ×300 magnification. What is its actual width?','40 µm','4 µm','400 µm','3600 µm','12 ÷ 300 = 0.04 mm = 40 µm.'],
 ['indicator','C','chemical','The safety monitor records pH 3. How should the sample be classified?','Acidic','Neutral','Alkaline','Pure water','A pH below 7 is acidic.'],
 ['equation','C','quantitative','A sealed container holds 18 g of reactants. What total mass of products should the balance record?','18 g','9 g','36 g','0 g','Mass is conserved in a closed system.'],
 ['density','P','particle','A sample has mass 72 g and volume 24 cm³. Calculate its density.','3 g/cm³','0.33 g/cm³','48 g/cm³','1728 g/cm³','Density = mass ÷ volume = 72 ÷ 24.'],
 ['osmosis','B','cells','Which substance moves through a partially permeable membrane during osmosis?','Water','Starch','Protein','Cellulose','Osmosis is the net movement of water through a partially permeable membrane.'],
 ['energy','P','energy','A device transfers 400 J of energy and delivers 300 J usefully. What is its efficiency?','75%','25%','100%','133%','Useful energy ÷ total energy × 100 = 75%.'],
 ['graph','P','atomic','Activity falls from 80 Bq to 20 Bq in 12 minutes. What is the half-life?','6 minutes','3 minutes','12 minutes','24 minutes','Two halvings take 12 minutes.'],
 ['variables','W','practical','To investigate how temperature affects reaction time, which is the independent variable?','Temperature','Reaction time','Volume kept constant','Mean reaction time','The independent variable is the one deliberately changed.']],
 space:[
 ['moments','P','forces','A 50 kg cargo module experiences a resultant force of 150 N. What is its acceleration?','3 m/s²','0.33 m/s²','200 m/s²','7500 m/s²','F = ma, so a = 150 ÷ 50.'],
 ['indicator','B','bioenergetics','Which gas is required by crew cells for aerobic respiration?','Oxygen','Nitrogen','Carbon dioxide','Hydrogen','Aerobic respiration requires oxygen.'],
 ['energy','P','energy','A 250 W solar supply operates for 40 s. How much energy is transferred?','10,000 J','290 J','6.25 J','250 J','E = Pt = 250 × 40.'],
 ['density','P','particle','A cargo sample has mass 180 g and volume 60 cm³. Calculate its density.','3 g/cm³','0.33 g/cm³','120 g/cm³','10,800 g/cm³','Density = mass ÷ volume.'],
 ['microscope','B','bioenergetics','Which cell structure absorbs light for photosynthesis in the plant module?','Chloroplast','Nucleus','Ribosome','Cell membrane','Chloroplasts contain chlorophyll.'],
 ['equation','P','energy','A heater transfers 900 J, of which 630 J is useful. Calculate efficiency.','70%','30%','90%','143%','630 ÷ 900 × 100 = 70%.'],
 ['graph','P','forces','A craft changes velocity from 4 to 12 m/s in 4 s. Calculate acceleration.','2 m/s²','4 m/s²','8 m/s²','3 m/s²','Acceleration = change in velocity ÷ time = 8 ÷ 4.'],
 ['variables','P','waves','Which waves can carry a signal through the vacuum of space?','Electromagnetic waves','Sound waves','Water waves','Seismic waves','Electromagnetic waves can travel without a medium.']],
 bio:[
 ['microscope','B','cells','Which structure is present in a typical plant cell but absent from an animal cell?','Cellulose cell wall','Cell membrane','Nucleus','Ribosome','Plant cells have a cellulose cell wall.'],
 ['indicator','B','infection','Which type of pathogen can be treated with a suitable antibiotic?','Bacterium','Virus','All fungi','All protists','Antibiotics treat bacterial infections, not viral infections.'],
 ['moments','B','organisation','Why does an enzyme lose activity above its optimum temperature?','Its active site changes shape','It becomes a sugar','Its mass doubles','It becomes a substrate','High temperatures can denature enzymes.'],
 ['osmosis','B','cells','A plant cell is placed in pure water. In which direction is net water movement?','Into the cell','Out of the cell','Only through the nucleus','No movement','Water enters by osmosis.'],
 ['equation','B','bioenergetics','Which process releases energy from glucose in living cells?','Respiration','Osmosis','Photosynthesis','Transpiration','Respiration is an exothermic process in cells.'],
 ['separation','B','organisation','Which enzyme group breaks down proteins?','Proteases','Lipases','Amylases','Carbohydrases','Proteases catalyse protein digestion.'],
 ['energy','B','bioenergetics','Which factor can limit photosynthesis in a plant culture?','Light intensity','Colour of the bench','Shape of the label','Number of doors','Light provides energy for photosynthesis.'],
 ['graph','B','inheritance','Which structure contains most chromosomes in a typical animal cell?','Nucleus','Ribosome','Cell membrane','Vacuole','Chromosomes containing DNA are in the nucleus.']],
 chem:[
 ['microscope','C','bonding','Which particles carry charge in a molten ionic compound?','Mobile ions','Neutrons','Fixed ions','Neutral molecules','Ions are free to move when molten.'],
 ['indicator','C','chemical','Universal indicator shows pH 11. What does this mean?','Alkaline','Acidic','Neutral','No ions present','A pH above 7 is alkaline.'],
 ['moments','C','quantitative','In a sealed vessel, 32 g of reactants are completely converted to products. Total product mass?','32 g','16 g','64 g','0 g','Total mass is conserved.'],
 ['osmosis','C','atomic','An atom has 13 protons. What is its atomic number?','13','26','0','Depends on neutrons','Atomic number is the number of protons.'],
 ['equation','C','chemical','What is produced when an acid reacts with a metal carbonate?','Salt, water and carbon dioxide','Salt and oxygen only','Water and nitrogen only','Hydrogen and oxygen only','The products are salt, water and carbon dioxide.'],
 ['energy','C','energy','A reaction causes the surroundings to warm up. How is it classified?','Exothermic','Endothermic','Always reversible','Neutral','Exothermic reactions transfer energy to the surroundings.'],
 ['graph','C','rates','Why does a higher temperature usually increase reaction rate?','More particles have enough energy to react','Activation energy always rises','Particles stop moving','Reactants gain mass','A greater proportion of collisions have sufficient energy.'],
 ['separation','C','analysis','Which method separates the different soluble dyes in a sample of ink?','Chromatography','Sieving','Magnetic separation','Filtration only','Chromatography separates dissolved substances.']],
 blackout:[
 ['microscope','P','magnetism','Which change strengthens the magnetic field of an electromagnet?','Increase the current','Disconnect the current','Remove all coil turns','Replace the iron core with wood','Increasing current increases field strength.'],
 ['indicator','P','electricity','Which material normally conducts electricity best?','Copper','Rubber','Glass','Dry wood','Metals such as copper have mobile electrons.'],
 ['moments','P','forces','A resultant force of 24 N acts on a 6 kg component. Calculate acceleration.','4 m/s²','144 m/s²','18 m/s²','0.25 m/s²','a = F ÷ m = 24 ÷ 6.'],
 ['density','P','electricity','A component transfers 240 J in 12 s. Calculate its power.','20 W','2880 W','228 W','0.05 W','Power = energy ÷ time.'],
 ['equation','P','electricity','Two 5 Ω resistors are in series. Calculate total resistance.','10 Ω','2.5 Ω','5 Ω','25 Ω','Series resistances add.'],
 ['energy','P','energy','A 400 W motor runs for 30 s. Calculate the energy transferred.','12,000 J','430 J','13.3 J','400 J','Energy = power × time.'],
 ['graph','P','energy','The output is 450 J useful energy from 600 J input. Calculate efficiency.','75%','25%','133%','45%','450 ÷ 600 × 100 = 75%.'],
 ['spectrum','P','waves','Which electromagnetic radiation is detected by a thermal imaging camera?','Infrared','Ultraviolet','Gamma','Radio only','Warm objects emit infrared radiation.']],
 tomb:[
 ['microscope','P','waves','What is the change in direction of light when it enters glass called?','Refraction','Reflection','Evaporation','Diffusion','Light changes speed at the boundary and can refract.'],
 ['indicator','C','analysis','Which method separates insoluble sand from water?','Filtration','Chromatography','Evaporation only','Electrolysis','The filter retains insoluble sand.'],
 ['moments','P','forces','A 40 N force moves a stone 3 m in the direction of the force. Calculate work done.','120 J','13.3 J','43 J','37 J','Work done = force × distance.'],
 ['density','P','particle','An artefact has mass 240 g and volume 80 cm³. Calculate density.','3 g/cm³','0.33 g/cm³','160 g/cm³','19,200 g/cm³','Density = mass ÷ volume.'],
 ['equation','P','energy','A 5 kg object is raised 2 m. Use g = 10 N/kg. Calculate the gain in gravitational potential energy.','100 J','25 J','10 J','50 J','E = mgh = 5 × 10 × 2.'],
 ['energy','P','energy','Which energy store increases when a spring is stretched?','Elastic potential','Chemical','Nuclear','Magnetic','A stretched spring stores elastic potential energy.'],
 ['graph','P','atomic','An artefact sample has activity 160 Bq. What remains after two half-lives?','40 Bq','80 Bq','20 Bq','160 Bq','160 halves to 80 and then 40 Bq.'],
 ['separation','C','analysis','Which method can recover a dissolved solid from a solution?','Crystallisation','Sieving','Filtration only','Magnetic separation','Crystallisation forms solid crystals from a solution.']]
};
export function aqaQuestions(id){return (rows[id]||[]).map(([station,subject,topic,prompt,correct,a,b,c,explanation],i)=>({id:'aqa-'+id+'-'+i,station,subject,topic,spec:specRefs[subject][topic],level:'aqa-common',prompt,correct,choices:[correct,a,b,c],explanation}));}
export function assignAqaMission(id,randomInt=(a,b)=>a+Math.floor(Math.random()*(b-a))){const pool=aqaQuestions(id);if(!pool.length)throw Error('Unknown AQA mission.');const questions=Object.fromEntries(pool.map(q=>{const choices=[...q.choices];for(let i=choices.length-1;i>0;i--){const j=randomInt(0,i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}return [q.station,{...q,choices}];}));return {requiredIds:Object.keys(questions),questions,gateRequires:['microscope','indicator','equation'].filter(id=>Object.hasOwn(questions,id))};}
