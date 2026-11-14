import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sources=['src/core/rng.js','src/core/world.js','src/core/simulation.js','src/view/math.js','src/view/renderer.js','src/view/audio.js','src/main.js'];
const css=fs.readFileSync(path.join(root,'src/style.css'),'utf8');
const runtime=sources.map(p=>'\n/* FILE: '+p+' */\n'+fs.readFileSync(path.join(root,p),'utf8')).join('\n');
if(/<\/script/i.test(runtime))throw Error('Unsafe closing script tag in source.');
const html=fs.readFileSync(path.join(root,'src/index.html'),'utf8').replace('/*__STYLE__*/',()=>css).replace('/*__RUNTIME__*/',()=>runtime);
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist/IN_TIME_PLAY.html'),html);fs.writeFileSync(path.join(root,'dist/index.html'),html);
console.log(`Built standalone HTML: ${Buffer.byteLength(html)} bytes; ${sources.length} runtime files; 0 external dependencies.`);
