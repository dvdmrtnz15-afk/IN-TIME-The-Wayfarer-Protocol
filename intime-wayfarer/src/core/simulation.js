/* Fixed-step temporal game. Rendering, wall-clock time and audio have no authority
 * over outcomes. Checksums detect accidental corruption, not malicious tampering. */
(() => {
  'use strict';
  const IT=globalThis.IT;
  const clone=v=>JSON.parse(JSON.stringify(v));
  function canonical(v){
    if(v===null||typeof v!=='object')return JSON.stringify(v);
    if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';
    return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
  }
  function checksum(v){const s=typeof v==='string'?v:canonical(v);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
  function event(g,kind,data={}){
    const row={seq:g.ledger.length,tick:g.totalTick,kind,data,prev:g.ledger.at(-1)?.hash||'00000000'};
    g.ledger.push({...row,hash:checksum(row)});
  }
  IT.verifyLedger=ledger=>{
    if(!Array.isArray(ledger)||!ledger.length||ledger.length>20000)return false;
    let prev='00000000';for(let i=0;i<ledger.length;i++){
      const row=ledger[i];if(!row||row.seq!==i||row.prev!==prev)return false;
      const {hash,...body}=row;if(checksum(body)!==hash)return false;prev=hash;
    }return true;
  };
  function notice(g,text){g.notice={id:g.notice.id+1,text,tick:g.totalTick};}
  function resetLoop(g){
    const a=IT.WORLD.anchors[Math.min(g.stage,2)];g.player={x:a.x,z:a.z,angle:Math.PI,stability:100};
    g.loopTick=0;g.droneTick=0;g.record=[[0,a.x,a.z,Math.PI]];
    for(const e of g.echoes){e.cursor=0;e.holding=false;e.pos={x:e.path[0][1],z:e.path[0][2],angle:e.path[0][3]};}
  }
  IT.createGame=(seed=2100)=>{
    const rng=new IT.SeededRng(seed);
    const g={seed:seed>>>0,stage:0,mode:'playing',totalTick:0,remaining:21600,loopTick:0,droneTick:0,
      player:{x:0,z:18,angle:Math.PI,stability:100},echoes:[],record:[[0,0,18,Math.PI]],nextEchoId:1,
      rewinds:0,retries:0,facts:{relay:false,archive:false,convergence:false,fragments:[]},deck:rng.shuffle(IT.CARDS.map((_,i)=>i)),cardIndex:0,
      pulseUntil:0,pulseReadyAt:0,damageReadyAt:0,ledger:[],notice:{id:0,text:'Stand on plate I. Press Q to leave your first echo.',tick:0},dialogue:null,ending:null};
    event(g,'GENESIS',{seed:g.seed});return g;
  };
  function echoes(g){
    for(const e of g.echoes){
      while(e.cursor<e.path.length-1&&e.path[e.cursor+1][0]<=g.loopTick)e.cursor++;
      const a=e.path[e.cursor],b=e.path[Math.min(e.cursor+1,e.path.length-1)];
      const t=b[0]===a[0]?0:Math.min(1,(g.loopTick-a[0])/(b[0]-a[0]));
      e.pos={x:a[1]+(b[1]-a[1])*t,z:a[2]+(b[2]-a[2])*t,angle:a[3]};e.holding=g.loopTick>=e.path.at(-1)[0];
    }
  }
  IT.rewind=g=>{
    if(g.mode!=='playing')return false;
    if(g.loopTick<30){notice(g,'Record at least half a second before leaving an echo.');return false;}
    const path=clone(g.record),last=[g.loopTick,g.player.x,g.player.z,g.player.angle];
    if(path.at(-1)[0]!==g.loopTick)path.push(last);else path[path.length-1]=last;
    g.echoes.push({id:g.nextEchoId++,path,cursor:0,holding:false,pos:{x:path[0][1],z:path[0][2],angle:path[0][3]}});
    if(g.echoes.length>2)g.echoes.shift();g.rewinds++;g.cardIndex=(g.cardIndex+1)%12;resetLoop(g);
    event(g,'ECHO_CREATED',{id:g.nextEchoId-1,frames:path.length,stage:g.stage});notice(g,'Echo '+(g.nextEchoId-1)+' is retracing your steps. The city clock did not rewind.');return true;
  };
  IT.pulse=g=>{
    if(g.mode!=='playing'||g.totalTick<g.pulseReadyAt)return false;
    const c=IT.activeCard(g);g.pulseUntil=g.totalTick+Math.round(180*(c.pulse||1));g.pulseReadyAt=g.totalTick+Math.round(720*(c.cooldown||1));
    event(g,'PULSE');notice(g,'The anomalies are still. Keep moving.');return true;
  };
  IT.step=(g,input={})=>{
    if(g.mode!=='playing')return;
    if(input.rewind){IT.rewind(g);return;}
    if(input.interact){IT.interact(g);return;}
    if(input.pulse)IT.pulse(g);
    g.totalTick++;g.remaining--;g.loopTick++;if(g.totalTick>=g.pulseUntil)g.droneTick++;
    echoes(g);
    let x=Number.isFinite(input.x)?input.x:0,z=Number.isFinite(input.z)?input.z:0;
    const length=Math.hypot(x,z);if(length>1){x/=length;z/=length;}
    const c=IT.activeCard(g),speed=4.8*(c.speed||1)*(input.sprint?1.5:1)/60;
    if(Math.hypot(x,z)>.01)g.player.angle=Math.atan2(x,z);
    const nx=g.player.x+x*speed,nz=g.player.z+z*speed;
    if(!IT.blocked(g,nx,g.player.z))g.player.x=nx;
    if(!IT.blocked(g,g.player.x,nz))g.player.z=nz;
    if(g.loopTick%3===0)g.record.push([g.loopTick,g.player.x,g.player.z,g.player.angle]);
    if(g.totalTick>=g.pulseUntil){
      let threatened=false;
      for(const h of IT.dronePositions(g)){
        if(Math.hypot(h.x-g.player.x,h.z-g.player.z)<3.4*(c.sight||1)&&IT.lineClear(g,h,g.player)){
          threatened=true;if(g.totalTick>=g.damageReadyAt){g.player.stability=Math.max(0,g.player.stability-13*(c.damage||1));g.damageReadyAt=g.totalTick+40;notice(g,'Temporal interference. Use Space to pulse, or move away.');}
        }
      }
      if(!threatened)g.player.stability=Math.min(100,g.player.stability+.027*(c.regen||1));
    }
    if(g.remaining<=0||g.player.stability<=0){g.remaining=Math.max(0,g.remaining);g.mode='failed';event(g,'COLLAPSE',{cause:g.remaining===0?'time':'stability'});}
  };
  const memories={
    'memory-1':['A voice in the rain','“When the lights go out, leave a lantern in the window. Someone is still trying to come home.”'],
    'memory-2':['A name worth keeping','The archive holds no kings, no victories. Just names. The people who kept the city alive when nobody was watching.'],
    'memory-3':['The promise','“Bring back the light. But bring back what it was for.” The final recording is your own voice.']
  };
  function dialogue(g,speaker,text,choices=[{id:'close',label:'Keep moving'}]){g.mode='dialogue';g.dialogue={speaker,text,choices};}
  IT.interact=g=>{
    if(g.mode!=='playing')return false;const n=IT.nearestNode(g);if(!n)return false;
    if(n.type==='memory'){
      if(g.facts.fragments.includes(n.id))return false;
      g.facts.fragments.push(n.id);event(g,'MEMORY_ANCHORED',{id:n.id});dialogue(g,...memories[n.id]);return true;
    }
    if(n.type==='npc'){
      let text='';
      if(n.id==='mira')text=g.rewinds?`“This is the ${g.rewinds+1}th version of this conversation. I remember the others. The city has changed ${g.stage} times. You can still choose what comes next.”`:'“Six minutes until the city goes dark. Walk to the western pressure plate, then rewind. Your echo will repeat that walk and hold the plate. You take the open gate.”';
      if(n.id==='rowan')text=g.facts.relay?'“The Relay is anchored. No rewind can undo that. The Archive needs two versions of you, standing on two different plates.”':'“Your echo stops where you stop. End your recording in the centre of plate I. Leave it there. Rewind, then enter the western gate while it holds.”';
      if(n.id==='ivo')text=g.facts.archive?'“The north tower holds the last decision. Two echoes can open its gate. Three memories can change what you bring back.”':'“Two plates, two echoes. Record one route, rewind. Record the second, rewind. Both will replay together. A third recording replaces your oldest echo.”';
      dialogue(g,n.label,text);return true;
    }
    if(n.stage<g.stage){dialogue(g,n.label,'This place is anchored. The city remembers. Move toward the next landmark.');return true;}
    if(n.stage!==g.stage)return false;
    const gate=IT.WORLD.gates[n.stage];if(!IT.gateOpen(g,gate)){notice(g,'The gate needs its pressure plates held before this terminal can anchor.');return false;}
    if(n.id==='convergence'){
      dialogue(g,'THE LAST LIGHT','The city can return. Or its signal can leave with you. This decision will be anchored; rewinding cannot undo it.',[{id:'restore',label:'Restore the district'},{id:'depart',label:'Carry the signal away'},{id:'close',label:'Not yet — keep exploring'}]);return true;
    }
    g.facts[n.id]=true;g.stage++;g.echoes=[];resetLoop(g);event(g,'LANDMARK_ANCHORED',{id:n.id});
    dialogue(g,n.id==='relay'?'THE RELAY IS ALIVE':'THE ARCHIVE REMEMBERS',n.id==='relay'?'A street of lanterns wakes in the rain. This change survives every rewind. Next: leave two echoes on plates II and III, then enter the eastern Archive.':'The city has its memory back. The north tower is listening. Leave echoes on plates IV and V, then reach the Last Light.');return true;
  };
  IT.choose=(g,id)=>{
    if(g.mode!=='dialogue'||!g.dialogue?.choices.some(c=>c.id===id))return false;
    if(id==='close'){g.mode='playing';g.dialogue=null;return true;}
    if(g.stage!==2||!['restore','depart'].includes(id)||!g.facts.relay||!g.facts.archive)return false;
    g.facts.convergence=true;g.mode='ended';g.dialogue=null;g.ending=id==='depart'?'signal':g.facts.fragments.length===3?'home':'light';
    event(g,'ENDING_ANCHORED',{ending:g.ending,memories:g.facts.fragments.length});return true;
  };
  IT.retry=g=>{
    if(!['failed','paused','playing'].includes(g.mode))return false;
    g.echoes=[];g.remaining=21600;g.mode='playing';g.dialogue=null;g.pulseUntil=0;g.pulseReadyAt=0;g.damageReadyAt=0;g.retries++;resetLoop(g);
    event(g,'CHECKPOINT_RETRY',{stage:g.stage});notice(g,'Checkpoint restored. Your anchored progress remains.');return true;
  };
  function validate(g){
    const finite=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
    const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
    const pose=p=>p&&finite(p.x,-33,33)&&finite(p.z,-28,25)&&finite(p.angle,-Math.PI*2,Math.PI*2);
    const path=p=>Array.isArray(p)&&p.length>0&&p.length<=7500&&p.every((a,i)=>Array.isArray(a)&&a.length===4&&int(a[0],0,21600)&&finite(a[1],-33,33)&&finite(a[2],-28,25)&&finite(a[3],-Math.PI*2,Math.PI*2)&&(i===0?a[0]===0:a[0]>p[i-1][0]));
    if(!g||!int(g.seed,0,4294967295)||!int(g.stage,0,2)||!['playing','paused','dialogue','failed','ended'].includes(g.mode)||!pose(g.player)||!finite(g.player.stability,0,100)||!int(g.remaining,0,21600)||!int(g.totalTick,0,1e9)||!int(g.loopTick,0,21600)||!int(g.droneTick,0,21600))throw Error('Invalid game state.');
    if(!g.facts||typeof g.facts.relay!=='boolean'||typeof g.facts.archive!=='boolean'||typeof g.facts.convergence!=='boolean'||g.facts.relay!==(g.stage>=1)||g.facts.archive!==(g.stage>=2)||g.facts.convergence!==(g.mode==='ended'))throw Error('Inconsistent anchored progress.');
    if(!Array.isArray(g.facts.fragments)||g.facts.fragments.length>3||new Set(g.facts.fragments).size!==g.facts.fragments.length||!g.facts.fragments.every(x=>typeof x==='string'&&Object.hasOwn(memories,x)))throw Error('Invalid memories.');
    if(!Array.isArray(g.deck)||g.deck.length!==12||new Set(g.deck).size!==12||!g.deck.every(v=>int(v,0,11))||!int(g.cardIndex,0,11))throw Error('Invalid deck.');
    if(!path(g.record)||g.record.at(-1)[0]>g.loopTick||!Array.isArray(g.echoes)||g.echoes.length>2||g.echoes.some(e=>!int(e.id,1,100000)||!path(e.path)||!int(e.cursor,0,e.path.length-1)||!pose(e.pos)||typeof e.holding!=='boolean'))throw Error('Invalid echo data.');
    if(!int(g.nextEchoId,1,100001)||new Set(g.echoes.map(e=>e.id)).size!==g.echoes.length||g.echoes.some(e=>e.id>=g.nextEchoId)||!int(g.rewinds,0,100000)||!int(g.retries,0,100000))throw Error('Invalid counters.');
    for(const k of ['pulseUntil','pulseReadyAt','damageReadyAt'])if(!int(g[k],0,1e9))throw Error('Invalid timing.');
    if(!g.notice||!int(g.notice.id,0,1e6)||typeof g.notice.text!=='string'||g.notice.text.length>500||!int(g.notice.tick,0,1e9))throw Error('Invalid notice.');
    if(g.mode==='dialogue'){
      if(!g.dialogue||typeof g.dialogue.speaker!=='string'||typeof g.dialogue.text!=='string'||g.dialogue.text.length>3000||!Array.isArray(g.dialogue.choices)||g.dialogue.choices.length>3||!g.dialogue.choices.every(c=>['close','restore','depart'].includes(c.id)&&typeof c.label==='string'&&c.label.length<200))throw Error('Invalid dialogue.');
    }else if(g.dialogue!==null)throw Error('Unexpected dialogue.');
    if(g.mode==='ended'?!['signal','light','home'].includes(g.ending):g.ending!==null)throw Error('Invalid ending.');
    if(!IT.verifyLedger(g.ledger))throw Error('Event checksum mismatch.');
    return g;
  }
  IT.saveGame=g=>{validate(g);const envelope={format:'IN-TIME',version:1,state:g,checksum:checksum(g)};const raw=JSON.stringify(envelope);if(raw.length>4_000_000)throw Error('Save exceeds 4 MB.');return raw;};
  IT.loadGame=raw=>{
    if(typeof raw!=='string'||raw.length>4_000_000)throw Error('Save is too large.');let e;try{e=JSON.parse(raw);}catch{throw Error('This is not a valid save file.');}
    if(!e||e.format!=='IN-TIME'||e.version!==1)throw Error('Unsupported save format or version.');
    if(checksum(e.state)!==e.checksum)throw Error('Save checksum mismatch.');return validate(e.state);
  };
  IT.checksum=checksum;
})();
