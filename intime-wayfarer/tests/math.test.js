import test from 'node:test';import assert from 'node:assert/strict';
import '../src/core/rng.js';import '../src/view/math.js';const I=globalThis.IT;
test('camera math exists',()=>assert.equal(typeof I.Camera,'function'));
test('projecting a ground point and unprojecting returns it',()=>{
 const c=new I.Camera();c.set({x:2,y:0,z:5},18,1.6);
 for(const p of [{x:0,z:0},{x:10,z:-7},{x:-13,z:20}]){const s=c.project(p.x,0,p.z,1000,625),q=c.ground(s.x,s.y,1000,625);assert.ok(Math.hypot(q.x-p.x,q.z-p.z)<1e-5);}
});
test('camera target projects to screen centre',()=>{const c=new I.Camera();c.set({x:4,y:0,z:9},20,2);const p=c.project(4,0,9,1000,500);assert.ok(Math.abs(p.x-500)<1e-5);assert.ok(Math.abs(p.y-250)<1e-5);});
