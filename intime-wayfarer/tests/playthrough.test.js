import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/core/rng.js';import '../src/core/world.js';import '../src/core/simulation.js';
const I=globalThis.IT;
function walk(g,target){
 const path=I.findPath(g,target);assert.ok(path,'reachable '+JSON.stringify(target));
 for(const p of path){let n=0;while(Math.hypot(p.x-g.player.x,p.z-g.player.z)>.16){
  const dx=p.x-g.player.x,dz=p.z-g.player.z,d=Math.hypot(dx,dz);I.step(g,{x:dx/d,z:dz/d,sprint:true,pulse:g.stage>0&&g.totalTick>=g.pulseReadyAt});
  assert.equal(g.mode,'playing','game remains playable at '+JSON.stringify(p));assert.ok(n++<140,'movement reaches waypoint');
 }}
}
function waitEcho(g){const duration=Math.max(...g.echoes.map(e=>e.path.at(-1)[0]));while(g.loopTick<duration+2)I.step(g,{});}
function stage(g){
 const gate=I.WORLD.gates[g.stage];
 for(const id of gate.plates){walk(g,I.WORLD.plates.find(p=>p.id===id));assert.ok(I.rewind(g));}
 waitEcho(g);assert.ok(I.gateOpen(g,gate));
}
function finish(seed=2100,choice='restore',withMemories=true){
 const g=I.createGame(seed);
 for(let s=0;s<3;s++){
  stage(g);
  if(withMemories){walk(g,I.WORLD.nodes.find(n=>n.id==='memory-'+(s+1)));assert.ok(I.interact(g));assert.equal(g.mode,'dialogue');I.choose(g,'close');}
  walk(g,I.WORLD.nodes.find(n=>n.id===I.WORLD.gates[s].id));assert.ok(I.interact(g));
  assert.equal(g.mode,'dialogue');I.choose(g,s===2?choice:'close');
 }
 return g;
}
test('a complete input-driven route reaches the three-memory restored-city ending',()=>{
 const g=finish();assert.equal(g.mode,'ended');assert.equal(g.ending,'home');assert.equal(g.facts.fragments.length,3);assert.ok(g.remaining>0);assert.ok(I.verifyLedger(g.ledger));
});
test('a full playthrough can carry the signal instead',()=>{const g=finish(2,'depart',false);assert.equal(g.ending,'signal');});
test('restoring without memories yields the distinct light epilogue',()=>{const g=finish(18,'restore',false);assert.equal(g.ending,'light');});
test('all twelve test seeds admit an input-driven winning route',()=>{
 for(let seed=1;seed<=12;seed++)assert.equal(finish(seed,'restore',false).mode,'ended','seed '+seed);
});
test('landmarks survive rewind and their earlier gates stay open',()=>{
 const g=I.createGame(2);stage(g);walk(g,{x:-18,z:-10});I.interact(g);I.choose(g,'close');
 assert.equal(g.stage,1);for(let i=0;i<40;i++)I.step(g,{});I.rewind(g);assert.ok(g.facts.relay);assert.ok(I.gateOpen(g,I.WORLD.gates[0]));
});
test('memory can be collected only once even after rewind',()=>{
 const g=I.createGame(2);stage(g);walk(g,{x:-25,z:-13});I.interact(g);I.choose(g,'close');const count=g.ledger.filter(e=>e.kind==='MEMORY_ANCHORED').length;
 I.interact(g);assert.equal(g.facts.fragments.length,1);assert.equal(g.ledger.filter(e=>e.kind==='MEMORY_ANCHORED').length,count);
});
test('schema validation rejects inconsistent data even with a recomputed checksum',()=>{
 const pristine=JSON.parse(I.saveGame(I.createGame(1)));
 for(const mutate of [g=>g.facts.relay=true,g=>g.deck[0]=g.deck[1],g=>g.player.x=Infinity,g=>g.record[0][0]=2,g=>g.echoes=[{id:1}],g=>g.ending='home',g=>g.notice=null]){
  const e=structuredClone(pristine);mutate(e.state);e.checksum=I.checksum(e.state);assert.throws(()=>I.loadGame(JSON.stringify(e)));
 }
});
test('an exported ending reloads exactly',()=>{const g=finish(7);assert.deepEqual(I.loadGame(I.saveGame(g)),g);});
