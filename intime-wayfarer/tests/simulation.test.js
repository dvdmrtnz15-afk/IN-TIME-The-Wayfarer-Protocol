import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/core/rng.js';
import '../src/core/world.js';
import '../src/core/simulation.js';
const IT=globalThis.IT;
test('a playable simulation API exists',()=>{
  for(const name of ['createGame','step','rewind','interact','choose','saveGame','loadGame','findPath','verifyLedger']) assert.equal(typeof IT[name],'function',name);
});
test('a new game starts with time, position and three linked puzzles',()=>{
  const g=IT.createGame(2100);assert.equal(g.stage,0);assert.equal(g.remaining,21600);assert.equal(g.mode,'playing');assert.equal(IT.WORLD.gates.length,3);assert.equal(g.echoes.length,0);
});
test('fixed steps move and equal inputs reproduce identical states',()=>{
 const a=IT.createGame(7),b=IT.createGame(7);
 for(let i=0;i<120;i++){IT.step(a,{x:1,z:0});IT.step(b,{x:1,z:0});}
 assert.ok(a.player.x>0);assert.deepEqual(a,b);
});
test('pausing and dialogue do not advance the simulation clock',()=>{
 const g=IT.createGame(7);g.mode='paused';IT.step(g,{x:1});assert.equal(g.totalTick,0);
 g.mode='dialogue';IT.step(g,{});assert.equal(g.totalTick,0);
});
test('diagonal input is normalized, not faster',()=>{
 const a=IT.createGame(5),b=IT.createGame(5);for(let i=0;i<30;i++){IT.step(a,{x:1,z:0});IT.step(b,{x:1,z:1});}
 assert.ok(Math.abs(Math.hypot(a.player.x,a.player.z-18)-Math.hypot(b.player.x,b.player.z-18))<1e-7);
});
test('rewind returns to anchor and records an echo without restoring global time',()=>{
 const g=IT.createGame(1);for(let i=0;i<100;i++)IT.step(g,{x:1,z:0}); const time=g.remaining,end=g.player.x;
 assert.equal(IT.rewind(g),true);assert.equal(g.player.x,0);assert.equal(g.remaining,time);assert.equal(g.echoes.length,1);
 for(let i=0;i<110;i++)IT.step(g,{});assert.ok(Math.abs(g.echoes[0].pos.x-end)<1e-8);assert.equal(g.echoes[0].holding,true);
});
test('stationary recordings can hold a plate; too-short echoes are refused',()=>{
 const g=IT.createGame(3);assert.equal(IT.rewind(g),false);for(let i=0;i<40;i++)IT.step(g,{});assert.equal(IT.rewind(g),true);
});
test('echo count is bounded and identifiers never reuse',()=>{
 const g=IT.createGame(3);for(let j=0;j<4;j++){for(let i=0;i<35;i++)IT.step(g,{});IT.rewind(g);}
 assert.equal(g.echoes.length,2);assert.deepEqual(g.echoes.map(e=>e.id),[3,4]);
});
test('closed gates and walls block real movement',()=>{
 const g=IT.createGame(3);g.player.x=-17;g.player.z=6;
 for(let i=0;i<80;i++)IT.step(g,{x:0,z:-1});assert.ok(g.player.z>4.6);assert.equal(g.stage,0);
});
test('A* rejects blocked destinations and produces a reachable exterior path',()=>{
 const g=IT.createGame(3);assert.equal(IT.findPath(g,{x:-18,z:-10}),null);
 const path=IT.findPath(g,{x:-20,z:12});assert.ok(path.length>0);assert.ok(path.every(p=>!IT.blocked(g,p.x,p.z)));
});
test('unavailable final choices cannot bypass the puzzles',()=>{
 const g=IT.createGame(3);assert.equal(IT.choose(g,'restore'),false);assert.equal(g.mode,'playing');assert.equal(g.stage,0);
});
test('save and reload preserve the complete in-progress temporal state',()=>{
 const g=IT.createGame(22);for(let i=0;i<90;i++)IT.step(g,{x:1,z:0});IT.rewind(g);for(let i=0;i<50;i++)IT.step(g,{x:0,z:-1});
 const loaded=IT.loadGame(IT.saveGame(g));assert.deepEqual(loaded,g);IT.step(g,{});IT.step(loaded,{});assert.deepEqual(loaded,g);
});
test('corrupt, changed, oversize and wrong-version saves are rejected',()=>{
 assert.throws(()=>IT.loadGame('{'));const g=IT.createGame(11),raw=JSON.parse(IT.saveGame(g));raw.state.stage=3;
 assert.throws(()=>IT.loadGame(JSON.stringify(raw)));raw.version=99;assert.throws(()=>IT.loadGame(JSON.stringify(raw)));
 assert.throws(()=>IT.loadGame('x'.repeat(4_000_001)));
});
test('event verification detects modification and removes no history on rewind',()=>{
 const g=IT.createGame(1);const count=g.ledger.length;for(let i=0;i<40;i++)IT.step(g,{});IT.rewind(g);
 assert.ok(g.ledger.length>count);assert.equal(IT.verifyLedger(g.ledger),true);g.ledger[0].kind='altered';assert.equal(IT.verifyLedger(g.ledger),false);
});
test('time expiration leads to a retryable failure, not an unresponsive game',()=>{
 const g=IT.createGame(33);g.remaining=1;IT.step(g,{});assert.equal(g.mode,'failed');IT.retry(g);assert.equal(g.mode,'playing');assert.equal(g.remaining,21600);
});
test('memory identifiers cannot resolve through Object prototype properties',()=>{
 for(const id of ['__proto__','constructor','toString']){
  const e=JSON.parse(IT.saveGame(IT.createGame(1)));e.state.facts.fragments=[id];e.checksum=IT.checksum(e.state);
  assert.throws(()=>IT.loadGame(JSON.stringify(e)),id);
 }
});
