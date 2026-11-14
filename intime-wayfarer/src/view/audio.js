/* Optional, quiet, synthesized audio. No fetched audio assets or microphone. */
(() => {
 'use strict';const I=globalThis.IT;
 class Sound {
  constructor(){this.enabled=false;this.context=null;this.master=null;}
  async toggle(){
   if(!this.context){const A=globalThis.AudioContext||globalThis.webkitAudioContext;if(!A)return false;this.context=new A();this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);
    for(const f of [55,110,164.81]){const o=this.context.createOscillator(),gain=this.context.createGain();o.type='sine';o.frequency.value=f;gain.gain.value=.027;o.connect(gain);gain.connect(this.master);o.start();}
   }
   await this.context.resume();this.enabled=!this.enabled;this.master.gain.setTargetAtTime(this.enabled?.65:0,this.context.currentTime,.2);return this.enabled;
  }
  tone(kind='step'){
   if(!this.enabled||!this.context)return;const c=this.context,t=c.currentTime;
   const notes={step:[95,.027,.08],echo:[329.63,.12,.65],pulse:[110,.13,.7],anchor:[523.25,.09,1.4],memory:[659.25,.07,.75],click:[220,.045,.11],fail:[65,.1,.9]};
   const [f,v,d]=notes[kind]||notes.click,o=c.createOscillator(),a=c.createGain();o.type=kind==='pulse'?'triangle':'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(kind==='echo'?f*2:f*.8,t+d);a.gain.setValueAtTime(.0001,t);a.gain.exponentialRampToValueAtTime(v,t+.012);a.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(a);a.connect(this.master);o.start();o.stop(t+d+.05);o.onended=()=>{o.disconnect();a.disconnect();};
  }
 }
 I.Sound=Sound;
})();
