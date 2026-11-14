/* Declarative world data. Dimensions are full widths, world units are metres.
 * Fictional district; new content, not an extraction of the CHIRAQ map. */
(() => {
  'use strict';
  const IT = globalThis.IT;
  const walls=[];
  function wall(id,x,z,w,d,h=1.6){ walls.push({id,x,z,w,d,h}); }
  function room(id,l,r,n,s,doorX){
    wall(id+'-west',l,(n+s)/2,.8,s-n);
    wall(id+'-east',r,(n+s)/2,.8,s-n);
    wall(id+'-north',(l+r)/2,n,r-l,.8);
    wall(id+'-southL',(l+doorX-2)/2,s,doorX-2-l,.8);
    wall(id+'-southR',(doorX+2+r)/2,s,r-doorX-2,.8);
  }
  room('relay',-28,-8,-18,4,-17);
  room('archive',8,28,-18,4,18);
  room('convergence',-7,7,-24,-4,0);
  wall('fountain',0,7,3,3,.75);
  IT.WORLD = Object.freeze({
    bounds:{left:-32,right:32,north:-27,south:24},
    anchors:[{x:0,z:18},{x:5,z:17},{x:0,z:12}], walls,
    gates:[
      {id:'relay',name:'Relay gate',x:-17,z:4,w:4,d:.8,h:2.8,stage:0,plates:['relay-a']},
      {id:'archive',name:'Archive gate',x:18,z:4,w:4,d:.8,h:2.8,stage:1,plates:['archive-a','archive-b']},
      {id:'convergence',name:'Convergence gate',x:0,z:-4,w:4,d:.8,h:3.2,stage:2,plates:['final-a','final-b']}
    ],
    plates:[
      {id:'relay-a',gate:'relay',x:-20,z:12,r:1.45,label:'I'},
      {id:'archive-a',gate:'archive',x:12,z:14,r:1.45,label:'II'},
      {id:'archive-b',gate:'archive',x:25,z:12,r:1.45,label:'III'},
      {id:'final-a',gate:'convergence',x:-4,z:1,r:1.45,label:'IV'},
      {id:'final-b',gate:'convergence',x:4,z:1,r:1.45,label:'V'}
    ],
    nodes:[
      {id:'relay',type:'terminal',x:-18,z:-10,label:'Restore the Relay',stage:0},
      {id:'archive',type:'terminal',x:18,z:-10,label:'Unseal the Archive',stage:1},
      {id:'convergence',type:'terminal',x:0,z:-18,label:'The Last Light',stage:2},
      {id:'memory-1',type:'memory',x:-25,z:-13,label:'A voice in the rain'},
      {id:'memory-2',type:'memory',x:25,z:-13,label:'A name worth keeping'},
      {id:'memory-3',type:'memory',x:-4,z:-20,label:'The promise'},
      {id:'mira',type:'npc',x:2,z:16,label:'Mira · the Watcher'},
      {id:'rowan',type:'npc',x:-12,z:10,label:'Rowan · keeper of the Relay'},
      {id:'ivo',type:'npc',x:12,z:8,label:'Ivo · the archivist'}
    ],
    hazards:[
      {id:'wisp-a',stage:1,x:19,z:8,rx:6,rz:1.8,period:900,phase:0},
      {id:'wisp-b',stage:2,x:0,z:-10,rx:4.5,rz:3,period:1050,phase:2.1}
    ]
  });
  IT.CARDS = Object.freeze([
    {id:'fool',name:'The Fool',roman:'0',line:'A lighter step.',speed:1.12},
    {id:'magician',name:'The Magician',roman:'I',line:'Your pulse lasts longer.',pulse:1.4},
    {id:'priestess',name:'The High Priestess',roman:'II',line:'Anomalies see less.',sight:.72},
    {id:'empress',name:'The Empress',roman:'III',line:'Stability returns faster.',regen:1.8},
    {id:'emperor',name:'The Emperor',roman:'IV',line:'Your presence resists damage.',damage:.65},
    {id:'lovers',name:'The Lovers',roman:'VI',line:'Presence reaches farther.',plate:1.3},
    {id:'chariot',name:'The Chariot',roman:'VII',line:'A longer, faster stride.',speed:1.2},
    {id:'strength',name:'Strength',roman:'VIII',line:'The storm cannot take as much.',damage:.55},
    {id:'hermit',name:'The Hermit',roman:'IX',line:'Walk unseen a little longer.',sight:.65},
    {id:'wheel',name:'Wheel of Fortune',roman:'X',line:'Your pulse returns sooner.',cooldown:.68},
    {id:'temperance',name:'Temperance',roman:'XIV',line:'Recovery in the quiet.',regen:2.4},
    {id:'star',name:'The Star',roman:'XVII',line:'A stronger pulse. A softer storm.',pulse:1.2,damage:.8}
  ]);
  IT.activeCard = g => IT.CARDS[g.deck[g.cardIndex % g.deck.length]];
  IT.plateActive = (g,p) => {
    const r=p.r*(IT.activeCard(g).plate||1);
    return [g.player,...g.echoes.map(e=>e.pos)].some(a=>Math.hypot(a.x-p.x,a.z-p.z)<=r);
  };
  IT.gateOpen = (g,gate) => !!g.facts[gate.id] || (g.stage===gate.stage && gate.plates.every(id=>IT.plateActive(g,IT.WORLD.plates.find(p=>p.id===id))));
  const hit=(x,z,r,o)=>x+r>o.x-o.w/2 && x-r<o.x+o.w/2 && z+r>o.z-o.d/2 && z-r<o.z+o.d/2;
  IT.blocked = (g,x,z,r=.42) => {
    if(!Number.isFinite(x)||!Number.isFinite(z)) return true;
    const b=IT.WORLD.bounds;
    return x-r<b.left||x+r>b.right||z-r<b.north||z+r>b.south||
      walls.some(o=>hit(x,z,r,o))||IT.WORLD.gates.some(o=>!IT.gateOpen(g,o)&&hit(x,z,r,o));
  };
  IT.lineClear=(g,a,b)=>{
    const steps=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/.3);
    for(let i=1;i<steps;i++) if(IT.blocked(g,a.x+(b.x-a.x)*i/steps,a.z+(b.z-a.z)*i/steps,.04))return false;
    return true;
  };
  IT.nearestNode=g=>IT.WORLD.nodes.filter(n=>Math.hypot(n.x-g.player.x,n.z-g.player.z)<2.25 && IT.lineClear(g,g.player,n) && !(n.type==='memory'&&g.facts.fragments.includes(n.id)))
    .sort((a,b)=>Math.hypot(a.x-g.player.x,a.z-g.player.z)-Math.hypot(b.x-g.player.x,b.z-g.player.z))[0]||null;
  IT.dronePositions=g=>IT.WORLD.hazards.filter(h=>g.stage>=h.stage).map(h=>{
    const a=g.droneTick/h.period*Math.PI*2+h.phase;
    return {...h,x:h.x+Math.cos(a)*h.rx,z:h.z+Math.sin(a)*h.rz,angle:Math.atan2(-Math.sin(a)*h.rx,Math.cos(a)*h.rz)};
  });
  IT.objective=g=>[
    ['THE RELAY','Leave an echo on plate I. Enter the western gate.'],
    ['THE ARCHIVE','Leave two echoes on plates II and III. Unseal the east archive.'],
    ['THE LAST LIGHT','Hold plates IV and V with echoes. Reach the north tower.']
  ][Math.min(g.stage,2)];
  // Bounded A*, deterministic tie-breaking. Navigation never crosses a closed gate.
  IT.findPath=(g,target)=>{
    if(!target||IT.blocked(g,target.x,target.z))return null;
    const start={x:Math.round(g.player.x),z:Math.round(g.player.z)},end={x:Math.round(target.x),z:Math.round(target.z)};
    const key=(x,z)=>x+','+z;
    const open=[{...start,cost:0,score:0}],best=new Map([[key(start.x,start.z),0]]),parents=new Map();
    let goal=null;
    for(let iter=0;open.length&&iter<4500;iter++){
      open.sort((a,b)=>a.score-b.score||a.cost-b.cost);const c=open.shift(),ck=key(c.x,c.z);
      if(c.cost!==best.get(ck))continue;
      if(c.x===end.x&&c.z===end.z){goal=c;break;}
      for(const [dx,dz] of [[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){
        const x=c.x+dx,z=c.z+dz;
        if(IT.blocked(g,x,z)||((dx&&dz)&&(IT.blocked(g,c.x+dx,c.z)||IT.blocked(g,c.x,c.z+dz))))continue;
        const k=key(x,z),cost=c.cost+Math.hypot(dx,dz);
        if(cost>=(best.get(k)??Infinity))continue;
        best.set(k,cost);parents.set(k,c);open.push({x,z,cost,score:cost+Math.hypot(end.x-x,end.z-z)});
      }
    }
    if(!goal)return null;
    const path=[];for(let c=goal;c;c=parents.get(key(c.x,c.z)))path.push({x:c.x,z:c.z});path.reverse();path.shift();
    if(!path.length||Math.hypot(path.at(-1).x-target.x,path.at(-1).z-target.z)>.05)path.push({x:target.x,z:target.z});
    return path;
  };
})();
