import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/core/rng.js';
const IT = globalThis.IT;
test('recovered RNG adapter is present', () => assert.equal(typeof IT.SeededRng, 'function'));
test('same seed produces the same 1000 bounded values', () => {
  const a = new IT.SeededRng(2100), b = new IT.SeededRng(2100);
  for (let i=0;i<1000;i++) { const x=a.next(); assert.equal(x,b.next()); assert.ok(x>=0&&x<1); }
});
test('clone resumes the exact stream without sharing state', () => {
  const a=new IT.SeededRng(1); a.next(); const b=a.clone();
  assert.equal(a.next(),b.next()); a.next(); assert.notEqual(a.getState(), b.getState());
});
test('shuffle is a permutation and does not mutate its input', () => {
  const a=Array.from({length:12},(_,i)=>i), expected=[...a];
  const b=new IT.SeededRng(77).shuffle(a);
  assert.deepEqual(a,expected); assert.deepEqual([...b].sort((a,b)=>a-b),a); assert.notDeepEqual(a,b);
});
test('different seeds do not collapse into the same deck', () => {
  const variants = new Set(Array.from({length:50},(_,i)=>new IT.SeededRng(i).shuffle([0,1,2,3,4,5,6,7,8,9,10,11]).join(',')));
  assert.equal(variants.size,50);
});
test('generator validates inputs and preserves uint32 state', () => {
  assert.throws(()=>new IT.SeededRng(NaN));
  assert.throws(()=>new IT.SeededRng(3).nextInt(4,1));
  const r=new IT.SeededRng(-1);for(let i=0;i<10000;i++)r.next();
  assert.ok(r.getState()>=0&&r.getState()<=0xffffffff);
});
test('the separately recovered Tarot PRNG degeneracy is reproduced, not imported', () => {
  let state=123; const next=()=>{state^=state>>17;state^=state>>0;return state/0xffffffff;};
  assert.deepEqual([next(),next(),next()],[0,0,0]);
  const corrected=new IT.SeededRng(123);assert.notEqual(corrected.next(),corrected.next());
});
