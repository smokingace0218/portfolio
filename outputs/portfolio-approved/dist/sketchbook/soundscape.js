/* One score at a time. Theme changes keep a steady level and then leave only the new theme. */
const requestedScoreTracks={world:'Lumos! (Hedwig’s Theme)',me:'Platform Nine-and-Three-Quarters and the Journey to Hogwarts',sant:'Diagon Alley and the Gringotts Vault',janitri:'Fireworks',ministry:'The Ministry of Magic',nift:'The Arrival of Baby Harry'};
const worldSound=(()=>{
 const button=document.createElement('button');
 button.id='sound-toggle';
 document.querySelector('.utilities').append(button);
 const volume=.38,cache={},library={},wires=new WeakMap(),rides=new WeakMap(),direct=new Map();
 let current='world',muted=false,blocked=false,active=null,fading=null,pending=null,token=0,starting=null,mix=0,ctx=null,master=null,directRaf=0;
 try{muted=localStorage.getItem('world-music-muted')==='true'}catch{}
 const positions={},loopBuffers={},loopJobs={};
 const srcFor=id=>'assets/audio/'+id+'.mp3?v=125-seamless-loop';
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=t=>{const x=clamp(t);return x*x*(3-2*x)};
 function ui(){
  const on=!muted&&!blocked;
  button.innerHTML=on?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12-.5a5 5 0 0 1 0 7m2-9a8 8 0 0 1 0 11"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12 1 5 5m0-5-5 5"/></svg>';
  button.setAttribute('aria-pressed',String(on));
  button.setAttribute('aria-label',on?'Turn background music off':(blocked?'Start background music':'Turn background music on'));
  button.title=on?'Turn sound off':(blocked?'Start the music':'Turn sound on');
 }
 function context(){
  if(ctx)return ctx;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  ctx=new AC();
  master=ctx.createGain();
  master.gain.value=1;
  master.connect(ctx.destination);
  return ctx;
 }
 function poke(){
  const audioCtx=context();
  if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
  return !!(audioCtx&&audioCtx.state==='running');
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
 function seamless(id){
  if(loopBuffers[id])return Promise.resolve(loopBuffers[id]);
  if(!loopJobs[id]){
   const audioCtx=context();
   loopJobs[id]=fetch(srcFor(id)).then(r=>{if(!r.ok)throw new Error('audio');return r.arrayBuffer()}).then(ab=>audioCtx.decodeAudioData(ab.slice(0))).then(stitch).then(b=>{loopBuffers[id]=b;return b}).catch(err=>{delete loopJobs[id];throw err});
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
  audio.preload='auto';audio.loop=true;audio.volume=0;audio.dataset.track=id;audio.src=srcFor(id);
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
  if(poke())return ensureGain(audio);
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
 async function begin(audio){
  if(poke()){
   try{
    const buffer=await seamless(audio.dataset.track);
    const gain=ensureGain(audio);
    if(gain&&!muted&&!document.hidden){startVoice(audio,buffer,gain);return 'ok'}
   }catch{}
  }
  if(!audio.src)audio.src=srcFor(audio.dataset.track);
  audio.dataset.route='direct';
  return elementBegin(audio);
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
  if(mine!==token||muted||document.hidden){
   if(next!==active&&next!==fading&&next!==pending)halt(next);
   if(pending===next)pending=null;
   if(starting===mineId)starting=null;
   return;
  }
  const started=outcome==='ok'||outcome==='playing'||(outcome==='timeout'&&sounding(next));
  if(!started||!sounding(next)){
   blocked=true;
   if(next!==active&&next!==fading)halt(next);
   if(pending===next)pending=null;
   if(starting===mineId)starting=null;
   ui();
   return;
  }
  blocked=false;
  if(pending===next)pending=null;
  if(starting===mineId)starting=null;
  active=next;
  const outgoing=previous&&previous!==next&&sounding(previous)?previous:null;
  handoff(next,outgoing,outgoing?680:420);
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
  poke();
  if(blocked&&!muted){play();return}
  muted=!muted;
  try{localStorage.setItem('world-music-muted',String(muted))}catch{}
  if(muted)stopScore();
  else play();
  ui();
 };
 document.addEventListener('pointerdown',e=>{
  if(e.target.closest?.('#sound-toggle'))return;
  poke();
  if(!muted)play();
 },{capture:true,passive:true});
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){poke();if(!muted)play()}});
 window.addEventListener('pageshow',e=>{if(e.persisted&&!muted){poke();play()}});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
   token++;starting=null;mix++;
   remember(active);remember(fading);remember(pending);
   halt(active);halt(fading);halt(pending);
   fading=null;pending=null;
  }else if(!muted){poke();play()}
 });
 ui();
 poke();
 if(!muted)play();
 return{
  destination(id){
   const next=requestedScoreTracks[id]?id:'world';
   if(next===current&&settledOn(next))return;
   current=next;ui();play();
  },
  preload(id){
   if(!requestedScoreTracks[id])return;
   if(poke())seamless(id).catch(()=>{});
   if(cache[id]||library[id]||active?.dataset.track===id||fading?.dataset.track===id||pending?.dataset.track===id)return;
   const audio=new Audio();
   audio.preload='none';audio.loop=true;audio.volume=0;audio.dataset.track=id;
   cache[id]=audio;
  },
  paper(){}
 };
})();
