import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['server/index.js'],{env:{...process.env,PORT:'4173'},stdio:'inherit'});
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:4173')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');await page.locator('#solo-mode').waitFor();
 await page.locator('#home-settings').click();await page.locator('#quality').selectOption('low');await page.locator('#settings-done').click();
 await page.locator('#solo-mode').click();assert.equal(await page.locator('[data-solo]').count(),6);await page.locator('#solo-practical').click();await page.locator('#start').click();await page.locator('#overlay').waitFor({state:'hidden'});
 await page.waitForFunction(()=>document.querySelector('#asset-status').textContent.startsWith('Blender models:'),{},{timeout:30000});
 await page.keyboard.down('w');await page.waitForTimeout(500);await page.keyboard.up('w');await page.waitForTimeout(300);
 assert.equal(await page.locator('#inventory-button').isVisible(),true);
 await page.locator('#crisis-hud').waitFor({state:'visible'});assert.match(await page.locator('#crisis-name').textContent(),/Containment/);await page.locator('#notebook').click();assert.match(await page.locator('#panel').textContent(),/Mission systems/);await page.locator('#close').click();
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
 assert.equal(await page.locator('#world').isVisible(),true);
 assert.deepEqual(errors,[]);
 const api=async(route,data={},token)=>{const r=await fetch('http://127.0.0.1:4173/api/escape/'+route,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data)});assert.ok(r.ok,route+' '+r.status);return r.json();};
 for(const scenario of ['lab','space','bio','chem','blackout','tomb']){const host=await api('create',{size:2,options:{scenario,difficulty:'standard'}});const a=await api('join',{pin:host.pin,name:'Student A'});await api('join',{pin:host.pin,name:'Student B'});await api('host',{action:'start'},host.token);const v=await api('view',{},a.token);assert.equal(v.scenario,scenario);assert.equal(v.phase,'playing');assert.equal(v.players.length,1);assert.equal(v.crisis.systems.length,4);await api('host',{action:'difficulty',intensity:'low',guidance:'off'},host.token);const changed=await api('view',{},a.token);assert.equal(changed.crisis.intensity,.45);assert.equal(changed.variant.repairProtocol,true);await api('host',{action:'end'},host.token);assert.equal((await api('view',{},a.token)).crisis.outcome,'stopped');}
 console.log('Browser solo smoke and all six multiplayer API scenarios passed');
}finally{await browser?.close();server.kill();}
