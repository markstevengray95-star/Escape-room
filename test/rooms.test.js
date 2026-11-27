import test from 'node:test';import assert from 'node:assert/strict';import {createStore} from '../server/rooms.js';
const circuit=current=>({order:['cell','switch','resistor'],closed:true,current});
const answers={"microscope":{"objective":40,"focus":50,"specimen":"plant"},"indicator":{"indicator":"universal","tested":true,"classification":"acid"},"moments":{"distance":2,"force":6},"density":{"mass":true,"volume":true,"density":2.5},"equation":{"coefficients":[2,1,2]},"graph":{"first":0,"second":4,"halfLife":4}};
test('classroom teams, credentials, start and private snapshots',()=>{let now=1000;const s=createStore({clock:()=>now});const h=s.create(2),a=s.join(h.pin,'Alex'),b=s.join(h.pin,'Sam'),c=s.join(h.pin,'Jo');assert.equal(s.view(a.token).team,1);assert.equal(s.view(b.token).team,1);assert.equal(s.view(c.token).team,2);assert.equal(s.view(a.token).players.length,1);assert.equal(s.view(a.token).variant.current,undefined);assert.equal(s.view(a.token).variant.suffix,undefined);assert.throws(()=>s.host(a.token,'start'));assert.throws(()=>s.view(h.pin));s.host(h.token,'start');assert.throws(()=>s.join(h.pin,'Late'));assert.equal(s.view(b.token).phase,'playing');assert.throws(()=>s.action(a.token,'exit'));now+=901000;assert.equal(s.view(a.token).phase,'ended');});
test('shared drawer and note, reconnect, team isolation and position checks',()=>{let now=1000;const s=createStore({clock:()=>now});const h=s.create(2),a=s.join(h.pin,'A'),b=s.join(h.pin,'B'),c=s.join(h.pin,'C');s.host(h.token,'start');now+=1500;s.position(a.token,{x:-4,z:-1.5,yaw:0});assert.equal(s.action(a.token,'drawer').ok,true);assert.equal(s.view(b.token).state.drawer,true);now+=500;assert.equal(s.action(a.token,'note').ok,true);assert.equal(s.view(b.token).state.note,true);assert.equal(s.view(c.token).state.note,false);assert.match(s.view(b.token).variant.suffix,/^\d{2}$/);assert.ok(Math.abs(s.view(a.token).position.z+1.5)<1e-8);s.host(h.token,'end');assert.throws(()=>s.action(a.token,'drawer'));});
test('server rejects cross-team state and invalid teacher access',()=>{const s=createStore();const h=s.create(3),a=s.join(h.pin,'A');assert.throws(()=>s.host(a.token,'end'));assert.throws(()=>s.action(h.token,'drawer'));assert.throws(()=>s.view('fake'));});

test('complete multiplayer escape with distinct team answer and shared win',()=>{let now=1000;const s=createStore({clock:()=>now});const h=s.create(2),a=s.join(h.pin,'A'),b=s.join(h.pin,'B');s.host(h.token,'start');
function go(x,z){now+=2000;s.position(a.token,{x,z,yaw:0});}
go(-4,-1.5);assert.equal(s.action(a.token,'drawer').ok,true);now+=500;assert.equal(s.action(a.token,'note').ok,true);
go(-.4,2.7);const v=s.view(a.token).variant;assert.equal(s.action(a.token,'power','999').ok,false);now+=500;assert.equal(s.action(a.token,'power',circuit(String(v.voltage/v.resistance))).ok,true);
go(1,0);const q=s.view(a.token).variant;assert.equal(s.action(a.token,'door',String(q.current)+q.suffix).ok,true);
go(5,0);assert.equal(s.action(a.token,'exit').ok,false);
for(const [id,x,z] of [['density',4.2,3.7],['equation',5,3],['graph',5,-1.8]]){go(x,z);assert.equal(s.action(a.token,id,answers[id]).ok,true);}
go(3,0);go(0,0);go(.7,-3.7);assert.equal(s.action(a.token,'moments',answers.moments).ok,true);
go(-3,-1);go(-4.6,-.5);assert.equal(s.action(a.token,'microscope',answers.microscope).ok,true);
go(-4.6,3.7);assert.equal(s.action(a.token,'indicator',answers.indicator).ok,true);
go(0,0);go(4,0);go(5,0);assert.equal(s.action(a.token,'exit').ok,true);assert.equal(s.view(b.token).state.escaped,true);});
