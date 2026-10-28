/* Shared landmark registration for both halves of the same reversible camera path. */
const CameraRegistration=(()=>{
 const profiles={
  nift:{wide:[.50,.47],wideSpan:.23,day:{anchor:[.51,.73],span:.65},night:{anchor:[.46,.66],span:.64},bow:[-.014,-.014]},
  sant:{wide:[.85,.64],wideSpan:.17,day:{anchor:[.65,.79],span:.60},night:{anchor:[.65,.80],span:.60},bow:[-.012,.008]},
  janitri:{wide:[.855,.43],wideSpan:.17,day:{anchor:[.60,.75],span:.66},night:{anchor:[.60,.74],span:.66},bow:[-.012,-.008]},
  ministry:{wide:[.927,.24],wideSpan:.15,day:{anchor:[.69,.74],span:.37},night:{anchor:[.68,.74],span:.37},bow:[-.010,-.010]},
  me:{wide:[.84,.77],wideSpan:.10,day:{anchor:[.67,.58],span:.32},night:{anchor:[.64,.60],span:.32},bow:[-.010,.012]}
 };
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*t*(10+t*(-15+6*t))};
 // Almost even speed, with a short shoulder so the tap does not kick or brake.
 // The slope stays above 0.9, so the dolly never sits.
 const pace=t=>{t=clamp(t,0,1);const s=t*t*(3-2*t);return s*.06+t*.94};
 // Ease into the frame edge. A hard clamp stops the pan while the zoom keeps going.
 const easeEdge=(x,lo,hi)=>{if(!(hi>lo))return (lo+hi)/2||x;const m=Math.min(.05,(hi-lo)*.28);if(x<=lo)return lo;if(x>=hi)return hi;const glide=t=>t*t*(2-t);if(x<lo+m){const t=(x-lo)/m;return lo+m*glide(t)}if(x>hi-m){const t=(hi-x)/m;return hi-m*glide(t)}return x};
  function view(id,progress,viewport,scene,home,idle=0,pointer={x:0,y:0}){
  const profile=profiles[id];if(!profile)return null;const p=clamp(progress,0,1),travel=pace(p);
  // The closeup is the same framing as the dolly. A second crop used to slide across it on the way in and the way out.
  const fade=clamp((p-.2)/.68,0,1),alpha=fade*fade*(3-2*fade),aspect=1672/941;
  const cover=Math.max(viewport.w/1672,viewport.h/941),photoW=1672*cover*1.065,photoH=941*cover*1.065;
  const portrait=clamp((1.15-viewport.w/viewport.h)/.65,0,1);
  const horizontalBias=id==='ministry'?viewport.w*.07*(1-portrait):0;
  const centredLeft=(viewport.w-photoW)/2+horizontalBias;
  const focusedLeft=viewport.w*.55-profile.day.anchor[0]*photoW;
  const destLeft=clamp(mix(centredLeft,focusedLeft,portrait),viewport.w-photoW,0),destTop=clamp((viewport.h-photoH)/2,viewport.h-photoH,0);
  const finalAnchor={x:destLeft+profile.day.anchor[0]*photoW,y:destTop+profile.day.anchor[1]*photoH};
  const endZ=clamp(photoH*profile.day.span/(scene.h*profile.wideSpan),1.6,5.5),startZ=1+home.push;
  const z=Math.exp(mix(Math.log(startZ),Math.log(endZ),travel));
  const bounds=z=>({left:(.5+scene.x/scene.w)/z,right:1-((viewport.w-scene.x)/scene.w-.5)/z,top:(.5+scene.y/scene.h)/z,bottom:1-((viewport.h-scene.y)/scene.h-.5)/z});
  const endBounds=bounds(endZ);
  const endFocus={x:clamp(profile.wide[0]-((finalAnchor.x-scene.x)/scene.w-.5)/endZ,endBounds.left,endBounds.right),y:clamp(profile.wide[1]-((finalAnchor.y-scene.y)/scene.h-.5)/endZ,endBounds.top,endBounds.bottom)};
  const project=(focus,zoom)=>({x:scene.x+scene.w*(.5+(profile.wide[0]-focus.x)*zoom),y:scene.y+scene.h*(.5+(profile.wide[1]-focus.y)*zoom)});
  const initial=project({x:home.focusX,y:home.focusY},startZ),dock=project(endFocus,endZ),curve=16*travel*travel*(1-travel)*(1-travel);
  const pathAnchor={x:mix(initial.x,dock.x,travel)+profile.bow[0]*viewport.w*curve,y:mix(initial.y,dock.y,travel)+profile.bow[1]*viewport.h*curve};
  const viewBounds=bounds(z);
  const focus={x:easeEdge(profile.wide[0]-((pathAnchor.x-scene.x)/scene.w-.5)/z,viewBounds.left,viewBounds.right),y:easeEdge(profile.wide[1]-((pathAnchor.y-scene.y)/scene.h-.5)/z,viewBounds.top,viewBounds.bottom)};
  const wideAnchor=project(focus,z);
  const span=scene.h*z*profile.wideSpan;
  const plate=theme=>{const a=profile[theme].anchor,h=span/profile[theme].span,w=h*aspect;
   return{x:wideAnchor.x-a[0]*w,y:wideAnchor.y-a[1]*h,w,h,anchor:a};
  };
  return{progress:p,alpha,phase:p<.22?'world':p<.9?'approach':'landing',wide:{push:z-1,focusX:focus.x,focusY:focus.y},wideAnchor,finalAnchor,day:plate('day'),night:plate('night')};
 }
 return{view,profiles,smooth};
})();
