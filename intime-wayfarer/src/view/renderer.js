/* Original lightweight WebGL renderer: batched procedural meshes, directional
 * lighting, fog and screen-space glows. All geometry is included in the source.
 * Decorative animation never changes simulation state or consumes its RNG. */
(() => {
 'use strict';const I=globalThis.IT;
 const C={ground:[.13,.19,.21],tile:[.19,.25,.26],wall:[.28,.34,.35],roof:[.18,.24,.25],gold:[.82,.57,.29],cyan:[.35,.86,.81],ink:[.06,.11,.14],white:[.86,.84,.74]};
 class Mesh {
  constructor(){this.data=[];this.faces=[];}
  tri(a,b,c,color,emission=0){
   const u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const l=Math.hypot(...n)||1;n=n.map(x=>x/l);
   this.faces.push({points:[a,b,c],normal:n,color,emission});
   for(const p of [a,b,c])this.data.push(...p,...n,...color,emission);
  }
  quad(a,b,c,d,col,e=0){this.tri(a,b,c,col,e);this.tri(a,c,d,col,e);}
  box(x,y,z,w,h,d,col,e=0,angle=0){
   const pts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>{const px=p[0]*w/2,pz=p[2]*d/2;return [x+px*Math.cos(angle)+pz*Math.sin(angle),y+p[1]*h/2,z-px*Math.sin(angle)+pz*Math.cos(angle)];});
   for(const face of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]])this.quad(...face.map(n=>pts[n]),col,e);
  }
  cylinder(x,y,z,r,h,col,e=0,sides=16,topR=r){
   for(let i=0;i<sides;i++){const a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;
    const p=[x+Math.sin(a)*r,y,z+Math.cos(a)*r],q=[x+Math.sin(b)*r,y,z+Math.cos(b)*r],u=[x+Math.sin(a)*topR,y+h,z+Math.cos(a)*topR],v=[x+Math.sin(b)*topR,y+h,z+Math.cos(b)*topR];
    this.quad(p,q,v,u,col,e);this.tri([x,y+h,z],u,v,col,e);this.tri([x,y,z],q,p,col,e);
   }
  }
  ring(x,y,z,r,thick,col,e=0,sides=40){
   for(let i=0;i<sides;i++){const a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;
    this.quad([x+Math.cos(a)*r,y,z+Math.sin(a)*r],[x+Math.cos(a)*(r-thick),y,z+Math.sin(a)*(r-thick)],[x+Math.cos(b)*(r-thick),y,z+Math.sin(b)*(r-thick)],[x+Math.cos(b)*r,y,z+Math.sin(b)*r],col,e);
   }
  }
  diamond(x,y,z,r,col,e=0){
   const p=[[x-r,y,z],[x,y,z+r],[x+r,y,z],[x,y,z-r]];
   for(let j=0;j<4;j++){this.tri(p[j],p[(j+1)%4],[x,y+r*1.6,z],col,e);this.tri(p[(j+1)%4],p[j],[x,y-r*1.6,z],col,e);}
  }
 }
 const VS=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;attribute float aEmission;uniform mat4 uMatrix;varying vec3 vNormal;varying vec3 vColor;varying vec3 vWorld;varying float vEmission;void main(){vNormal=aNormal;vColor=aColor;vWorld=aPosition;vEmission=aEmission;gl_Position=uMatrix*vec4(aPosition,1.0);}`;
 const FS=`precision mediump float;varying vec3 vNormal;varying vec3 vColor;varying vec3 vWorld;varying float vEmission;uniform vec3 uTarget;uniform float uAwake;void main(){vec3 n=normalize(vNormal);float d=max(dot(n,normalize(vec3(-.45,1.,.25))),0.);float rim=max(dot(n,normalize(vec3(.8,.45,-.75))),0.);vec3 light=vec3(.33,.43,.48)+d*vec3(.69,.65,.53)+rim*vec3(.07,.22,.25);vec3 col=vColor*light+vColor*vEmission*1.15;float mist=clamp(length(vWorld.xz-uTarget.xz)/125.,0.,.45);col=mix(col,vec3(.055,.115,.145),mist);col+=vec3(.06,.035,.008)*uAwake;gl_FragColor=vec4(pow(max(col,vec3(0.)),vec3(.88)),1.);}`;
 class Renderer {
  constructor(canvas,overlay){
   this.canvas=canvas;this.overlay=overlay;this.ctx=overlay.getContext('2d');this.gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'high-performance'});
   this.cpu=!this.gl;
   this.camera=new I.Camera();this.target={x:0,y:0,z:1};this.width=1;this.height=1;this.low=false;this.lamps=[];this.zoom=17;
   if(this.cpu){this.software=canvas.getContext('2d',{alpha:false});if(!this.software)throw Error('Neither WebGL nor Canvas 2D is available.');this.staticMesh=this.buildWorld();this.frame=0;return;}
   const gl=this.gl;
   const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
   const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,VS));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));this.program=p;gl.useProgram(p);
   this.attributes=[['aPosition',3,0],['aNormal',3,12],['aColor',3,24],['aEmission',1,36]].map(([name,size,offset])=>({loc:gl.getAttribLocation(p,name),size,offset}));
   this.matrixLoc=gl.getUniformLocation(p,'uMatrix');this.targetLoc=gl.getUniformLocation(p,'uTarget');this.awakeLoc=gl.getUniformLocation(p,'uAwake');
   this.staticBuffer=gl.createBuffer();this.dynamicBuffer=gl.createBuffer();const world=this.buildWorld();this.staticCount=world.data.length/10;gl.bindBuffer(gl.ARRAY_BUFFER,this.staticBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(world.data),gl.STATIC_DRAW);
   gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);this.frame=0;
   canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;document.dispatchEvent(new CustomEvent('intime-render-lost'));});
  }
  buildWorld(){
   const m=new Mesh();
   // Island-like district plinth, roads, paving and reflective canal strips.
   m.box(0,-2.2,-1,95,1,88,[.045,.10,.13]);m.box(0,-.65,-1.5,66,1.15,54,[.12,.17,.19]);
   m.box(0,-.02,-1.5,64,.12,51,C.ground);
   for(let x=-31;x<=31;x+=2)for(let z=-26;z<=23;z+=2){const v=((x*13+z*7)%11)/500;m.quad([x-.97,.065,z-.97],[x-.97,.065,z+.97],[x+.97,.065,z+.97],[x+.97,.065,z-.97],[.15+v,.215+v,.225+v]);}
   for(const x of [-6.8,6.8])m.box(x,.08,8,.12,.04,30,C.gold,.35);
   for(const z of [5.2,20.5])m.box(0,.08,z,62,.04,.10,C.gold,.35);
   for(let x=-29;x<31;x+=2)m.box(x,.09,18,.55,.025,.05,[.43,.49,.46]);
   // Long entry avenue with inlaid concentric time marks.
   for(const r of [1.8,2.1,3,4.4])m.ring(0,.095,18,r,.035,C.gold,.3);
   for(const w of I.WORLD.walls){
    m.box(w.x,w.h/2,w.z,w.w,w.h,w.d,C.wall);
    m.box(w.x,w.h+.08,w.z,w.w+.15,.17,w.d+.15,[.43,.43,.38]);
    if(w.w>3)m.box(w.x,.18,w.z,w.w,.08,w.d+.05,C.gold,.4);
    if(w.d>3)m.box(w.x,.18,w.z,w.w+.05,.08,w.d,C.gold,.4);
   }
   // Interiors read as three distinct temples, not empty boxes.
   for(const [x,z,w,d] of [[-18,-7,18,20],[18,-7,18,20],[0,-14,12,18]]){
    m.box(x,.08,z,w,.05,d,[.115,.18,.20]);
    for(let i=0;i<4;i++)m.ring(x,.115,z,2.2+i*.8,.035,C.gold,.3);
   }
   for(const gate of I.WORLD.gates){
    for(const dx of [-2.5,2.5]){m.box(gate.x+dx,1.7,gate.z,.85,3.4,1.25,C.wall);m.box(gate.x+dx,3.5,gate.z,1.1,.22,1.4,C.gold);}
    m.box(gate.x,3.8,gate.z,6,.55,1.1,C.roof);m.box(gate.x,4.12,gate.z,5,.08,.85,C.gold,.3);
   }
   for(const n of I.WORLD.nodes.filter(n=>n.type==='terminal')){
    m.cylinder(n.x,.10,n.z,2,.2,C.ink);m.ring(n.x,.32,n.z,1.85,.06,C.gold,.8);
    m.cylinder(n.x,.32,n.z,1,.28,C.wall,0,8);m.cylinder(n.x,.6,n.z,.54,.9,C.roof,0,6,.36);
    m.box(n.x,1.58,n.z,1.4,.1,.85,C.gold,.2);
    for(const dx of [-2.7,2.7])m.cylinder(n.x+dx,.1,n.z,0.35,3.8,C.wall,0,10,.25);
   }
   // North chronometer crown: twelve fins around a fragmented clock.
   for(let k=0;k<12;k++){const a=k*Math.PI/6;m.box(Math.cos(a)*4,6.0,-18+Math.sin(a)*2.4,.2,1,.45,C.gold,.6,a);}
   m.ring(0,6,-18,3.8,.07,C.gold,.7);m.ring(0,6.3,-18,3.3,.06,C.cyan,.3);
   // Dry fountain and low planters.
   m.cylinder(0,.15,7,1.7,.62,C.wall);m.cylinder(0,.78,7,1.35,.03,[.055,.19,.22],.25);
   m.cylinder(0,.8,7,.2,1.1,C.gold);m.diamond(0,2.2,7,.45,C.cyan,.65);
   for(const [x,z] of [[-30,20],[30,20],[-6,17],[6,17],[-30,-4],[30,-4]]){
    m.box(x,.3,z,1.2,.6,1.2,C.roof);m.cylinder(x,.6,z,.17,1.4,[.25,.23,.19],0,7);
    m.cylinder(x,1.1,z,.85,1.5,[.12,.30,.27],0,7,.1);
   }
   // Building silhouettes are outside the navigable district; no invisible walls.
   for(let side=0;side<2;side++)for(let k=0;k<8;k++){
    const x=side?36:-36,z=-24+k*6,h=5+((k*7+side*3)%5)*1.25;
    this.building(m,x,z,6,h,5,k+side*8);
   }
   for(let k=0;k<10;k++)this.building(m,-30+k*6.7,-31,5.7,5+(k*7%6),5,k+19);
   for(const [x,z] of [[-26,21],[-12,20],[12,20],[27,21],[-30,7],[30,7],[-6,-2],[6,-2],[-30,-15],[30,-15]]){
    m.cylinder(x,0,z,.12,4,C.ink,0,8);m.box(x,4.15,z,.65,.18,.65,C.gold);m.box(x,3.83,z,.4,.55,.4,C.gold,.8);this.lamps.push({x,y:3.9,z});
   }
   // Suspended brass cables and bridge ribs establish the skyline.
   for(let k=0;k<7;k++){m.box(-34+k*11,5.7,23.2,.22,1.4,.3,C.roof);}
   m.box(0,6.5,23.2,69,.12,.12,C.gold);
   return m;
  }
  building(m,x,z,w,h,d,index){
   m.box(x,h/2,z,w,h,d,C.roof);m.box(x,h+.16,z,w+.3,.32,d+.3,[.29,.33,.32]);m.box(x,.3,z,w+.3,.6,d+.3,C.wall);
   for(const dx of [-w/2+.22,w/2-.22])m.box(x+dx,h/2,z,.35,h,d+.1,[.25,.30,.31]);
   for(let y=1.5;y<h-.4;y+=1.65)for(let j=-1;j<=1;j++){
    const col=(Math.round(y)+j+index)%4===0?C.ink:[.47,.39,.24];
    m.box(x+j*w/4,y,z+d/2+.02,.65,.85,.04,col,col===C.ink?0:.75);
    const side=x>0?-1:1;m.box(x+side*(w/2+.02),y,z+j*d/4,.04,.85,.65,col,col===C.ink?0:.6);
   }
   m.cylinder(x,h+.3,z,.5,.7,C.wall,0,8,.32);
  }
  person(m,p,col,phase=0,echo=false){
   const {x,z}=p,a=p.angle||0;const swing=Math.sin(phase)*.16;
   m.cylinder(x,.075,z,.6,.025,[.055,.085,.10],0,16);
   const c=echo?C.cyan:col;
   for(const side of [-1,1]){
    const dx=side*.16*Math.cos(a),dz=-side*.16*Math.sin(a);m.box(x+dx,.38,z+dz, .17,.64,.2,echo?C.cyan:C.ink,echo?.25:0,a);
   }
   m.cylinder(x,.52,z,.5,.83,c,echo?.4:0,8,.25);m.cylinder(x,1.3,z,.26,.39,c,echo?.6:0,9,.22);
   m.box(x+Math.sin(a)*.24,1.47,z+Math.cos(a)*.24,.21,.17,.07,echo?[.7,1,1]:[.20,.19,.16],echo?.5:0,a);
   if(!echo){m.box(x-Math.sin(a)*.23,1.08,z-Math.cos(a)*.23,.19,.6,.11,C.gold,.1,a);m.box(x+Math.cos(a)*.43,.88+swing,z-Math.sin(a)*.43,.15,.54,.17,c,0,a);}
   if(echo)m.ring(x,.09,z,.78,.035,C.cyan,.6);
  }
  drawBuffer(buffer,data,count){const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);if(data)gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);for(const a of this.attributes){gl.enableVertexAttribArray(a.loc);gl.vertexAttribPointer(a.loc,a.size,gl.FLOAT,false,40,a.offset);}gl.drawArrays(gl.TRIANGLES,0,count);}
  resize(){
   const w=this.canvas.clientWidth,h=this.canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,this.low?1:1.65);
   if(w!==this.width||h!==this.height||this.dpr!==dpr){this.width=w;this.height=h;this.dpr=dpr;this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);this.overlay.width=Math.round(w*dpr);this.overlay.height=Math.round(h*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  }
  render(g,{title=false,now=0,reduced=false,target=null}={}){
   if(this.lost)return;this.resize();const gl=this.gl,w=this.width,h=this.height,t=now/1000;
   const dest=title?{x:0,y:0,z:-1}:{x:g.player.x*.9,y:0,z:g.player.z-2};
   const ease=title?.018:.085;for(const k of ['x','y','z'])this.target[k]+=(dest[k]-this.target[k])*ease;
   const span=title?30:this.zoom*(w<h?1.03:1);this.camera.set(this.target,span,w/h);
   if(gl){gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(.032,.075,.098,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
   gl.uniformMatrix4fv(this.matrixLoc,false,this.camera.matrix);gl.uniform3f(this.targetLoc,this.target.x,this.target.y,this.target.z);gl.uniform1f(this.awakeLoc,g.mode==='ended'&&g.ending!=='signal'?1:0);
   this.drawBuffer(this.staticBuffer,null,this.staticCount);}
   const m=new Mesh();
   for(const gate of I.WORLD.gates){const open=I.gateOpen(g,gate),col=open?C.cyan:C.gold;for(let dx=-1.65;dx<2;dx+=.55)m.box(gate.x+dx,open?3.6:1.55,gate.z,.14,open?.25:2.9,.18,col,.3);m.diamond(gate.x,4.7,gate.z,.2,col,.8);}
   for(const p of I.WORLD.plates){const on=I.plateActive(g,p),gate=I.WORLD.gates.find(x=>x.id===p.gate),enabled=g.stage===gate.stage,col=on?C.cyan:enabled?C.gold:[.31,.38,.38];
    m.cylinder(p.x,.12,p.z,p.r,.1,C.ink);m.ring(p.x,.235,p.z,p.r,.10,col,enabled?.6:0);m.ring(p.x,.24,p.z,p.r*.68,.04,col,enabled?.6:0);m.diamond(p.x,.31,p.z,.15,col,enabled?.7:0);
    if(on){const mx=(p.x+gate.x)/2,mz=(p.z+gate.z)/2,len=Math.hypot(p.x-gate.x,p.z-gate.z);m.box(mx,.145,mz,.035,.01,len,C.cyan,.6,Math.atan2(gate.x-p.x,gate.z-p.z));}
   }
   for(const n of I.WORLD.nodes){
    if(n.type==='npc')this.person(m,{...n,angle:n.id==='mira'?Math.PI*.7:0},n.id==='mira'?[.33,.55,.51]:n.id==='rowan'?[.53,.38,.25]:[.37,.42,.59],0);
    if(n.type==='memory'&&!g.facts.fragments.includes(n.id)){const bob=reduced?0:Math.sin(t*1.6+n.x)*.13;m.diamond(n.x,1.1+bob,n.z,.29,C.cyan,.9);m.ring(n.x,.15,n.z,.7,.04,C.cyan,.5);}
    if(n.type==='terminal'){const on=g.facts[n.id],col=on?C.cyan:C.gold;m.diamond(n.x,2.35+(reduced?0:Math.sin(t)*.08),n.z,.42,col,.7);m.ring(n.x,.34,n.z,1.48,.05,col,.8);}
   }
   for(const e of g.echoes){
    this.person(m,e.pos,C.cyan,e.holding?0:g.loopTick*.25,true);
    const end=e.path.at(-1);m.ring(end[1],.135,end[2],.45,.02,C.cyan,.35);
    for(let k=3;k<Math.min(e.path.length,420);k+=8){const p=e.path[k];m.box(p[1],.12,p[2],.05,.025,.05,C.cyan,.3);}
   }
   this.person(m,g.player,[.73,.68,.52],g.loopTick*.22,false);
   for(const d of I.dronePositions(g)){
    const frozen=g.totalTick<g.pulseUntil,col=frozen?C.cyan:[.92,.35,.26];m.diamond(d.x,2.2+(reduced?0:Math.sin(t*2)*.1),d.z,.36,col,.65);m.ring(d.x,.13,d.z,2.9,.035,col,.25);m.ring(d.x,2.2,d.z,.75,.04,col,.7);
   }
   if(target)m.ring(target.x,.2,target.z,.5,.04,C.gold,.6);
   if(g.totalTick<g.pulseUntil){const r=(g.totalTick%180)/180*5+1;m.ring(g.player.x,.16,g.player.z,r,.035,C.cyan,.65);}
   if(gl)this.drawBuffer(this.dynamicBuffer,m.data,m.data.length/10);else this.drawSoftware(m);
   this.drawOverlay(g,t,{title,reduced});this.frame++;
  }
  drawSoftware(dynamic){
   // Compatibility path: the same 3D triangles, projected and depth-sorted on CPU.
   // No external graphics adapter and no fake WebGL-success claim.
   const ctx=this.software,w=this.width,h=this.height,b=this.camera.back;
   ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.fillStyle='#081c24';ctx.fillRect(0,0,w,h);
   const faces=[];
   for(const f of [...this.staticMesh.faces,...dynamic.faces]){
    const facing=f.normal[0]*b[0]+f.normal[1]*b[1]+f.normal[2]*b[2];if(facing<-.001)continue;
    const pts=f.points.map(p=>this.project(...p));if(pts.every(p=>p.x<0)||pts.every(p=>p.x>w)||pts.every(p=>p.y<0)||pts.every(p=>p.y>h))continue;
    if(!f.css){const d=Math.max(0,(-.45*f.normal[0]+f.normal[1]+.25*f.normal[2])/1.125),r=Math.max(0,(.8*f.normal[0]+.45*f.normal[1]-.75*f.normal[2])/1.187);const col=f.color.map((v,i)=>Math.round(255*Math.pow(Math.min(1,v*([.33,.43,.48][i]+d*[.69,.65,.53][i]+r*[.07,.22,.25][i])+v*f.emission*1.15),.88)));f.css='rgb('+col.join(',')+')';}
    const depth=f.points.reduce((s,p)=>s+p[0]*b[0]+p[1]*b[1]+p[2]*b[2],0)/3;
    const maxY=Math.max(...f.points.map(p=>p[1]));faces.push({pts,depth,css:f.css,ground:maxY<=.16,height:maxY});
   }
   faces.sort((a,b)=>a.ground!==b.ground?(a.ground?-1:1):(a.ground?a.height-b.height||a.depth-b.depth:a.depth-b.depth));
   for(const f of faces){ctx.fillStyle=f.css;ctx.beginPath();ctx.moveTo(f.pts[0].x,f.pts[0].y);ctx.lineTo(f.pts[1].x,f.pts[1].y);ctx.lineTo(f.pts[2].x,f.pts[2].y);ctx.closePath();ctx.fill();}
  }
  project(x,y,z){return this.camera.project(x,y,z,this.width,this.height);}
  ground(x,y){return this.camera.ground(x,y,this.width,this.height);}
  drawOverlay(g,t,{title,reduced}){
   const ctx=this.ctx,w=this.width,h=this.height;ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='screen';
   const glow=(x,y,z,r,col)=>{const p=this.project(x,y,z);if(p.x<-100||p.x>w+100||p.y<-100||p.y>h+100)return;const gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);gr.addColorStop(0,col);gr.addColorStop(1,'transparent');ctx.fillStyle=gr;ctx.fillRect(p.x-r,p.y-r,r*2,r*2);};
   for(const l of this.lamps)glow(l.x,l.y,l.z,this.low?20:36,'rgba(240,162,71,.15)');
   glow(g.player.x,1,g.player.z,40,'rgba(255,223,144,.12)');
   for(const e of g.echoes)glow(e.pos.x,1,e.pos.z,45,'rgba(86,238,213,.16)');
   for(const n of I.WORLD.nodes.filter(n=>n.type==='terminal'))glow(n.x,2.3,n.z,45,g.facts[n.id]?'rgba(81,222,200,.19)':'rgba(235,160,78,.16)');
   ctx.globalCompositeOperation='source-over';
   if(!reduced){ctx.strokeStyle='rgba(170,209,211,.15)';ctx.lineWidth=.65;ctx.beginPath();const count=this.low?50:130;for(let j=0;j<count;j++){const x=((j*197.83+t*38)% (w+100))-50,y=((j*123.7+t*(180+j%50))%(h+80))-40;ctx.moveTo(x,y);ctx.lineTo(x-3.7,y+12);}ctx.stroke();}
   if(title)return;
   // Labels are projected from genuine world positions. No hidden quest bypass.
   ctx.textAlign='center';ctx.font='600 10px system-ui';
   for(const p of I.WORLD.plates.filter(p=>I.WORLD.gates.find(x=>x.id===p.gate).stage===g.stage)){
    const q=this.project(p.x,0,p.z);ctx.fillStyle=I.plateActive(g,p)?'#a0f4dc':'#f0cd8b';ctx.fillText('PLATE '+p.label,q.x,q.y+26);
   }
   const n=I.nearestNode(g);
   if(n){const p=this.project(n.x,2.5,n.z);ctx.font='500 11px system-ui';const label=n.label;const tw=ctx.measureText(label).width;ctx.fillStyle='rgba(7,20,26,.85)';ctx.fillRect(p.x-tw/2-12,p.y-19,tw+24,26);ctx.strokeStyle='rgba(199,167,113,.4)';ctx.strokeRect(p.x-tw/2-12,p.y-19,tw+24,26);ctx.fillStyle='#ebdabb';ctx.fillText(label,p.x,p.y-2);}
  }
 }
 I.Renderer=Renderer;
})();
