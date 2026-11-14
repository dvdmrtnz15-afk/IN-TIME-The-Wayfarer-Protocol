/* Test utility, not bundled. Uses normal fixed-step inputs and gate-aware paths.
 * No coordinates, quest facts, timers, or save objects are written directly. */
window.routeTo = target => {
 const I=window.IT, initial=I.qa.state(), path=I.findPath(initial,target);
 if(!path)throw Error('No reachable route to '+JSON.stringify(target));
 for(const point of path){let loops=0;
  while(true){const g=I.qa.state(),dx=point.x-g.player.x,dz=point.z-g.player.z,d=Math.hypot(dx,dz);
   if(d<.17)break;if(g.mode!=='playing')throw Error('Route interrupted by '+g.mode);
   const speed=4.8*(I.activeCard(g).speed||1)*1.5/60;
   const count=Math.max(1,Math.min(8,Math.floor((d-.1)/speed)));
   I.qa.advance({x:dx/d,z:dz/d,sprint:true,pulse:g.stage>0&&g.totalTick>=g.pulseReadyAt},count);
   if(loops++>40)throw Error('Waypoint did not resolve '+JSON.stringify(point));
  }
 }
 return I.qa.state().player;
};
window.waitForEchoes=()=>{const g=IT.qa.state(),tick=Math.max(...g.echoes.map(e=>e.path.at(-1)[0]));IT.qa.advance({},Math.max(0,tick+2-g.loopTick));};
