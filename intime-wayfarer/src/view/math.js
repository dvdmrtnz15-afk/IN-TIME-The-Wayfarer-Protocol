/* Small column-major camera math. No third-party graphics dependency. */
(() => {
 'use strict';const I=globalThis.IT;
 const norm=a=>{const d=Math.hypot(...a)||1;return a.map(v=>v/d);};
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
 class Camera {
  set(target,span,aspect){
   this.target=target;this.span=span;this.aspect=aspect;
   this.back=norm([.75,1.18,.85]);this.right=norm(cross([0,1,0],this.back));this.up=cross(this.back,this.right);
   const t=[target.x,target.y,target.z],r=this.right,u=this.up,b=this.back;
   this.matrix=new Float32Array([r[0]/(span*aspect),u[0]/span,-b[0]/120,0,r[1]/(span*aspect),u[1]/span,-b[1]/120,0,r[2]/(span*aspect),u[2]/span,-b[2]/120,0,-dot(r,t)/(span*aspect),-dot(u,t)/span,dot(b,t)/120,1]);
  }
  project(x,y,z,w,h){const a=[x-this.target.x,y-this.target.y,z-this.target.z];return {x:(dot(a,this.right)/(this.span*this.aspect)+1)*w/2,y:(1-dot(a,this.up)/this.span)*h/2};}
  ground(x,y,w,h){
   const dx=(x/w*2-1)*this.span*this.aspect,dy=(1-y/h*2)*this.span;
   const p=[this.target.x+this.right[0]*dx+this.up[0]*dy,this.target.y+this.right[1]*dx+this.up[1]*dy,this.target.z+this.right[2]*dx+this.up[2]*dy];
   const k=-p[1]/this.back[1];return {x:p[0]+k*this.back[0],z:p[2]+k*this.back[2]};
  }
 }
 I.Camera=Camera;
})();
