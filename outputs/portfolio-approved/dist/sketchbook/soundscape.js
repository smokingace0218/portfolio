/* One score at a time. Theme changes keep a steady level and then leave only the new theme. */
const requestedScoreTracks={world:'Lumos! (Hedwig’s Theme)',me:'Platform Nine-and-Three-Quarters and the Journey to Hogwarts',sant:'Diagon Alley and the Gringotts Vault',janitri:'Fireworks',ministry:'The Ministry of Magic',nift:'The Arrival of Baby Harry'};
const worldSound=(()=>{
 const button=document.createElement('button');
 button.id='sound-toggle';
 document.querySelector('.utilities').append(button);
 const volume=.38,cache={},library={},wires=new WeakMap(),rides=new WeakMap(),direct=new Map();
 let current='world',muted=false,active=null,fading=null,pending=null,token=0,starting=null,mix=0,ctx=null,master=null,directRaf=0;
 try{muted=localStorage.getItem('world-music-muted')==='true'}catch{}
 const positions={},loopBuffers={},loopJobs={};
 const srcFor=id=>'assets/audio/'+id+'.mp3?v=125-seamless-loop';
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=t=>{const x=clamp(t);return x*x*(3-2*x)};
 function ui(){
  const on=!muted;
  button.innerHTML=on?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12-.5a5 5 0 0 1 0 7m2-9a8 8 0 0 1 0 11"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12 1 5 5m0-5-5 5"/></svg>';
  button.setAttribute('aria-pressed',String(on));
  button.setAttribute('aria-label',on?'Turn background music off':'Turn background music on');
  button.title=on?'Turn sound off':'Turn sound on';
 }
 function context(){
  if(ctx)return ctx;
  const existing=window.__worldAudio;
  if(existing&&existing.state!=='closed')ctx=existing;
  else{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)return null;
   ctx=new AC();
   window.__worldAudio=ctx;
  }
  if(!master){
   master=ctx.createGain();
   master.gain.value=1;
   master.connect(ctx.destination);
  }
  return ctx;
 }
 function awake(){return !!(ctx&&ctx.state==='running')}
 function poke(){
  const audioCtx=context();
  if(!audioCtx)return Promise.resolve(false);
  if(audioCtx.state==='running')return Promise.resolve(true);
  let resumed;
  try{resumed=audioCtx.resume()}catch{return Promise.resolve(false)}
  const ready=()=>audioCtx.state==='running';
  const promise=(resumed&&typeof resumed.then==='function')?resumed.then(ready,()=>false):Promise.resolve(ready());
  return Promise.race([promise,new Promise(resolve=>setTimeout(()=>resolve(audioCtx.state==='running'),250))]);
 }
 function prime(){
  if(muted||document.hidden)return;
  const audioCtx=context();
  if(audioCtx&&audioCtx.state!=='running'){
   try{const resumed=audioCtx.resume();if(resumed&&resumed.catch)resumed.catch(()=>{})}catch{}
  }
  const audio=take(current);
  if(!audio||(audio.dataset.sounding==='1'&&audio.dataset.route==='graph'))return;
  try{
   if(!audio.src)audio.src=srcFor(audio.dataset.track||current);
   audio.loop=true;
   if(audio.paused){
    audio.volume=0;
    const attempt=audio.play();
    if(attempt&&attempt.catch)attempt.catch(()=>{});
   }
  }catch{}
 }
 function nudge(){
  if(muted||document.hidden)return;
  prime();
  poke();
  play();
 }
 function watchContext(){
  const audioCtx=context();
  if(!audioCtx||audioCtx.__sketchWatch)return;
  audioCtx.__sketchWatch=true;
  audioCtx.addEventListener('statechange',()=>{
   if(audioCtx.state==='running'&&!muted&&!document.hidden)play();
  });
 }
 let retries=0;
 function armRetries(){
  if(retries||muted)return;
  retries=1;
  [400,1100,2200,4000].forEach(ms=>setTimeout(()=>{
   if(muted||document.hidden||settledOn(current))return;
   poke();
   play();
  },ms));
 }
 function stitch(buffer){
  const rate=buffer.sampleRate,channels=buffer.numberOfChannels,n=buffer.length;
  const fade=Math.max(32,Math.round(rate*.16));
  const data=[];for(let c=0;c<channels;c++)data.push(buffer.getChannelData(c));
  const loud=i=>{let s=0;for(let c=0;c<channels;c++){const v=data[c][i]||0;s+=v*v}return s/channels};
  const window=Math.max(1,Math.round(rate*.02)),gate=0.000004;
  const rms=i=>{let s=0,k=0;for(let j=0;j<window&&i+j<n;j++){s+=loud(i+j);k++}return k?s/k:0};
  let start=0,end=n;
  for(let i=0;i<=n-window;i+=window){if(rms(i)>gate){start=i;break}}
  for(let i=n-window;i>=0;i-=window){if(rms(i)>gate){end=Math.min(n,i+window);break}}
  if(end-start<fade*4)return buffer;
  const length=end-start,outLen=length-fade,out=ctx.createBuffer(channels,outLen,rate);
  for(let c=0;c<channels;c++){
   const src=data[c],dst=out.getChannelData(c),base=start;
   for(let i=0;i<outLen;i++){
    let sample=src[base+i];
    if(i<fade){const t=i/fade,fi=Math.sin(t*Math.PI/2),fo=Math.cos(t*Math.PI/2);sample=sample*fi+src[base+length-fade+i]*fo}
    dst[i]=sample;
   }
  }
  return out;
 }
 function sceneBusy(){
  return document.hidden||!!window.__sketchTraveling||!!document.querySelector('dialog[open]');
 }
 let stitchChain=Promise.resolve();
 function whenCalm(){
  return new Promise(resolve=>{
   const wait=()=>{
    if(!sceneBusy()){
     if(window.requestIdleCallback)requestIdleCallback(()=>resolve(),{timeout:700});
     else setTimeout(resolve,16);
     return;
    }
    setTimeout(wait,180);
   };
   wait();
  });
 }
 function stitchLater(buffer){
  const job=stitchChain.then(()=>whenCalm()).then(()=>new Promise(resolve=>setTimeout(()=>resolve(stitch(buffer)),0)));
  stitchChain=job.then(()=>{},()=>{});
  return job;
 }
 function seamless(id){
  if(loopBuffers[id])return Promise.resolve(loopBuffers[id]);
  if(!loopJobs[id]){
   const audioCtx=context();
   loopJobs[id]=fetch(srcFor(id)).then(r=>{if(!r.ok)throw new Error('audio');return r.arrayBuffer()}).then(ab=>audioCtx.decodeAudioData(ab.slice(0))).then(buffer=>stitchLater(buffer)).then(b=>{loopBuffers[id]=b;return b}).catch(err=>{delete loopJobs[id];throw err});
  }
  return loopJobs[id];
 }
 function remember(audio){
  if(!audio)return;
  const id=audio.dataset.track,voice=audio._voice;
  if(voice&&ctx&&audio.dataset.sounding==='1'){
   const dur=voice.buffer.duration||1;
   positions[id]=((voice.offset+ctx.currentTime-voice.started)%dur+dur)%dur;
   return;
  }
  try{positions[id]=audio.currentTime||positions[id]||0}catch{}
 }
 function sounding(audio){return !!audio&&audio.dataset.sounding==='1'&&(audio.dataset.route==='graph'||!audio.paused)}
 function ensureGain(audio){
  if(wires.has(audio))return wires.get(audio);
  if(!ctx)return null;
  const gain=ctx.createGain();
  gain.gain.value=0;
  gain.connect(master);
  wires.set(audio,gain);
  audio.dataset.route='graph';
  audio.volume=1;
  return gain;
 }
 function startVoice(audio,buffer,gain){
  remember(audio);
  if(audio._voice){try{audio._voice.source.stop()}catch{}try{audio._voice.source.disconnect()}catch{}audio._voice=null}
  const source=ctx.createBufferSource();
  source.buffer=buffer;
  source.loop=true;
  source.connect(gain);
  const dur=buffer.duration||1,saved=positions[audio.dataset.track]||0,off=((saved%dur)+dur)%dur,now=ctx.currentTime;
  source.start(now,off);
  audio._voice={source,buffer,started:now,offset:off};
  if(!audio.paused)audio.pause();
  audio.dataset.route='graph';
  audio.dataset.sounding='1';
 }
 function graphLevel(audio,now){
  const ride=rides.get(audio);
  if(!ride)return 0;
  const span=ride.end-ride.start;
  const p=span<=0?1:clamp((now-ride.start)/span);
  return ride.from+(ride.to-ride.from)*p;
 }
 function halt(audio){
  if(!audio)return;
  remember(audio);
  if(audio._voice){try{audio._voice.source.stop()}catch{}try{audio._voice.source.disconnect()}catch{}audio._voice=null}
  audio.dataset.sounding='0';
  direct.delete(audio);
  const gain=wires.get(audio);
  if(gain&&ctx){
   const now=ctx.currentTime;
   gain.gain.cancelScheduledValues(now);
   gain.gain.setValueAtTime(0,now);
   rides.set(audio,{from:0,to:0,start:now,end:now});
  }
  if(audio.dataset.route!=='graph')audio.volume=0;
  if(!audio.paused)audio.pause();
 }
 function stray(keep){
  const bed=document.getElementById('opening-score');
  const seen=new Set();
  for(const audio of [bed,active,fading,pending,...Object.values(cache)]){
   if(!audio||seen.has(audio))continue;
   seen.add(audio);
   if(!keep.has(audio))halt(audio);
  }
 }
 function take(id){
  if(active?.dataset.track===id)return active;
  if(fading?.dataset.track===id){const saved=fading;fading=null;return saved}
  if(pending?.dataset.track===id)return pending;
  if(cache[id]){const saved=cache[id];delete cache[id];library[id]=saved;return saved}
  if(library[id])return library[id];
  const audio=new Audio();
  audio.preload='auto';audio.loop=true;audio.autoplay=!muted;audio.volume=0;audio.dataset.track=id;audio.src=srcFor(id);
  library[id]=audio;
  return audio;
 }
 function recall(audio,reset){
  const at=reset?0:(positions[audio.dataset.track]||0);
  const apply=()=>{try{if(at>0.2&&Math.abs((audio.currentTime||0)-at)>0.3)audio.currentTime=at}catch{}};
  if(audio.readyState>=1)apply();else audio.addEventListener('loadedmetadata',apply,{once:true});
 }
 function allowed(audio){
  return audio===active||audio===fading||audio===pending;
 }
 function watch(audio){
  if(audio.dataset.watched==='1')return;
  audio.dataset.watched='1';
  audio.addEventListener('playing',()=>{if(muted||document.hidden||!allowed(audio))halt(audio)});
 }
 function attach(audio){
  if(awake())return ensureGain(audio);
  audio.dataset.route='direct';
  return null;
 }
 function stepDirect(){
  directRaf=0;
  const now=performance.now();
  for(const [audio,job] of direct){
   const p=Math.min(1,(now-job.started)/job.ms);
   audio.volume=clamp(job.from+(job.to-job.from)*smooth(p));
   if(p>=1)direct.delete(audio);
  }
  if(direct.size)directRaf=requestAnimationFrame(stepDirect);
 }
 function slide(audio,to,ms){
  const gain=wires.get(audio);
  if(gain&&ctx&&ctx.state==='running'){
   const now=ctx.currentTime;
   const from=graphLevel(audio,now);
   const end=now+ms/1000;
   gain.gain.cancelScheduledValues(now);
   gain.gain.setValueAtTime(clamp(from),now);
   gain.gain.linearRampToValueAtTime(clamp(to),end);
   rides.set(audio,{from,to,start:now,end});
   return;
  }
  direct.set(audio,{from:audio.volume,to,started:performance.now(),ms});
  if(!directRaf)directRaf=requestAnimationFrame(stepDirect);
  for(const at of [48,120,220,360,ms+40])setTimeout(stepDirect,at);
 }
 function finishMix(job,outgoing,incoming){
  if(job!==mix)return;
  if(outgoing&&outgoing!==incoming)halt(outgoing);
  if(fading===outgoing)fading=null;
  stray(new Set([incoming].filter(Boolean)));
  ui();
 }
 function handoff(incoming,outgoing,ms){
  const job=++mix;
  if(outgoing&&outgoing!==incoming){
   if(fading&&fading!==outgoing&&fading!==incoming)halt(fading);
   fading=outgoing;
  }else{
   if(fading&&fading!==incoming)halt(fading);
   fading=null;
   outgoing=null;
  }
  stray(new Set([incoming,outgoing].filter(Boolean)));
  if(outgoing)slide(outgoing,0,ms);
  if(incoming)slide(incoming,volume,ms);
  let settled=false;
  const finish=()=>{if(settled)return;settled=true;if(outgoing)outgoing.removeEventListener('timeupdate',onTime);finishMix(job,outgoing,incoming)};
  function onTime(){
   if(job!==mix){outgoing&&outgoing.removeEventListener('timeupdate',onTime);return}
   const ride=outgoing&&rides.get(outgoing);
   if(ride&&ctx&&ctx.currentTime<ride.end-0.03)return;
   if(!ride&&outgoing&&outgoing.dataset.route!=='graph'&&outgoing.volume>0.001)return;
   finish();
  }
  if(outgoing)outgoing.addEventListener('timeupdate',onTime);
  setTimeout(()=>{if(job===mix)finish()},ms+90);
 }
 function elementBegin(audio){
  return new Promise(resolve=>{
   let done=false;
   const finish=value=>{if(!done){done=true;resolve(value)}};
   audio.addEventListener('playing',()=>{audio.dataset.sounding='1';finish('playing')},{once:true});
   const attempt=audio.play();
   if(attempt&&typeof attempt.then==='function')attempt.then(()=>{audio.dataset.sounding='1';finish('ok')},err=>finish(err));
   else{audio.dataset.sounding='1';finish('ok')}
   setTimeout(()=>finish('timeout'),1200);
  });
 }
 function adoptBuffer(audio,buffer){
  if(!buffer||muted||document.hidden||!ctx||ctx.state!=='running')return;
  if(audio!==active&&audio!==pending&&audio!==fading)return;
  const gain=ensureGain(audio);
  if(!gain)return;
  const now=ctx.currentTime;
  const ride=rides.get(audio);
  const job=direct.get(audio);
  const level=audio.dataset.route==='graph'?graphLevel(audio,now):(audio.volume||0);
  const target=job?job.to:(ride&&ride.end>now+.02?ride.to:level);
  startVoice(audio,buffer,gain);
  direct.delete(audio);
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(clamp(level),now);
  if(Math.abs(target-level)>.001){
   const remain=job?Math.max(.06,(job.started+job.ms-performance.now())/1000):Math.max(.06,(ride?ride.end:now)-now);
   const end=now+remain;
   gain.gain.linearRampToValueAtTime(clamp(target),end);
   rides.set(audio,{from:level,to:target,start:now,end});
  }else rides.set(audio,{from:level,to:level,start:now,end:now});
 }
 async function begin(audio){
  if(muted||document.hidden)return 'skip';
  const id=audio.dataset.track;
  if(loopBuffers[id]&&await poke()){
   if(muted||document.hidden)return 'skip';
   const gain=ensureGain(audio);
   if(gain){startVoice(audio,loopBuffers[id],gain);return 'ok'}
  }
  if(!audio.src)audio.src=srcFor(id);
  audio.preload='auto';
  audio.dataset.route='direct';
  const outcome=elementBegin(audio);
  if((awake()||context())&&!sceneBusy())seamless(id).then(buffer=>adoptBuffer(audio,buffer)).catch(()=>{});
  return outcome;
 }
 function settledOn(id){
  return pending?.dataset.track===id||(active?.dataset.track===id&&sounding(active)&&fading!==active);
 }
 async function play(force=false){
  if(muted||document.hidden)return;
  if(!force&&settledOn(current))return;
  if(!force&&starting===current)return;
  const mineId=current;
  starting=mineId;
  const mine=++token;
  const next=take(mineId);
  const previous=active&&active!==next&&sounding(active)?active:null;
  if(pending&&pending!==next&&pending!==previous)halt(pending);
  pending=next;
  stray(new Set([next,previous].filter(Boolean)));
  next.loop=true;
  attach(next);
  if(previous)attach(previous);
  if(!sounding(next)){
   if(next.dataset.route==='graph'){
    const gain=wires.get(next);
    if(gain&&ctx){const now=ctx.currentTime;gain.gain.cancelScheduledValues(now);gain.gain.setValueAtTime(0,now);rides.set(next,{from:0,to:0,start:now,end:now})}
   }else next.volume=0;
  }
  recall(next,force);
  watch(next);
  const outcome=await begin(next);
  if(outcome==='skip'||mine!==token||muted||document.hidden){
   if(pending===next)pending=null;
   if(starting===mineId)starting=null;
   if(next!==active&&next!==fading)halt(next);
   return;
  }
  const started=outcome==='ok'||outcome==='playing'||(outcome==='timeout'&&sounding(next));
  if(!started||!sounding(next)){
   if(next!==active&&next!==fading)halt(next);
   if(pending===next)pending=null;
   if(starting===mineId)starting=null;
   ui();
   return;
  }
  if(pending===next)pending=null;
  if(starting===mineId)starting=null;
  active=next;
  const outgoing=previous&&previous!==next&&sounding(previous)?previous:null;
  handoff(next,outgoing,outgoing?180:90);
  ui();
 }
 function stopScore(){
  token++;starting=null;
  if(pending&&pending!==active)halt(pending);
  pending=null;
  const old=active&&sounding(active)?active:null;
  if(fading&&fading!==old)halt(fading);
  active=null;fading=null;
  if(old)handoff(null,old,380);
  else ui();
 }
 button.onclick=e=>{
  e.stopPropagation();
  muted=!muted;
  try{localStorage.setItem('world-music-muted',String(muted))}catch{}
  if(muted)stopScore();
  else{prime();poke();play()}
  ui();
 };
 const unlock=e=>{if(e.target.closest?.('#sound-toggle'))return;nudge()};
 document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
 document.addEventListener('touchstart',unlock,{capture:true,passive:true});
 document.addEventListener('click',unlock,{capture:true,passive:true});
 document.addEventListener('keydown',e=>{if(!e.repeat)nudge()});
 window.addEventListener('pageshow',()=>{if(!muted){poke();play()}});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
   token++;starting=null;mix++;
   remember(active);remember(fading);remember(pending);
   halt(active);halt(fading);halt(pending);
   fading=null;pending=null;
  }else if(!muted){poke();play()}
 });
 watchContext();
 ui();
 poke();
 if(!muted){play();armRetries()}
 return{
  destination(id){
   const next=requestedScoreTracks[id]?id:'world';
   if(next===current&&settledOn(next))return;
   current=next;ui();play();
  },
  preload(id){
   if(!requestedScoreTracks[id])return;
   if(cache[id]||library[id]||active?.dataset.track===id||fading?.dataset.track===id||pending?.dataset.track===id)return;
   const audio=new Audio();
   audio.preload='auto';audio.loop=true;audio.volume=0;audio.dataset.track=id;audio.src=srcFor(id);
   cache[id]=audio;
  },
  warm(ids){
   const list=(ids||[]).filter(id=>requestedScoreTracks[id]&&!loopBuffers[id]);
   let i=0;
   const step=()=>{
    if(i>=list.length)return;
    if(sceneBusy()){setTimeout(step,240);return}
    const id=list[i++];
    if(loopBuffers[id]){step();return}
    const run=()=>seamless(id).catch(()=>{}).then(()=>{
     if(window.requestIdleCallback)requestIdleCallback(step,{timeout:1000});
     else setTimeout(step,180);
    });
    if(window.requestIdleCallback)requestIdleCallback(run,{timeout:1400});
    else setTimeout(run,80);
   };
   step();
  },
  paper(){},
  kick(){if(!muted&&!document.hidden){poke();play()}}
 };
})();
