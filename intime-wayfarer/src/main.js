/* Browser adapter. Input -> fixed simulation -> view. No network calls.
 * Accessible DOM text is assigned with textContent. Canvas contains the 3D world.
 * The ?qa=1 interface accelerates normal input only; it cannot skip gate checks. */
(() => {
 'use strict';const I=globalThis.IT,$=id=>document.getElementById(id),KEY='intime.wayfarer.save.v1',SETTINGS='intime.wayfarer.settings.v1';
 let game=I.createGame(2100),started=false,modal=null,modalRestore=null,lastMode='',lastNotice=-1,lastDialogue='',lastLedger=0,storageOK=true,saved=null,path=[],pointer={x:0,z:0},keys=new Set(),lastFocus=null;
 let preferences={reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,low:false};
 try{const p=JSON.parse(localStorage.getItem(SETTINGS)||'null');if(p&&typeof p.reduced==='boolean'&&typeof p.low==='boolean')preferences=p;}catch{}
 const sound=new I.Sound();let view;
 try{view=new I.Renderer($('world'),$('atmosphere'));}catch(e){$('render-error').hidden=false;$('render-error-text').textContent=e.message;return;}
 function setPreferences(){view.low=preferences.low;document.body.classList.toggle('low-effects',preferences.reduced);try{localStorage.setItem(SETTINGS,JSON.stringify(preferences));}catch{}}
 setPreferences();
 let toastTimer;
 function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),5000);}
 try{const raw=localStorage.getItem(KEY);if(raw){try{saved=I.loadGame(raw);$('continue').hidden=false;}catch{toast('The saved timeline could not be read. Start a new timeline or load a backup.');}}}catch{storageOK=false;toast('Automatic saves are unavailable in this preview. Export a save from the pause menu to keep your timeline.');}
 function persist(){
  if(!started)return;try{localStorage.setItem(KEY,I.saveGame(game));storageOK=true;}catch{if(storageOK)toast('Browser storage is unavailable. Use Export save in the pause menu.');storageOK=false;}
 }
 function clearInput(){keys.clear();pointer={x:0,z:0};path=[];$('stick').style.transform='';}
 function start(resume=false){
  closeModal(true);game=resume&&saved?I.loadGame(I.saveGame(saved)):I.createGame(2100);
  if(game.mode==='paused')game.mode='playing';started=true;lastMode='';lastNotice=-1;lastDialogue='';lastLedger=game.ledger.length;path=[];
  $('title-screen').hidden=true;$('hud').hidden=false;document.body.classList.remove('session-paused');sound.tone('click');persist();updateUI();
 }
 function saveDownload(){try{const blob=new Blob([I.saveGame(game)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='IN-TIME-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Save exported. Keep it with your game file.');}catch(e){toast(e.message);}}
 function importSave(){$('save-input').value='';$('save-input').click();}
 $('save-input').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;if(file.size>4_000_000){toast('That save exceeds the 4 MB limit.');return;}
  try{const loaded=I.loadGame(await file.text());saved=loaded;$('continue').hidden=false;start(true);toast('Timeline loaded. All echoes and anchored memories restored.');}catch(err){toast('Could not load: '+err.message);}
 });
 $('begin').onclick=()=>start(false);$('continue').onclick=()=>start(true);$('title-import').onclick=importSave;
 for(const b of document.querySelectorAll('.sound-toggle'))b.onclick=async()=>{try{const on=await sound.toggle();for(const el of document.querySelectorAll('.sound-toggle')){el.textContent=on?'Sound on':'Sound off';el.setAttribute('aria-pressed',String(on));}}catch{toast('Audio is not available in this browser. The game is fully playable without it.');}};
 function button(label,fn,cls=''){const b=document.createElement('button');b.textContent=label;b.className=cls;b.onclick=fn;return b;}
 function beginModal(kind,kicker,title){
  if(!modal){lastFocus=document.activeElement;modalRestore=game.mode;if(started&&game.mode==='playing')game.mode='paused';}
  modal=kind;clearInput();$('modal-kicker').textContent=kicker;$('modal-title').textContent=title;$('modal-content').replaceChildren();$('modal-backdrop').hidden=false;$('modal-close').hidden=['failed','ended'].includes(kind);document.body.classList.toggle('session-paused',started);$('modal-close').focus();
 }
 function closeModal(force=false){
  if(!modal)return;if(!force&&['failed','ended'].includes(modal))return;
  if(started&&game.mode==='paused'&&modalRestore==='playing')game.mode='playing';modal=null;modalRestore=null;$('modal-backdrop').hidden=true;document.body.classList.remove('session-paused');clearInput();if(lastFocus?.isConnected)lastFocus.focus();
 }
 $('modal-close').onclick=()=>closeModal();
 function settings(parent){
  const row=document.createElement('div');row.className='setting-row';
  for(const [id,label] of [['reduced','Reduced motion'],['low','Low-effects mode']]){const l=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=preferences[id];input.onchange=()=>{preferences[id]=input.checked;setPreferences();};l.append(input,document.createTextNode(label));row.append(l);}
  row.append(button(sound.enabled?'Sound on':'Sound off',async e=>{try{await sound.toggle();e.target.textContent=sound.enabled?'Sound on':'Sound off';}catch{toast('Audio unavailable.');}},'quiet-button'));
  parent.append(row);
 }
 function pause(){
  if(!started||['failed','ended'].includes(game.mode))return;if(modal){closeModal();return;}beginModal('pause','THE CITY CAN WAIT','A moment outside time.');
  const p=document.createElement('p');p.textContent='Your timeline is paused. Checkpoints and memories survive a retry. A new timeline starts the entire night again.';$('modal-content').append(p);
  const actions=document.createElement('div');actions.className='menu-actions';
  actions.append(button('Return to the city',()=>closeModal(),'wide warm'),button('District map',map),button('How to play',help),button('Export save',saveDownload),button('Load a save',importSave),button('Retry this checkpoint',()=>{closeModal(true);I.retry(game);persist();updateUI();}),button('Start a new timeline',confirmNew),button('Save & return to title',returnTitle,'wide subtle'));
  $('modal-content').append(actions);settings($('modal-content'));persist();
 }
 function confirmNew(){beginModal('confirm','NEW TIMELINE','Begin again?');const p=document.createElement('p');p.textContent='This replaces the current local save. Export your timeline first to keep it. All landmarks, echoes and memories reset.';$('modal-content').append(p);const a=document.createElement('div');a.className='modal-actions';a.append(button('Start new timeline',()=>start(false)),button('Export current save',saveDownload),button('Keep this timeline',()=>closeModal()));$('modal-content').append(a);}
 function returnTitle(){persist();saved=I.loadGame(I.saveGame(game));if(saved.mode==='paused')saved.mode='playing';closeModal(true);started=false;$('hud').hidden=true;$('dialogue-panel').hidden=true;$('title-screen').hidden=false;$('continue').hidden=false;document.body.classList.remove('in-dialogue');clearInput();}
 function help(){
  beginModal('help','FIELD GUIDE','Your past is a partner.');
  $('modal-content').innerHTML='<div class="guide-grid"><div><kbd>WASD</kbd><h3>Walk into the world.</h3><p>Use WASD or arrows. Hold Shift to run. Click the ground to walk there. On touch screens, use the joystick. Golden circles are pressure plates.</p></div><div><kbd>Q</kbd><h3>Leave an echo.</h3><p>Walk to a plate. Stop in its centre. Press Q or ECHO to rewind to your checkpoint. Your echo repeats the route, then stays exactly where you stopped.</p></div><div><kbd>II + III</kbd><h3>Two pasts. One present.</h3><p>Record a second plate, then rewind again. Both echoes now replay together. Wait for them to arrive, then pass the open gate. A third echo replaces the oldest.</p></div><div><kbd>E / SPACE</kbd><h3>Keep what matters.</h3><p>E interacts with people, memories and terminals. Space pulses the anomalies still. Restore landmarks to anchor progress. The six-minute city clock never rewinds, but menus and dialogue pause it.</p></div></div><p><strong>Stuck?</strong> Use the district map. If a gate is closed, check that its plates have turned mint. Echoes may still be walking. A retry preserves completed landmarks. Three optional memories change the restored-city epilogue.</p>';
  const a=document.createElement('div');a.className='modal-actions';a.append(button(started?'Return to the city':'Back to the night',()=>closeModal()));$('modal-content').append(a);settings($('modal-content'));
 }
 function map(){
  if(!started)return;beginModal('map','DISTRICT / 2100','Find the next light.');
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.classList.add('district-map');svg.setAttribute('viewBox','-35 -32 70 63');svg.setAttribute('role','img');svg.setAttribute('aria-label','District map: Relay west, Archive east, Last Light north. Plates marked I to V.');
  function shape(type,attrs){const e=document.createElementNS(ns,type);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);svg.append(e);return e;}
  for(const wall of I.WORLD.walls)shape('rect',{x:wall.x-wall.w/2,y:wall.z-wall.d/2,width:wall.w,height:wall.d,fill:'#47616a'});
  for(const gate of I.WORLD.gates)shape('rect',{x:gate.x-2,y:gate.z-.4,width:4,height:.8,fill:I.gateOpen(game,gate)?'#8cdec4':'#dda96d'});
  for(const p of I.WORLD.plates){shape('circle',{cx:p.x,cy:p.z,r:1.4,fill:'none',stroke:I.plateActive(game,p)?'#8cdec4':'#dda96d','stroke-width':.28});const l=shape('text',{x:p.x,y:p.z+3.2,fill:'#d6c8a6','font-size':2,'text-anchor':'middle'});l.textContent=p.label;}
  for(const n of I.WORLD.nodes.filter(x=>x.type==='terminal')){shape('circle',{cx:n.x,cy:n.z,r:.85,fill:game.facts[n.id]?'#8cdec4':'#dda96d'});const l=shape('text',{x:n.x,y:n.z-3,fill:'#e5d9ba','font-size':2.2,'text-anchor':'middle'});l.textContent=n.id.toUpperCase();}
  for(const n of I.WORLD.nodes.filter(x=>x.type==='memory'&&!game.facts.fragments.includes(x.id)))shape('circle',{cx:n.x,cy:n.z,r:.5,fill:'#91e8dd'});
  for(const e of game.echoes)shape('circle',{cx:e.pos.x,cy:e.pos.z,r:.8,fill:'#6fbbaa'});
  shape('circle',{cx:game.player.x,cy:game.player.z,r:1,fill:'#fff0bf'});shape('circle',{cx:game.player.x,cy:game.player.z,r:1.8,fill:'none',stroke:'#fff0bf','stroke-width':.15});
  $('modal-content').append(svg);const cap=document.createElement('div');cap.className='map-caption';cap.innerHTML='<span><b>GOLD</b> · pressure plates / terminals</span><span><b>MINT</b> · active / memories</span><span><b>WHITE</b> · you</span>';$('modal-content').append(cap);
  const p=document.createElement('p');p.textContent=I.objective(game)[1]+' End each recording inside its plate. After the final rewind, wait for both echoes to arrive.';$('modal-content').append(p);
  const a=document.createElement('div');a.className='modal-actions';a.append(button('Return to the city',()=>closeModal()),button('Read the field guide',help));$('modal-content').append(a);
 }
 function finishPanel(failed=false){
  if(modal=== (failed?'failed':'ended'))return;
  if(failed){beginModal('failed','THE TIMELINE COLLAPSED','This is not the end.');const p=document.createElement('p');p.textContent=game.remaining===0?'The six minutes are gone. Your restored landmarks and collected memories remain. Retry from the current checkpoint.':'The anomalies overwhelmed your stability. Use a pulse to pass them, or give them more space. Your anchored progress remains.';$('modal-content').append(p);const a=document.createElement('div');a.className='modal-actions';a.append(button('Retry checkpoint',()=>{closeModal(true);I.retry(game);persist();updateUI();}),button('Start new timeline',()=>start(false)),button('Return to title',returnTitle));$('modal-content').append(a);sound.tone('fail');return;}
  const endings={light:['01 / THE LIGHT RETURNS','A city, not yet a home.','The lamps come back, one street at a time. You saved the district. Somewhere in its quiet rooms, three memories still wait to be found.'],home:['02 / WHAT STILL MATTERS','Everyone has a way home.','The city wakes with its names intact. Three voices cross the rain. You brought back the light — and remembered what it was for.'],signal:['03 / THE SIGNAL CONTINUES','Some futures must leave.','The district dims behind you. Its signal travels in your hands: a memory that can outlast its city. The road beyond the last light is open.']};
  const [k,t,body]=endings[game.ending];beginModal('ended',k,t);const p=document.createElement('p');p.textContent=body;$('modal-content').append(p);
  const stats=document.createElement('div');stats.className='ending-stats';for(const [v,l]of [[game.rewinds,'ECHOES LEFT'],[game.facts.fragments.length+'/3','MEMORIES'],[Math.floor(game.remaining/60)+'s','TIME REMAINING']]){const d=document.createElement('div'),b=document.createElement('strong'),s=document.createElement('span');b.textContent=v;s.textContent=l;d.append(b,s);stats.append(d);}$('modal-content').append(stats);
  const a=document.createElement('div');a.className='modal-actions';a.append(button('Begin another timeline',()=>start(false)),button('Export this ending',saveDownload),button('Return to title',returnTitle));$('modal-content').append(a);
 }
 function action(which){if(!started||modal)return;clearInput();const old=game.ledger.length;
  if(which==='echo')I.rewind(game);if(which==='pulse')I.pulse(game);if(which==='interact')I.interact(game);
  if(game.ledger.length>old){sound.tone(which==='echo'?'echo':which==='pulse'?'pulse':game.ledger.at(-1).kind==='MEMORY_ANCHORED'?'memory':'anchor');persist();}updateUI();
 }
 $('title-help').onclick=help;$('help-button').onclick=help;$('map-button').onclick=map;$('pause-button').onclick=pause;
 $('rewind-button').onclick=()=>action('echo');$('pulse-button').onclick=()=>action('pulse');$('interact-prompt').onclick=()=>action('interact');
 $('touch-echo').onclick=()=>action('echo');$('touch-pulse').onclick=()=>action('pulse');$('touch-interact').onclick=()=>action('interact');
 function updateUI(){
  if(!started)return;const o=I.objective(game),c=I.activeCard(game),seconds=Math.ceil(game.remaining/60);
  $('chapter').textContent='CHAPTER 0'+(game.stage+1)+' / 03';$('objective-name').textContent=o[0].toLowerCase().replace(/(^|\s)\S/g,x=>x.toUpperCase());$('objective-detail').textContent=o[1];
  $('time').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');document.querySelector('.clock').classList.toggle('urgent',seconds<60);
  $('stability-value').textContent=Math.ceil(game.player.stability);$('stability-bar').style.width=game.player.stability+'%';$('memory-value').textContent=game.facts.fragments.length+' / 3';
  $('card-roman').textContent=c.roman;$('card-name').textContent=c.name;$('card-line').textContent=c.line;
  $('echo-count').textContent=game.echoes.length+' OF 2';for(let i=0;i<2;i++){const e=game.echoes[i],el=$('echo-slot-'+i);el.textContent=e?'E'+e.id+' · '+(e.holding?'HOLDING':'WALKING'):'EMPTY';el.classList.toggle('active',!!e);}
  $('recording-label').textContent=game.mode==='playing'?'RECORDING · '+(game.loopTick/60).toFixed(1)+'s':'RECORDING PAUSED';
  const cooldown=Math.max(0,Math.ceil((game.pulseReadyAt-game.totalTick)/60));$('pulse-label').textContent=cooldown?'Pulse · '+cooldown+'s':'Still the storm';$('pulse-button').disabled=!!cooldown;$('touch-pulse').disabled=!!cooldown;
  const n=I.nearestNode(game);$('interaction').hidden=!n||game.mode!=='playing'||!!modal;if(n)$('interaction-label').textContent=n.label;
  if(game.notice.id!==lastNotice){lastNotice=game.notice.id;if(game.notice.text)toast(game.notice.text);}
  if(game.mode!==lastMode){lastMode=game.mode;if(game.mode!=='playing')clearInput();}
  const inDialogue=game.mode==='dialogue'&&!modal;$('dialogue-panel').hidden=!inDialogue;document.body.classList.toggle('in-dialogue',inDialogue);
  if(inDialogue&&JSON.stringify(game.dialogue)!==lastDialogue){lastDialogue=JSON.stringify(game.dialogue);$('speaker').textContent=game.dialogue.speaker;$('dialogue-text').textContent=game.dialogue.text;$('dialogue-choices').replaceChildren(...game.dialogue.choices.map(c=>button(c.label,()=>{I.choose(game,c.id);lastDialogue='';persist();sound.tone('click');updateUI();})));$('dialogue-choices').firstElementChild?.focus();}
  if(game.mode==='failed'||game.mode==='ended'){persist();finishPanel(game.mode==='failed');}
 }
 function goTo(target){if(!started||modal||game.mode!=='playing')return false;const found=I.findPath(game,target);if(!found){toast('No clear route. A closed gate may need an echo on its plate.');return false;}path=found;return true;}
 $('world').addEventListener('pointerdown',e=>{if(e.button&&e.button!==0)return;const r=$('world').getBoundingClientRect();goTo(view.ground(e.clientX-r.left,e.clientY-r.top));});
 $('world').addEventListener('wheel',e=>{if(!started)return;e.preventDefault();view.zoom=Math.max(12,Math.min(26,view.zoom+Math.sign(e.deltaY)*1.3));},{passive:false});
 window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement)return;
  const code=e.code;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab'].includes(code)&&started&&code!=='Tab')e.preventDefault();
  if(code==='Escape'){if(modal)closeModal();else pause();return;}
  if(code==='Tab'&&modal){const els=[...$('modal').querySelectorAll('button,input')].filter(x=>!x.hidden&&!x.disabled),first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}return;}
  if(e.repeat||!started||modal)return;
  if(code==='KeyQ'){e.preventDefault();action('echo');return;}if(code==='Space'){action('pulse');return;}if(code==='KeyE'){action('interact');return;}if(code==='KeyM'){map();return;}if(code==='Slash'){help();return;}
  keys.add(code);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(code))path=[];
 });
 window.addEventListener('keyup',e=>keys.delete(e.code));
 const joystick=$('joystick');let joyId=null;
 function stick(e){const r=joystick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),max=r.width*.32,f=d>max?max/d:1;pointer={x:dx*f/max,z:dy*f/max};$('stick').style.transform=`translate(${dx*f}px,${dy*f}px)`;path=[];}
 joystick.addEventListener('pointerdown',e=>{joyId=e.pointerId;joystick.setPointerCapture(joyId);stick(e);});joystick.addEventListener('pointermove',e=>{if(e.pointerId===joyId)stick(e);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(ev,()=>{joyId=null;pointer={x:0,z:0};$('stick').style.transform='';});
 function input(){
  if(path.length){while(path.length&&Math.hypot(path[0].x-game.player.x,path[0].z-game.player.z)<.17)path.shift();if(path.length){const x=path[0].x-game.player.x,z=path[0].z-game.player.z,d=Math.hypot(x,z);return{x:x/d,z:z/d,sprint:false};}}
  const sx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+pointer.x;
  const sy=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+pointer.z;
  // Camera-oriented movement matches the visible diagonals on keyboard and touch.
  const r=view.camera.right,b=view.camera.back,l=Math.hypot(b[0],b[2]);return{x:r[0]*sx+b[0]/l*sy,z:r[2]*sx+b[2]/l*sy,sprint:keys.has('ShiftLeft')||keys.has('ShiftRight')};
 }
 let last=performance.now(),acc=0,lastUI=0,lastSave=0,lastStep=0,qaPaused=false;
 function frame(now){
  const dt=Math.min(.1,(now-last)/1000);last=now;
  if(started&&!modal&&game.mode==='playing'&&!qaPaused){acc+=dt;let iterations=0;while(acc>=1/60&&iterations++<6){const before={x:game.player.x,z:game.player.z};I.step(game,input());acc-=1/60;if(game.totalTick-lastStep>22&&Math.hypot(game.player.x-before.x,game.player.z-before.z)>.001){sound.tone('step');lastStep=game.totalTick;}}}else acc=0;
  view.render(game,{title:!started,now,reduced:preferences.reduced,target:path.at(-1)||null});
  if(now-lastUI>80){updateUI();lastUI=now;}if(started&&now-lastSave>5000){persist();lastSave=now;}
  if(game.ledger.length!==lastLedger){lastLedger=game.ledger.length;if(started)persist();}
  requestAnimationFrame(frame);
 }
 window.addEventListener('blur',()=>{clearInput();if(started&&game.mode==='playing'&&!modal)pause();});
 document.addEventListener('visibilitychange',()=>{clearInput();if(document.hidden&&started&&game.mode==='playing'&&!modal)pause();last=performance.now();acc=0;});
 window.addEventListener('beforeunload',persist);
 document.addEventListener('intime-render-lost',()=>{if(started&&game.mode==='playing')pause();$('render-error').hidden=false;$('render-error-text').textContent='The graphics context was lost. Your latest local save is retained. Reload to continue.';});
 // Public integration seam: read-only snapshots and the normal pathfinding control.
 I.app={diagnostics:()=>({renderer:view.cpu?'Canvas 3D compatibility':'WebGL',frames:view.frame,storageAvailable:storageOK}),snapshot:()=>JSON.parse(JSON.stringify(game)),project:(x,y,z)=>view.project(x,y,z),walkTo:goTo,exportSave:()=>I.saveGame(game)};
 if(new URLSearchParams(location.search).get('qa')==='1'||globalThis.__INTIME_TEST__===true){
  I.qa={freeze:()=>{qaPaused=true;},advance:(inputs,count=1)=>{if(!started||modal)throw Error('Start the game and close the menu first.');if(!Number.isInteger(count)||count<0||count>30000)throw Error('Invalid count');for(let i=0;i<count;i++)I.step(game,inputs);updateUI();},state:()=>I.app.snapshot()};
 }
 requestAnimationFrame(frame);
})();
